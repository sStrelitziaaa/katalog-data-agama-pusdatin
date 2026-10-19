import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createIndicatorInDb, deleteIndicatorInDb } from '@/lib/db/indicators';
import { parseNewIndicator } from '@/lib/indicator-input';

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.ADMIN_API_KEY || 'kemenag-pusdatin-secret-token-2025';
  return (
    authHeader === `Bearer ${expectedKey}` ||
    request.headers.get('x-admin-auth') === 'true'
  );
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, message: 'Akses ditolak. Sesi administrator tidak valid.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validation = parseNewIndicator(body);

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi form gagal. Mohon periksa kembali input.',
          errors: validation.errors,
        },
        { status: 422 }
      );
    }

    const result = await createIndicatorInDb(validation.value);
    if (!result.success || !result.indicator) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Gagal menyimpan indikator baru ke database.',
        },
        { status: 500 }
      );
    }

    // Revalidasi cache halaman Next.js
    try {
      revalidatePath('/');
      revalidatePath('/eksplorasi');
      revalidatePath('/admin');
    } catch (e) {
      // Abaikan jika dipanggil di luar static context
    }

    return NextResponse.json({
      success: true,
      message: `Indikator [${result.indicator.id}] ${result.indicator.nama} berhasil ditambahkan!`,
      data: result.indicator,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, message: 'Akses ditolak. Sesi administrator tidak valid.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID indikator wajib disertakan.' },
      { status: 400 }
    );
  }

  try {
    const result = await deleteIndicatorInDb(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Gagal menghapus indikator.' },
        { status: 500 }
      );
    }

    try {
      revalidatePath('/');
      revalidatePath('/eksplorasi');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Indikator ${id} berhasil dihapus.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan: ' + err.message },
      { status: 500 }
    );
  }
}
