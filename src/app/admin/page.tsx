'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  LogOut, 
  UploadCloud, 
  Download, 
  FileSpreadsheet, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileDown, 
  Search, 
  Eye, 
  SlidersHorizontal,
  Home,
  Database,
  Clock,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { getAllIndicators } from '@/lib/data-loader';
import { mergeWithStoredIndicators, saveStoredIndicators, resetStoredIndicators } from '@/lib/storage-utils';
import { downloadExcelTemplate, downloadIndicatorTemplate } from '@/lib/excel-template-utils';
import { exportToExcel } from '@/lib/export-utils';
import { useAdminAuth, DEFAULT_ADMIN_PASSCODE } from '@/lib/admin-auth';
import UploadExcelModal from '@/components/UploadExcelModal';
import AddIndicatorModal from '@/components/AddIndicatorModal';
import { IndicatorItem } from '@/types/indicator';

export default function AdminPage() {
  const { isAdmin, isLoaded, login, logout } = useAdminAuth();

  // State Login Form
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // State Data Management
  const baseData = useMemo(() => getAllIndicators(), []);
  const [allData, setAllData] = useState<IndicatorItem[]>(baseData);
  const [customCount, setCustomCount] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIndicatorForUpload, setSelectedIndicatorForUpload] = useState<IndicatorItem | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBimas, setFilterBimas] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Sync data dari database & storage browser
  useEffect(() => {
    let isMounted = true;
    fetch('/api/indicators')
      .then(res => res.json())
      .then(json => {
        if (!isMounted) return;
        if (json?.data && Array.isArray(json.data)) {
          const { merged, customCount: count } = mergeWithStoredIndicators(json.data);
          setAllData(merged);
          setCustomCount(count);
        }
      })
      .catch(() => {
        const { merged, customCount: count } = mergeWithStoredIndicators(baseData);
        setAllData(merged);
        setCustomCount(count);
      });
    return () => {
      isMounted = false;
    };
  }, [baseData]);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = login(passcode);
    if (!success) {
      setLoginError('Kata sandi administrator salah. Silakan coba lagi.');
    } else {
      setPasscode('');
    }
  };

  // Handle Upload Success
  const handleImportSuccess = (imported: IndicatorItem[], mode: 'append' | 'replace') => {
    saveStoredIndicators(imported, mode, baseData);
    const { merged, customCount: count } = mergeWithStoredIndicators(baseData);
    setAllData(merged);
    setCustomCount(count);
    setNotification(`Berhasil memperbarui ${imported.length} indikator via CMS Excel!`);
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle Add Indicator Success
  const handleAddSuccess = (newIndicator: IndicatorItem) => {
    setAllData(prev => [newIndicator, ...prev]);
    setNotification(`Berhasil menambahkan indikator [${newIndicator.id}] ${newIndicator.nama}!`);
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle Delete Indicator
  const handleDeleteIndicator = async (item: IndicatorItem) => {
    if (typeof window !== 'undefined' && window.confirm(`Apakah Anda yakin ingin menghapus indikator [${item.id}] ${item.nama}? Tindakan ini permanen.`)) {
      try {
        const res = await fetch(`/api/admin/indicators?id=${encodeURIComponent(item.id)}`, {
          method: 'DELETE',
          headers: { 'x-admin-auth': 'true' },
        });
        const json = await res.json();
        if (json.success) {
          setAllData(prev => prev.filter(i => i.id !== item.id));
          setNotification(`Indikator [${item.id}] berhasil dihapus.`);
          setTimeout(() => setNotification(null), 5000);
        } else {
          alert(json.message || 'Gagal menghapus indikator.');
        }
      } catch (err: any) {
        alert('Gagal menghubungi server: ' + err.message);
      }
    }
  };

  // Handle Reset to Default
  const handleResetData = () => {
    if (typeof window !== 'undefined' && window.confirm('Kembalikan seluruh data ke acuan standar bawaan?')) {
      resetStoredIndicators();
      setAllData(baseData);
      setCustomCount(0);
      setNotification('Data telah berhasil direset.');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Filtered dataset for admin table
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = item.nama.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchKategori = item.kategori.toLowerCase().includes(q);
        const matchBimas = item.bimas.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchKategori && !matchBimas) return false;
      }
      if (filterBimas && item.bimas !== filterBimas) {
        return false;
      }
      return true;
    });
  }, [allData, searchQuery, filterBimas]);

  const uniqueBimas = useMemo(() => Array.from(new Set(allData.map(i => i.bimas))), [allData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F0EEE9] flex items-center justify-center p-4 text-xs text-[#55606D]">
        Memuat status keamanan administrator...
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: LOGIN FORM (JIKA BELUM MASUK SEBAGAI ADMIN)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-[#F0EEE9] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#D3E4F1] shadow-xl p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle ice melt glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#D3E4F1]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#F6EBC8]/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Header Login */}
            <div className="text-center space-y-3">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-[#F0EEE9] rounded-2xl border border-[#D3E4F1] shadow-2xs">
                <Image
                  src="/logo-kemenag.png"
                  alt="Logo Kementerian Agama RI"
                  width={46}
                  height={46}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E7F1F8] border border-[#D3E4F1] text-[11px] font-bold text-[#1D4661] mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#286084]" />
                  <span>Area Terbatas • Pusdatin Kemenag RI</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#181E24] tracking-tight">
                  Portal Administrator CMS
                </h1>
                <p className="text-xs text-[#55606D] mt-1 leading-relaxed">
                  Masuk untuk mengelola dataset, menambah indikator baru, dan mengunggah berkas Excel resmi.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1.5">
                  Kata Sandi / Passcode Administrator:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="Masukkan sandi (contoh: adminpusdatin)..."
                    autoFocus
                    required
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-3 focus:ring-[#286084]/20 focus:border-[#5F9ECB] transition-all font-medium"
                  />
                  <KeyRound className="w-4 h-4 text-[#7E8B99] absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-[#7E8B99] mt-1.5">
                  Petunjuk sandi default pengelola: <code className="bg-[#E7F1F8] px-1.5 py-0.5 rounded text-[#286084] font-bold">adminpusdatin</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#286084] hover:bg-[#1D4661] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard Administrator</span>
              </button>
            </form>

            <div className="pt-4 border-t border-[#D3E4F1] text-center">
              <Link
                href="/eksplorasi"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#55606D] hover:text-[#286084] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Publik (Eksplorasi)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DASHBOARD ADMINISTRATOR (JIKA SUDAH LOGIN SEBAGAI ADMIN)
  // =========================================================================
  const totalCount = allData.length;
  const filledCount = allData.filter(i => i.terisi).length;
  const pendingCount = totalCount - filledCount;
  const filledPercent = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center space-x-2 text-xs text-[#6A7B8C] font-medium">
          <Link href="/" className="hover:text-[#286084] flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </Link>
          <span>/</span>
          <span className="text-[#132E40] font-bold">Dashboard Administrator CMS</span>
        </nav>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/eksplorasi"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D3E4F1] text-xs font-bold text-[#181E24] hover:bg-[#F5F9FD] transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#286084]" />
            <span>Lihat Tampilan Publik</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Keluar Sesi Admin</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Administrator */}
      <div className="bg-white rounded-3xl border border-[#D3E4F1] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F6EBC8] border border-[#EAD598] text-[#4D410E] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7A610A]" />
              <span>Pusat Data dan Teknologi Informasi (Pusdatin) • CMS Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#132E40] tracking-tight">
              Manajemen Dataset & Indikator Agama
            </h1>
            <p className="text-xs sm:text-sm text-[#55697A] font-medium leading-relaxed">
              Sebagai Administrator Pusdatin, Anda dapat menambahkan indikator baru secara bertahap, memperbarui angka nilai tahunan (2020–2024), dan mengimpor file Excel resmi.
            </p>
          </div>

          {/* Quick Actions: Tambah Indikator, Unggah Excel, Download Template */}
          <div className="shrink-0 flex flex-wrap sm:flex-nowrap gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#286084] hover:bg-[#1D4661] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Indikator</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedIndicatorForUpload(undefined);
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-[#E7F1F8] hover:bg-[#D3E4F1] border border-[#D3E4F1] text-[#1D4661] text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4 text-[#286084]" />
              <span>Unggah Excel</span>
            </button>

            <button
              type="button"
              onClick={() => downloadExcelTemplate()}
              className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-[#F6EBC8] hover:bg-[#EEDFA7] border border-[#E3CF7E] text-[#4D410E] text-xs sm:text-sm font-bold shadow-2xs transition-all"
            >
              <FileDown className="w-4 h-4 text-[#4D410E]" />
              <span>Master Template</span>
            </button>
          </div>
        </div>

        {/* Admin Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#D3E4F1]">
          <div className="p-3.5 bg-[#F5F9FD] rounded-2xl border border-[#D3E4F1]">
            <span className="text-[11px] font-bold text-[#7E8B99] uppercase tracking-wider block">Total Indikator</span>
            <strong className="text-lg sm:text-2xl font-black text-[#181E24] mt-0.5 block">
              {totalCount}
            </strong>
          </div>
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Data Terisi</span>
            <strong className="text-lg sm:text-2xl font-black text-emerald-900 mt-0.5 block">
              {filledCount} <span className="text-xs font-semibold text-emerald-700">({filledPercent}%)</span>
            </strong>
          </div>
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Belum Terisi</span>
            <strong className="text-lg sm:text-2xl font-black text-amber-900 mt-0.5 block">
              {pendingCount}
            </strong>
          </div>
          <div className="p-3.5 bg-[#E7F1F8] rounded-2xl border border-[#D3E4F1]">
            <span className="text-[11px] font-bold text-[#1D4661] uppercase tracking-wider block">Data Hasil Upload</span>
            <strong className="text-lg sm:text-2xl font-black text-[#286084] mt-0.5 block">
              {customCount} <span className="text-xs font-semibold text-[#55606D]">Kustom</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-[#E7F1F8] border border-[#D3E4F1] text-xs font-semibold text-[#132E40] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#286084]" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#286084] hover:text-[#132E40] font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dataset Management Table Section */}
      <div className="bg-white rounded-3xl border border-[#D3E4F1] overflow-hidden shadow-xs">
        {/* Table Header Filter Toolbar */}
        <div className="p-5 sm:p-6 border-b border-[#D3E4F1] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#181E24]">
              Katalog Master Dataset Agama
            </h2>
            <p className="text-xs text-[#55606D] mt-0.5">
              Menampilkan {filteredData.length} dari total {allData.length} indikator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kode atau nama indikator..."
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/40 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]"
              />
              <Search className="w-3.5 h-3.5 text-[#7E8B99] absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Bimas Filter */}
            {uniqueBimas.length > 0 && (
              <select
                value={filterBimas}
                onChange={e => setFilterBimas(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden"
              >
                <option value="">Semua Produsen Data</option>
                {uniqueBimas.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Export All Excel Button */}
            {filteredData.length > 0 && (
              <button
                type="button"
                onClick={() => exportToExcel(filteredData, 'master-data-agama-pusdatin.xlsx')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-[#D3E4F1] text-xs font-semibold text-[#181E24] hover:bg-[#F5F9FD]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#286084]" />
                <span>Export Excel</span>
              </button>
            )}

            {/* Reset Button */}
            {customCount > 0 && (
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100"
                title="Hapus data kustom yang diunggah"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Kustom</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#55606D] table-auto">
            <thead className="bg-[#E7F1F8] text-[#1D4661] font-bold uppercase tracking-wider text-[11px] border-b border-[#D3E4F1]">
              <tr>
                <th scope="col" className="px-3 py-2.5 min-w-[260px]">Indikator & Metadata</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap">Produsen / Bimas</th>
                <th scope="col" className="px-3 py-2.5 whitespace-nowrap">Kategori</th>
                <th scope="col" className="px-3 py-2.5 text-center whitespace-nowrap">Status</th>
                <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap">Nilai Terakhir</th>
                <th scope="col" className="px-3 py-2.5 text-center w-44 whitespace-nowrap">Aksi Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3E4F1]/60">
              {filteredData.length > 0 ? (
                filteredData.map(item => {
                  const latestPoint = item.trenData?.[item.trenData.length - 1];
                  return (
                    <tr key={item.id} className="hover:bg-[#F5F9FD]/60 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-baseline space-x-2">
                          <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#E7F1F8] text-[#1D4661] border border-[#D3E4F1] shrink-0">
                            {item.id}
                          </span>
                          <Link
                            href={`/indikator/${item.id}`}
                            className="font-bold text-[#181E24] hover:text-[#286084] transition-colors text-xs sm:text-[13px] leading-snug"
                          >
                            {item.nama}
                          </Link>
                        </div>
                        <span className="text-[11px] text-[#7E8B99] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 font-normal leading-tight">
                          <span>PIC: <strong className="text-[#55606D] font-medium">{item.pic}</strong></span>
                          <span>•</span>
                          <span>Satuan: {item.satuan}</span>
                          <span>•</span>
                          <span>{item.cakupanWilayah}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#F0EEE9] border border-[#D3E4F1] text-[11px] font-medium text-[#181E24]">
                          {item.bimas}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-[#55606D]">
                        {item.kategori}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        {item.terisi ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Terisi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-[#286084] whitespace-nowrap">
                        {latestPoint && latestPoint.nilai > 0 ? `${latestPoint.nilai.toLocaleString('id-ID')} (${latestPoint.tahun})` : '-'}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Tombol Perbarui / Upload Khusus Indikator Ini */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIndicatorForUpload(item);
                              setIsUploadModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#286084] text-white text-[11px] font-bold hover:bg-[#1D4661] transition-colors shadow-2xs"
                            title="Unggah Excel nilai indikator ini"
                          >
                            Update
                          </button>

                          {/* Unduh Template Khusus */}
                          <button
                            type="button"
                            onClick={() => downloadIndicatorTemplate(item)}
                            className="px-2 py-1 rounded-lg bg-[#F6EBC8] text-[#4D410E] border border-[#E3CF7E] text-[11px] font-bold hover:bg-[#EEDFA7] transition-colors"
                            title="Download template Excel khusus indikator ini"
                          >
                            Template
                          </button>

                          {/* Lihat Detail Publik */}
                          <Link
                            href={`/indikator/${item.id}`}
                            className="p-1 rounded-lg border border-[#D3E4F1] text-[#7E8B99] hover:text-[#286084] hover:bg-[#F5F9FD] transition-colors"
                            title="Lihat halaman indikator publik"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Hapus Indikator */}
                          <button
                            type="button"
                            onClick={() => handleDeleteIndicator(item)}
                            className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus indikator ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#7E8B99]">
                    <Database className="w-10 h-10 mx-auto text-[#8EBEDE] mb-3" />
                    <p className="text-sm font-bold text-[#181E24]">Belum Ada Indikator di Katalog</p>
                    <p className="text-xs text-[#55606D] mt-1 max-w-md mx-auto">
                      Katalog saat ini masih kosong (0 indikator). Klik tombol di bawah untuk menambahkan indikator data pertama.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#286084] hover:bg-[#1D4661] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Tambah Indikator Baru</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Upload Excel */}
      <UploadExcelModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedIndicatorForUpload(undefined);
        }}
        onImportSuccess={handleImportSuccess}
        existingIndicators={allData}
        initialIndicatorId={selectedIndicatorForUpload?.id}
      />

      {/* Modal Tambah Indikator Baru */}
      <AddIndicatorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleAddSuccess}
      />
    </div>
  );
}
