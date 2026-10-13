'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Info, 
  TrendingUp, 
  Tag, 
  BarChart3, 
  FileText,
  Download,
  FileSpreadsheet,
  Edit3
} from 'lucide-react';
import { IndicatorItem } from '@/types/indicator';
import { getStoredIndicators, saveStoredIndicators } from '@/lib/storage-utils';
import { downloadIndicatorTemplate } from '@/lib/excel-template-utils';
import TrendChart from '@/components/TrendChart';
import UploadExcelModal from '@/components/UploadExcelModal';

interface IndicatorDetailViewProps {
  initialIndicator?: IndicatorItem;
  targetId?: string;
  allIndicators?: IndicatorItem[];
}

export default function IndicatorDetailView({
  initialIndicator,
  targetId,
  allIndicators = []
}: IndicatorDetailViewProps) {
  const [indicator, setIndicator] = useState<IndicatorItem | undefined>(initialIndicator);
  const [loading, setLoading] = useState(!initialIndicator);
  const [isCMSModalOpen, setIsCMSModalOpen] = useState(false);

  useEffect(() => {
    if (!indicator && targetId) {
      // Cari di custom indicators yang diunggah
      const customItems = getStoredIndicators();
      const found = customItems.find(item => item.id.toLowerCase() === targetId.toLowerCase());
      setIndicator(found);
      setLoading(false);
    }
  }, [indicator, targetId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        Memuat metadata indikator...
      </div>
    );
  }

  if (!indicator) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F4ECE7] text-[#744D3D] flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Indikator Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Indikator dengan kode <strong>{targetId}</strong> tidak ditemukan di katalog standar maupun berkas Excel yang diunggah.
        </p>
        <Link
          href="/eksplorasi"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#A47864] text-white text-xs font-bold hover:bg-[#8E614E] shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Eksplorasi</span>
        </Link>
      </div>
    );
  }

  // Related indicators
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
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Katolik':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Hindu':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Buddha':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Khonghucu':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-[#FAF7F5] text-[#474747] border-[#EBE5E0]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-xs text-[#8C8077] font-medium">
          <Link href="/" className="hover:text-[#A47864] flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#CFC5BD]" />
          <Link href="/eksplorasi" className="hover:text-[#A47864]">
            Eksplorasi Data
          </Link>
          <ChevronRight className="w-3 h-3 text-[#CFC5BD]" />
          <span className="text-[#2E231F] font-bold font-mono">{indicator.id}</span>
        </nav>

        <Link
          href="/eksplorasi"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#68605A] hover:text-[#A47864] transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Eksplorasi</span>
        </Link>
      </div>

      {/* Header Banner (data.gov.sg Dataset Detail Style) */}
      <div className="bg-white rounded-3xl border border-[#EBE5E0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-[#2E231F] text-white font-mono text-xs font-bold">
            {indicator.id}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getAgamaBadgeColor(indicator.agama)}`}>
            {indicator.agama}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F5] text-[#474747] border border-[#EBE5E0] text-xs font-medium">
            {indicator.bimas}
          </span>
          {indicator.terisi ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terisi / Terintegrasi</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Dalam Proses Integrasi</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2E231F] tracking-tight">
          {indicator.nama}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-[#68605A] max-w-3xl leading-relaxed font-medium">
          {indicator.deskripsi}
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#EBE5E0]">
          <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBE5E0]">
            <span className="text-[11px] text-[#8C8077] font-bold uppercase tracking-wider block">Rumpun Kategori</span>
            <strong className="text-xs sm:text-sm text-[#2E231F] mt-0.5 block truncate">
              {indicator.kategori}
            </strong>
          </div>
          <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBE5E0]">
            <span className="text-[11px] text-[#8C8077] font-bold uppercase tracking-wider block">Satuan Ukuran</span>
            <strong className="text-xs sm:text-sm text-[#2E231F] mt-0.5 block truncate">
              {indicator.satuan}
            </strong>
          </div>
          <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBE5E0]">
            <span className="text-[11px] text-[#8C8077] font-bold uppercase tracking-wider block">Nilai Terbaru (2024)</span>
            <strong className="text-xs sm:text-sm text-[#A47864] mt-0.5 block truncate">
              {formatNumber(lastVal)} {indicator.satuan}
            </strong>
          </div>
          <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBE5E0]">
            <span className="text-[11px] text-[#8C8077] font-bold uppercase tracking-wider block">Pertumbuhan 5 Thn</span>
            <strong className={`text-xs sm:text-sm mt-0.5 block truncate ${growthRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`}
            </strong>
          </div>
        </div>

        {/* Action Button: Download Template Khusus & CMS Update */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-[#EBE5E0]">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => downloadIndicatorTemplate(indicator)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] text-[#744D3D] border border-[#E5D5CD] text-xs font-bold hover:bg-[#F4ECE7] transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#A47864]" />
              <span>Download Template Excel Indikator Ini</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCMSModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#A47864] text-white text-xs font-bold hover:bg-[#8E614E] active:bg-[#744D3D] transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kelola & Update Data (CMS)</span>
            </button>
          </div>

          <span className="text-[11px] text-[#8C8077] font-medium">
            Terakhir dimutakhirkan: {indicator.terakhirDiperbarui}
          </span>
        </div>
      </div>

      {/* Main Grid: Visualisasi Chart & Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recharts Chart & Historical Table */}
        <div className="lg:col-span-2 space-y-8">
          <TrendChart 
            data={indicator.trenData} 
            satuan={indicator.satuan} 
            namaIndikator={indicator.nama} 
          />

          {/* Tabel Rincian Data Historis Runtun Waktu */}
          <div className="bg-white rounded-2xl border border-[#EBE5E0] p-5 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#2E231F] text-sm sm:text-base">
                  Rincian Data Runtun Waktu Per Tahun
                </h3>
                <p className="text-xs text-[#68605A] mt-0.5">
                  Rekapitulasi data resmi terintegrasi pada sistem Pusdatin
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] text-[#68605A] font-bold uppercase tracking-wider text-[11px] border-b border-[#EBE5E0]">
                  <tr>
                    <th className="px-4 py-3">Tahun</th>
                    <th className="px-4 py-3 text-right">Nilai Terukur</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3">Status Verifikasi</th>
                    <th className="px-4 py-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5E0] font-medium text-[#474747]">
                  {indicator.trenData.map((item) => (
                    <tr key={item.tahun} className="hover:bg-[#FAF7F5] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#2E231F]">{item.tahun}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#A47864]">
                        {formatNumber(item.nilai)}
                      </td>
                      <td className="px-4 py-3 text-[#68605A]">{item.satuan}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8C8077] text-[11px]">
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
          <div className="bg-white rounded-2xl border border-[#EBE5E0] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-[#2E231F] text-sm border-b border-[#EBE5E0] pb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#A47864]" />
              <span>Metadata & Tata Kelola Data</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">Produsen / Sistem Sumber</span>
                <span className="font-bold text-[#2E231F] mt-0.5 block">
                  {indicator.sumberData}
                </span>
              </div>

              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">Ditjen / Bimas Pengampu</span>
                <span className="font-semibold text-[#2E231F] mt-0.5 block">
                  {indicator.bimas}
                </span>
              </div>

              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">PIC Tim Pengelola Pusdatin</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#A47864]" />
                  <span className="font-bold text-[#2E231F]">{indicator.pic}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">Cakupan Wilayah Data</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-[#2E231F]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{indicator.cakupanWilayah}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">Frekuensi Pemutakhiran</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-[#2E231F]">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{indicator.frekuensiUpdate}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider">Terakhir Diperbarui</span>
                <span className="font-mono text-[#68605A] mt-0.5 block">
                  {indicator.terakhirDiperbarui}
                </span>
              </div>
            </div>

            {/* Tag List */}
            <div className="pt-4 border-t border-[#EBE5E0]">
              <span className="text-[#8C8077] block text-[11px] font-bold uppercase tracking-wider mb-2">Tag Klasifikasi</span>
              <div className="flex flex-wrap gap-1.5">
                {indicator.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#FAF7F5] text-[#474747] border border-[#EBE5E0] text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Indicators */}
          {relatedIndicators.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EBE5E0] p-5 sm:p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C8077]">
                Indikator Terkait
              </h4>
              <div className="space-y-2">
                {relatedIndicators.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/indikator/${rel.id}`}
                    className="p-3 rounded-xl bg-[#FAF7F5] hover:bg-white border border-[#EBE5E0] hover:border-[#BC9887] transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#8C8077] group-hover:text-[#A47864]">
                        {rel.id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#474747] border border-[#EBE5E0]">
                        {rel.agama}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#2E231F] group-hover:text-[#A47864] mt-1 line-clamp-1">
                      {rel.nama}
                    </p>
                    <span className="text-[11px] text-[#8C8077] block mt-0.5">
                      {rel.kategori}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal CMS Unggah & Kelola Data */}
      <UploadExcelModal
        isOpen={isCMSModalOpen}
        onClose={() => setIsCMSModalOpen(false)}
        onImportSuccess={(imported) => {
          saveStoredIndicators(imported, 'append', allIndicators);
          const updated = imported.find(item => item.id.toLowerCase() === indicator.id.toLowerCase());
          if (updated) {
            setIndicator(updated);
          }
        }}
        existingIndicators={allIndicators.length > 0 ? allIndicators : [indicator]}
        initialIndicatorId={indicator.id}
      />
    </div>
  );
}
