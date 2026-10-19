import { NextResponse } from 'next/server';
import { getIndicatorsWithFallback } from '@/lib/db/indicators';
import { getCatalogStats } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase();
  const agama = searchParams.get('agama')?.toLowerCase();
  const kategori = searchParams.get('kategori');
  const terisi = searchParams.get('terisi');

  const allIndicators = await getIndicatorsWithFallback();
  let indicators = allIndicators;

  if (q) {
    indicators = indicators.filter(
      item =>
        item.nama.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q) ||
        item.sumberData.toLowerCase().includes(q)
    );
  }

  if (agama) {
    indicators = indicators.filter(item => item.agama.toLowerCase().includes(agama));
  }

  if (kategori) {
    indicators = indicators.filter(item => item.kategori === kategori);
  }

  if (terisi !== null && terisi !== undefined) {
    const isTerisi = terisi === 'true' || terisi === '1';
    indicators = indicators.filter(item => item.terisi === isTerisi);
  }

  return NextResponse.json(
    {
      status: 'success',
      total: indicators.length,
      stats: getCatalogStats(allIndicators),
      data: indicators,
    },
    {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    }
  );
}
