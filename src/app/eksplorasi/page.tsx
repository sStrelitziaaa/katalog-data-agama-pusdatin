'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Database, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { getAllIndicators, getAllCategories, getAllAgama, getAllPIC } from '@/lib/data-loader';
import FilterSidebar from '@/components/FilterSidebar';
import DataTable from '@/components/DataTable';
import { IndicatorItem } from '@/types/indicator';

function EksplorasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allData = useMemo(() => getAllIndicators(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const agamaList = useMemo(() => getAllAgama(), []);
  const picList = useMemo(() => getAllPIC(), []);

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

      // 2. Agama / Bimas Filter
      if (filters.agama) {
        const itemAgama = item.agama.toLowerCase();
        const itemBimas = item.bimas.toLowerCase();
        const filterAgama = filters.agama.toLowerCase();
        const matchAgama = itemAgama.includes(filterAgama);
        const matchBimas = itemBimas.includes(filterAgama) ||
          (filterAgama === 'setjen' && (itemBimas.includes('sekretariat') || itemBimas.includes('pusdatin'))) ||
          ((filterAgama.includes('khonghucu') || filterAgama.includes('konghucu')) && (itemAgama.includes('khonghucu') || itemAgama.includes('konghucu') || itemBimas.includes('khonghucu') || itemBimas.includes('pusbimdik')));
        if (!matchAgama && !matchBimas) {
          return false;
        }
      }

      // 3. Kategori Filter
      if (filters.kategori && item.kategori !== filters.kategori) {
        return false;
      }

      // 4. Status Filter
      if (filters.status === 'terisi' && !item.terisi) return false;
      if (filters.status === 'pending' && item.terisi) return false;

      // 5. Cakupan Wilayah Filter
      if (filters.cakupanWilayah && !item.cakupanWilayah.toLowerCase().includes(filters.cakupanWilayah.toLowerCase())) {
        return false;
      }

      // 6. Tahun Filter (cek apakah indikator memiliki data di tahun tersebut)
      if (filters.tahun) {
        const hasYear = item.trenData.some(t => t.tahun === filters.tahun);
        if (!hasYear) return false;
      }

      // 7. PIC Filter
      if (filters.pic && item.pic !== filters.pic) {
        return false;
      }

      return true;
    });
  }, [allData, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-emerald-700 flex items-center space-x-1">
          <Home className="w-3.5 h-3.5" />
          <span>Katalog</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-bold">Eksplorasi Data Agama</span>
      </nav>

      {/* Header & Search Bar */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Pusdatin Kemenag RI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Eksplorasi & Repositori Data Agama
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Telusuri data berdasarkan kata kunci, rumpun kategori, direktorat bimas, cakupan wilayah, dan unduh data ke Excel atau CSV.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
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
              placeholder="Ketik kata kunci pencarian (nama data, kategori, PIC, atau sumber data seperti SIMAS, SIMKAH, BPS)..."
              className="w-full text-xs sm:text-sm pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-hidden focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="absolute right-3.5 top-3.5 text-xs text-gray-400 hover:text-gray-700 font-semibold"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

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
          <DataTable data={filteredData} totalRaw={allData.length} />
        </div>
      </div>
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
