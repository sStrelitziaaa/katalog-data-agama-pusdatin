'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  RotateCcw, 
  Database, 
  SlidersHorizontal,
  ChevronRight,
  Home,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { getAllIndicators, getAllAgama } from '@/lib/data-loader';
import { mergeWithStoredIndicators, saveStoredIndicators, resetStoredIndicators } from '@/lib/storage-utils';
import { useAdminAuth } from '@/lib/admin-auth';
import FilterSidebar from '@/components/FilterSidebar';
import DataTable from '@/components/DataTable';
import UploadExcelModal from '@/components/UploadExcelModal';
import { IndicatorItem } from '@/types/indicator';

function EksplorasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAdmin } = useAdminAuth();

  const baseData = useMemo(() => getAllIndicators(), []);
  const [allData, setAllData] = useState<IndicatorItem[]>(baseData);
  const [customCount, setCustomCount] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync dengan data database & yang diunggah di browser
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

  const categories = useMemo(() => Array.from(new Set(allData.map(item => item.kategori))).sort(), [allData]);
  const agamaList = useMemo(() => getAllAgama(), []);
  const picList = useMemo(() => Array.from(new Set(allData.map(item => item.pic))).sort(), [allData]);

  // Initial states from URL query
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    agama: searchParams.get('agama') || searchParams.get('bimas')?.replace('Ditjen Bimas ', '') || '',
    kategori: searchParams.get('kategori') || '',
    status: searchParams.get('status') || 'all',
    cakupanWilayah: searchParams.get('wilayah') || '',
    tahun: searchParams.get('tahun') || '',
    pic: searchParams.get('pic') || '',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL params if user arrived with specific query
  useEffect(() => {
    const qParam = searchParams.get('q');
    const bimasParam = searchParams.get('bimas');
    const kategoriParam = searchParams.get('kategori');
    const agamaParam = searchParams.get('agama');

    setFilters(prev => ({
      ...prev,
      search: qParam ?? prev.search,
      agama: agamaParam ?? (bimasParam ? bimasParam.replace('Ditjen Bimas ', '').trim() : prev.agama),
      kategori: kategoriParam ?? prev.kategori,
    }));
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      agama: '',
      kategori: '',
      status: 'all',
      cakupanWilayah: '',
      tahun: '',
      pic: '',
    });
    router.push('/eksplorasi');
  };

  const handleImportSuccess = (imported: IndicatorItem[], mode: 'append' | 'replace') => {
    saveStoredIndicators(imported, mode, baseData);
    const { merged, customCount: count } = mergeWithStoredIndicators(baseData);
    setAllData(merged);
    setCustomCount(count);
    setNotification(`Berhasil mengimpor ${imported.length} indikator data ke katalog!`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleResetCustomData = () => {
    if (typeof window !== 'undefined' && window.confirm('Kembalikan data katalog ke 82 indikator acuan standar?')) {
      resetStoredIndicators();
      setAllData(baseData);
      setCustomCount(0);
      setNotification('Data katalog telah dikembalikan ke 82 indikator acuan standar.');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Filter Data Logic
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      // 1. Search Query
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchName = item.nama.toLowerCase().includes(query);
        const matchKategori = item.kategori.toLowerCase().includes(query);
        const matchSumber = item.sumberData.toLowerCase().includes(query);
        const matchPic = item.pic.toLowerCase().includes(query);
        const matchId = item.id.toLowerCase().includes(query);
        const matchBimas = item.bimas.toLowerCase().includes(query);
        if (!matchName && !matchKategori && !matchSumber && !matchPic && !matchId && !matchBimas) {
          return false;
        }
      }

      // 2. Agama / Bimas / Produsen Data
      if (filters.agama) {
        const agQuery = filters.agama.toLowerCase().trim();
        const itemAgama = item.agama.toLowerCase();
        const itemBimas = item.bimas.toLowerCase();

        if (agQuery.includes('islam')) {
          if (!itemAgama.includes('islam') && !itemBimas.includes('islam')) return false;
        } else if (agQuery.includes('kristen')) {
          if (!itemAgama.includes('kristen') && !itemBimas.includes('kristen')) return false;
        } else if (agQuery.includes('katolik')) {
          if (!itemAgama.includes('katolik') && !itemBimas.includes('katolik')) return false;
        } else if (agQuery.includes('hindu')) {
          if (!itemAgama.includes('hindu') && !itemBimas.includes('hindu')) return false;
        } else if (agQuery.includes('buddha')) {
          if (!itemAgama.includes('buddha') && !itemBimas.includes('buddha')) return false;
        } else if (agQuery.includes('khonghucu')) {
          if (!itemAgama.includes('khonghucu') && !itemBimas.includes('khonghucu')) return false;
        } else if (agQuery.includes('bmbpsdm') || agQuery.includes('balitbang') || agQuery.includes('diklat') || agQuery.includes('setjen')) {
          if (!itemBimas.includes('setjen') && itemAgama !== 'umum' && !item.kategori.toLowerCase().includes('sdm') && !item.kategori.toLowerCase().includes('keuangan') && !item.kategori.toLowerCase().includes('bmn')) {
            return false;
          }
        } else if (agQuery.includes('kerukunan') || agQuery.includes('pkub')) {
          if (!itemBimas.includes('kerukunan') && !itemBimas.includes('pkub') && itemAgama !== 'semua agama') {
            return false;
          }
        } else {
          if (itemAgama !== agQuery && !itemBimas.includes(agQuery)) {
            return false;
          }
        }
      }

      // 3. Kategori
      if (filters.kategori && item.kategori !== filters.kategori) {
        return false;
      }

      // 4. Status Keterisian
      if (filters.status === 'terisi' && !item.terisi) return false;
      if (filters.status === 'pending' && item.terisi) return false;

      // 5. Cakupan Wilayah
      if (filters.cakupanWilayah && item.cakupanWilayah !== filters.cakupanWilayah) {
        return false;
      }

      // 6. PIC
      if (filters.pic && item.pic !== filters.pic) {
        return false;
      }

      // 7. Tahun (check if that year has data)
      if (filters.tahun) {
        const point = item.trenData?.find(p => String(p.tahun) === filters.tahun);
        if (!point || point.nilai === 0) return false;
      }

      return true;
    });
  }, [allData, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#6A7B8C] font-medium">
        <Link href="/" className="hover:text-[#286084] flex items-center space-x-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Katalog</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A0B8C8]" />
        <span className="text-[#132E40] font-bold">Eksplorasi Dataset</span>
      </nav>

      {/* Administrator Status Bar (Hanya tampil jika admin login) */}
      {isAdmin && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#E7F1F8] border border-[#D3E4F1] text-xs font-semibold text-[#132E40] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#286084] shrink-0" />
            <span>Mode Administrator Aktif (Pusdatin) — Anda memiliki akses CMS untuk mengunggah dan memutakhirkan dataset Excel.</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-[#286084] text-white text-xs font-bold hover:bg-[#1D4661] transition-colors"
            >
              Dashboard Admin
            </Link>
          </div>
        </div>
      )}

      {/* Header & Search Bar (Clean Singapore Portal Style) */}
      <div className="bg-white rounded-3xl border border-[#D3E4F1] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F6EBC8] border border-[#EAD598] text-[#4D410E] text-xs font-bold mb-2">
              <Database className="w-3.5 h-3.5 text-[#7A610A]" />
              <span>Pusat Data dan Teknologi Informasi (Pusdatin) • Data Agama dan Keagamaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#132E40] tracking-tight">
              Eksplorasi & Repositori Dataset Agama
            </h1>
            <p className="text-xs sm:text-sm text-[#55697A] mt-1 font-medium">
              Telusuri dataset berdasarkan kata kunci, rumpun kategori, produsen data (Ditjen Bimas/Pusbimdik/BMBPSDM/PKUB), cakupan wilayah, dan unduh data ke Excel atau CSV.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#286084] hover:bg-[#1f4e6d] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Buka Filter Sidebar</span>
            </button>
          </div>
        </div>

        {/* Global Keyword Search Input */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={e => handleFilterChange({ search: e.target.value })}
              placeholder='Cari kata kunci (contoh: "Masjid", "Nikah", "Penyuluh", "Gereja", "Madrasah")...'
              className="w-full text-xs sm:text-sm pl-11 pr-10 py-3.5 rounded-2xl border border-[#D3E4F1] bg-[#F0EEE9]/40 focus:bg-white text-[#132E40] focus:outline-hidden focus:ring-3 focus:ring-[#286084]/20 focus:border-[#5F9ECB] transition-all font-medium"
            />
            <Search className="w-5 h-5 text-[#7E8B99] absolute left-3.5 top-3.5 pointer-events-none" />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="absolute right-3.5 top-3.5 text-xs text-[#7E8B99] hover:text-[#132E40] font-semibold"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast / Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-[#E7F1F8] border border-[#D3E4F1] text-xs font-semibold text-[#132E40] flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
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

      {/* Main Grid: Sidebar + Table */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          categories={categories}
          agamaList={agamaList}
          picList={picList}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Table Container */}
        <div className="flex-1 w-full overflow-hidden">
          <DataTable 
            data={filteredData} 
            totalRaw={allData.length} 
            onOpenUploadModal={isAdmin ? () => setIsUploadModalOpen(true) : undefined}
            customCount={customCount}
            onResetCustomData={handleResetCustomData}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* Modal Upload Excel (Hanya aktif untuk Administrator) */}
      {isAdmin && (
        <UploadExcelModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onImportSuccess={handleImportSuccess}
          existingIndicators={allData}
        />
      )}
    </div>
  );
}

export default function EksplorasiPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Memuat data eksplorasi...</div>}>
      <EksplorasiContent />
    </Suspense>
  );
}
