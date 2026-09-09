import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Home, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Database, 
  Calendar, 
  MapPin, 
  User, 
  Layers, 
  Share2, 
  Download, 
  FileSpreadsheet,
  Info,
  TrendingUp,
  Tag,
  BarChart3
} from 'lucide-react';
import { getAllIndicators, getIndicatorById } from '@/lib/data-loader';
import TrendChart from '@/components/TrendChart';

// Next.js 15 dynamic route params
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const indicators = getAllIndicators();
  return indicators.map(item => ({
    id: item.id,
  }));
}

export default async function IndicatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const indicator = getIndicatorById(id);

  if (!indicator) {
    notFound();
  }

  // Get related indicators from same category or bimas
  const allIndicators = getAllIndicators();
  const relatedIndicators = allIndicators
    .filter(item => item.id !== indicator.id && (item.kategori === indicator.kategori || item.bimas === indicator.bimas))
    .slice(0, 4);

  // Growth calculation (2020 vs 2024)
  const firstVal = indicator.trenData[0]?.nilai || 1;
  const lastVal = indicator.trenData[indicator.trenData.length - 1]?.nilai || 1;
  const growthRate = Math.round(((lastVal - firstVal) / firstVal) * 100);

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const getAgamaBadgeColor = (agama: string) => {
    switch (agama) {
      case 'Islam':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Kristen':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Katolik':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Hindu':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Buddha':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Khonghucu':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-teal-50 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-emerald-700 flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/eksplorasi" className="hover:text-emerald-700">
            Eksplorasi Data
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-800 font-bold font-mono">{indicator.id}</span>
        </nav>

        <Link
          href="/eksplorasi"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Eksplorasi</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-gray-900 text-white font-mono text-xs font-bold">
            {indicator.id}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getAgamaBadgeColor(indicator.agama)}`}>
            {indicator.agama}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium">
            {indicator.bimas}
          </span>
          {indicator.terisi ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terisi / Terintegrasi</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Dalam Proses Integrasi</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {indicator.nama}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {indicator.deskripsi}
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-500 font-medium block">Rumpun Kategori</span>
            <strong className="text-xs sm:text-sm text-gray-900 mt-0.5 block truncate">
              {indicator.kategori}
            </strong>
          </div>
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-500 font-medium block">Satuan Ukuran</span>
            <strong className="text-xs sm:text-sm text-gray-900 mt-0.5 block truncate">
              {indicator.satuan}
            </strong>
          </div>
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-500 font-medium block">Nilai Terbaru (2024)</span>
            <strong className="text-xs sm:text-sm text-emerald-700 mt-0.5 block truncate">
              {formatNumber(lastVal)} {indicator.satuan}
            </strong>
          </div>
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <span className="text-[11px] text-gray-500 font-medium block">Pertumbuhan 5 Thn</span>
            <strong className={`text-xs sm:text-sm mt-0.5 block truncate ${growthRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualisasi Chart & Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recharts Chart & Historical Table */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visualisasi Grafik Tren */}
          <TrendChart 
            data={indicator.trenData} 
            satuan={indicator.satuan} 
            namaIndikator={indicator.nama} 
          />

          {/* Tabel Rincian Data Historis Runtun Waktu */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  Rincian Data Runtun Waktu Per Tahun
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rekapitulasi data resmi terintegrasi pada sistem Pusdatin
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Tahun</th>
                    <th className="px-4 py-3 text-right">Nilai Terukur</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3">Status Verifikasi</th>
                    <th className="px-4 py-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {indicator.trenData.map((item, idx) => (
                    <tr key={item.tahun} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{item.tahun}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                        {formatNumber(item.nilai)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.satuan}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-[11px]">
                        {item.catatan || 'Data rujukan Pusdatin'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Complete Metadata Sidebar & Related Indicators */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Metadata & Tata Kelola Data</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">Produsen / Sistem Sumber</span>
                <span className="font-bold text-gray-900 mt-0.5 block">
                  {indicator.sumberData}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">Ditjen / Bimas Pengampu</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">
                  {indicator.bimas}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">PIC Tim Pengelola Pusdatin</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-gray-900">{indicator.pic}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">Cakupan Wilayah Data</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-gray-800">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{indicator.cakupanWilayah}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">Frekuensi Pemutakhiran</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-gray-800">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{indicator.frekuensiUpdate}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] font-medium uppercase">Terakhir Diperbarui</span>
                <span className="font-mono text-gray-700 mt-0.5 block">
                  {indicator.terakhirDiperbarui}
                </span>
              </div>
            </div>

            {/* Tag List */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-gray-400 block text-[11px] font-medium uppercase mb-2">Tag Klasifikasi</span>
              <div className="flex flex-wrap gap-1.5">
                {indicator.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Indicators */}
          {relatedIndicators.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-500">
                Indikator Terkait
              </h4>
              <div className="space-y-2">
                {relatedIndicators.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/indikator/${rel.id}`}
                    className="p-2.5 rounded-xl bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-100 hover:border-emerald-200 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-gray-500 group-hover:text-emerald-700">
                        {rel.id}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-white text-gray-600 border border-gray-200">
                        {rel.agama}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 mt-1 line-clamp-1">
                      {rel.nama}
                    </p>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {rel.kategori}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
