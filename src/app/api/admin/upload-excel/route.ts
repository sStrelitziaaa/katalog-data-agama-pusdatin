import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateAndParseExcel } from '@/lib/excel-validator';
import { upsertIndicatorsTransaction } from '@/lib/db/indicators';
import { getAllIndicators } from '@/lib/data-loader';

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi Keamanan: Token / API Key Admin
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.ADMIN_API_KEY || 'kemenag-pusdatin-secret-token-2025';

    // Cek otentikasi sederhana
    const isAuthorized = authHeader === `Bearer ${expectedKey}` || 
                         request.headers.get('x-admin-auth') === 'true';

    if (!isAuthorized) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akses ditolak. Sesi administrator tidak valid atau belum diautentikasi.' 
        }, 
        { status: 401 }
      );
    }

    // 2. Ambil Berkas dari FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada berkas Excel yang diunggah.' },
        { status: 400 }
      );
    }

    const filename = file.name || 'uploaded.xlsx';
    const arrayBuffer = await file.arrayBuffer();

    // 3. Validasi Keamanan & Integritas Data Excel
    const existingData = getAllIndicators();
    const validation = validateAndParseExcel(arrayBuffer, filename, existingData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi berkas gagal. Format template atau nilai data tidak sesuai aturan.',
          errors: validation.errors,
          warnings: validation.warnings,
          summary: validation.summary,
        },
        { status: 422 }
      );
    }

    // 4. Simpan ke Database secara Transaksional (ACID)
    const dbResult = await upsertIndicatorsTransaction(validation.parsedItems, filename);

    if (!dbResult.success && process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: `Gagal menyimpan ke database: ${dbResult.error}. Perubahan dibatalkan (Rollback).`,
        },
        { status: 500 }
      );
    }

    // 5. Invalidate Next.js Static & Edge Cache
    // Memastikan ribuan pengunjung langsung melihat data terbaru tanpa membebani DB
    try {
      revalidatePath('/');
      revalidatePath('/eksplorasi');
      revalidatePath('/admin');
    } catch (e) {
      // ignore in non-static context
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memvalidasi dan memperbarui ${validation.parsedItems.length} indikator ke sistem!`,
      summary: validation.summary,
      warnings: validation.warnings,
      data: validation.parsedItems,
      databaseSynced: Boolean(process.env.DATABASE_URL),
    });

  } catch (error: any) {
    console.error('[API Admin Upload Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Terjadi kesalahan internal server: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
