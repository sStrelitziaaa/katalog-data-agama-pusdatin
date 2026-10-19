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
import { exportSingleIndicatorToExcel } from '@/lib/export-utils';
import { useAdminAuth } from '@/lib/admin-auth';
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
  const { isAdmin } = useAdminAuth();
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
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E7F1F8] text-[#286084] flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#132E40]">Indikator Tidak Ditemukan</h2>
        <p className="text-xs text-[#55697A] max-w-md mx-auto">
          Indikator dengan kode <strong>{targetId}</strong> tidak ditemukan di katalog standar maupun berkas Excel yang diunggah.
        </p>
        <Link
          href="/eksplorasi"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#286084] text-white text-xs font-bold hover:bg-[#1f4e6d] shadow-sm transition-colors"
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
  const hasTren = Array.isArray(indicator.trenData) && indicator.trenData.length > 0;
  const firstVal = hasTren ? indicator.trenData[0]?.nilai : undefined;
  const lastVal = hasTren ? indicator.trenData[indicator.trenData.length - 1]?.nilai : undefined;
  const growthRate =
    firstVal !== undefined && lastVal !== undefined && firstVal > 0
      ? Math.round(((lastVal - firstVal) / firstVal) * 100)
      : null;

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
        <nav className="flex items-center space-x-2 text-xs text-[#7E8B99] font-medium">
          <Link href="/" className="hover:text-[#286084] flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#B5D3E8]" />
          <Link href="/eksplorasi" className="hover:text-[#286084]">
            Eksplorasi Data
          </Link>
          <ChevronRight className="w-3 h-3 text-[#B5D3E8]" />
          <span className="text-[#181E24] font-bold font-mono">{indicator.id}</span>
        </nav>

        <Link
          href="/eksplorasi"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#55606D] hover:text-[#286084] transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Eksplorasi</span>
        </Link>
      </div>

      {/* Header Banner (data.gov.sg Dataset Detail Style) */}
      <div className="bg-white rounded-3xl border border-[#D3E4F1] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-[#181E24] text-white font-mono text-xs font-bold">
            {indicator.id}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getAgamaBadgeColor(indicator.agama)}`}>
            {indicator.agama}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#F5F9FD] text-[#55606D] border border-[#D3E4F1] text-xs font-medium">
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

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#181E24] tracking-tight">
          {indicator.nama}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-[#55606D] max-w-3xl leading-relaxed font-medium">
          {indicator.deskripsi}
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#D3E4F1]">
          <div className="p-3 bg-[#F5F9FD] rounded-xl border border-[#D3E4F1]">
            <span className="text-[11px] text-[#7E8B99] font-bold uppercase tracking-wider block">Rumpun Kategori</span>
            <strong className="text-xs sm:text-sm text-[#181E24] mt-0.5 block truncate">
              {indicator.kategori}
            </strong>
          </div>
          <div className="p-3 bg-[#F5F9FD] rounded-xl border border-[#D3E4F1]">
            <span className="text-[11px] text-[#7E8B99] font-bold uppercase tracking-wider block">Satuan Ukuran</span>
            <strong className="text-xs sm:text-sm text-[#181E24] mt-0.5 block truncate">
              {indicator.satuan}
            </strong>
          </div>
          <div className="p-3 bg-[#F5F9FD] rounded-xl border border-[#D3E4F1]">
            <span className="text-[11px] text-[#7E8B99] font-bold uppercase tracking-wider block">Nilai Terbaru (2024)</span>
            <strong className="text-xs sm:text-sm text-[#286084] mt-0.5 block truncate">
              {lastVal !== undefined && lastVal > 0 ? `${formatNumber(lastVal)} ${indicator.satuan}` : '-'}
            </strong>
          </div>
          <div className="p-3 bg-[#F5F9FD] rounded-xl border border-[#D3E4F1]">
            <span className="text-[11px] text-[#7E8B99] font-bold uppercase tracking-wider block">Pertumbuhan 5 Thn</span>
            <strong className={`text-xs sm:text-sm mt-0.5 block truncate ${growthRate !== null && growthRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {growthRate !== null ? (growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`) : '-'}
            </strong>
          </div>
        </div>

        {/* Action Button: Unduh Data (.xlsx) untuk Publik & CMS Khusus Admin */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-[#D3E4F1]">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tombol Unduh Data Indikator ke Excel (TERSEDIA UNTUK PUBLIK & ADMIN) */}
            <button
              type="button"
              onClick={() => exportSingleIndicatorToExcel(indicator)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#F6EBC8] text-[#4D410E] border border-[#E3CF7E] text-xs font-bold hover:bg-[#EEDFA7] active:bg-[#E3CF7E] transition-all shadow-2xs"
              title="Download ringkasan dan data deret waktu indikator ini ke format Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#4D410E]" />
              <span>Unduh Data Indikator (.xlsx)</span>
            </button>

            {/* OPSI KHUSUS ADMINISTRATOR PUSDATIN */}
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => downloadIndicatorTemplate(indicator)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white text-[#181E24] border border-[#D3E4F1] text-xs font-bold hover:bg-[#F5F9FD] active:bg-[#D3E4F1] transition-all shadow-2xs"
                  title="Unduh template Excel resmi untuk pengisian nilai indikator ini"
                >
                  <Download className="w-3.5 h-3.5 text-[#286084]" />
                  <span>Template Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCMSModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#286084] text-white text-xs font-bold hover:bg-[#1D4661] active:bg-[#132E40] transition-all shadow-xs"
                  title="Masuk CMS untuk memperbarui nilai indikator ini"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Kelola & Update Data (CMS)</span>
                </button>
              </>
            )}
          </div>

          <span className="text-[11px] text-[#7E8B99] font-medium">
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
          <div className="bg-white rounded-2xl border border-[#D3E4F1] p-5 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#181E24] text-sm sm:text-base">
                  Rincian Data Runtun Waktu Per Tahun
                </h3>
                <p className="text-xs text-[#55606D] mt-0.5">
                  Rekapitulasi data resmi terintegrasi pada sistem Pusdatin
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E7F1F8] text-[#1D4661] font-bold uppercase tracking-wider text-[11px] border-b border-[#D3E4F1]">
                  <tr>
                    <th className="px-4 py-3">Tahun</th>
                    <th className="px-4 py-3 text-right">Nilai Terukur</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3">Status Verifikasi</th>
                    <th className="px-4 py-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3E4F1] font-medium text-[#55606D]">
                  {indicator.trenData.map((item) => (
                    <tr key={item.tahun} className="hover:bg-[#F5F9FD] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#181E24]">{item.tahun}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#286084]">
                        {formatNumber(item.nilai)}
                      </td>
                      <td className="px-4 py-3 text-[#55606D]">{item.satuan}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#7E8B99] text-[11px]">
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
          <div className="bg-white rounded-2xl border border-[#D3E4F1] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-[#181E24] text-sm border-b border-[#D3E4F1] pb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#286084]" />
              <span>Metadata & Tata Kelola Data</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">Produsen / Sistem Sumber</span>
                <span className="font-bold text-[#181E24] mt-0.5 block">
                  {indicator.sumberData}
                </span>
              </div>

              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">Ditjen / Bimas Pengampu</span>
                <span className="font-semibold text-[#181E24] mt-0.5 block">
                  {indicator.bimas}
                </span>
              </div>

              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">PIC Tim Pengelola Pusdatin</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#286084]" />
                  <span className="font-bold text-[#181E24]">{indicator.pic}</span>
                </div>
              </div>

              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">Cakupan Wilayah Data</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-[#181E24]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{indicator.cakupanWilayah}</span>
                </div>
              </div>

              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">Frekuensi Pemutakhiran</span>
                <div className="flex items-center space-x-1.5 mt-0.5 text-[#181E24]">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{indicator.frekuensiUpdate}</span>
                </div>
              </div>

              <div>
                <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider">Terakhir Diperbarui</span>
                <span className="font-mono text-[#55606D] mt-0.5 block">
                  {indicator.terakhirDiperbarui}
                </span>
              </div>
            </div>

            {/* Tag List */}
            <div className="pt-4 border-t border-[#D3E4F1]">
              <span className="text-[#7E8B99] block text-[11px] font-bold uppercase tracking-wider mb-2">Tag Klasifikasi</span>
              <div className="flex flex-wrap gap-1.5">
                {indicator.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#F5F9FD] text-[#181E24] border border-[#D3E4F1] text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Indicators */}
          {relatedIndicators.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#D3E4F1] p-5 sm:p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#7E8B99]">
                Indikator Terkait
              </h4>
              <div className="space-y-2">
                {relatedIndicators.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/indikator/${rel.id}`}
                    className="p-3 rounded-xl bg-[#F5F9FD] hover:bg-white border border-[#D3E4F1] hover:border-[#8EBEDE] transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#7E8B99] group-hover:text-[#286084]">
                        {rel.id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#55606D] border border-[#D3E4F1]">
                        {rel.agama}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#181E24] group-hover:text-[#286084] mt-1 line-clamp-1">
                      {rel.nama}
                    </p>
                    <span className="text-[11px] text-[#7E8B99] block mt-0.5">
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
