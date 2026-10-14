'use client';

import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { AgamaType } from '@/types/indicator';

interface FilterState {
  search: string;
  agama: string;
  kategori: string;
  status: string; // 'all' | 'terisi' | 'pending'
  cakupanWilayah: string;
  tahun: string;
  pic: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  categories: string[];
  agamaList: AgamaType[];
  picList: string[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  agamaList,
  picList,
  isOpenMobile = false,
  onCloseMobile
}: FilterSidebarProps) {
  const wilayahlList = ['Semua Wilayah', 'Nasional', 'Provinsi', 'Kab/Kota'];
  const tahunList = ['Semua Tahun', '2024', '2023', '2022', '2021', '2020'];

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.agama ||
    filters.kategori ||
    filters.status !== 'all' ||
    filters.cakupanWilayah ||
    filters.tahun ||
    filters.pic
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D3E4F1]">
        <div className="flex items-center space-x-2 text-[#181E24]">
          <Filter className="w-4 h-4 text-[#286084]" />
          <h3 className="font-bold text-sm tracking-tight">Filter Dataset</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-xs font-semibold text-[#286084] hover:text-[#1D4661] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Filter Agama */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          Agama / Bimas
        </label>
        <select
          value={filters.agama}
          onChange={e => onFilterChange({ agama: e.target.value })}
          aria-label="Filter Agama / Ditjen Bimas"
          className="w-full text-xs rounded-xl border border-[#D3E4F1] bg-white px-3 py-2.5 text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs font-medium"
        >
          <option value="">Semua Agama / Bimas</option>
          {agamaList.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Filter Kategori */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          Rumpun Kategori
        </label>
        <select
          value={filters.kategori}
          onChange={e => onFilterChange({ kategori: e.target.value })}
          aria-label="Filter Rumpun Kategori"
          className="w-full text-xs rounded-xl border border-[#D3E4F1] bg-white px-3 py-2.5 text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs font-medium"
        >
          <option value="">Semua Rumpun Kategori</option>
          {categories.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Filter Status Keterisian */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          Status Integrasi
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E7F1F8] border border-[#D3E4F1] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => onFilterChange({ status: 'all' })}
            className={`py-1.5 rounded-lg transition-all text-center ${
              filters.status === 'all'
                ? 'bg-white text-[#181E24] font-bold shadow-xs'
                : 'text-[#55606D] hover:text-[#181E24]'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ status: 'terisi' })}
            className={`py-1.5 rounded-lg transition-all text-center ${
              filters.status === 'terisi'
                ? 'bg-[#286084] text-white font-bold shadow-xs'
                : 'text-[#55606D] hover:text-[#286084]'
            }`}
          >
            Terisi
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ status: 'pending' })}
            className={`py-1.5 rounded-lg transition-all text-center ${
              filters.status === 'pending'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-[#55606D] hover:text-amber-700'
            }`}
          >
            Proses
          </button>
        </div>
      </div>

      {/* 4. Filter Cakupan Wilayah */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          Cakupan Wilayah
        </label>
        <select
          value={filters.cakupanWilayah}
          onChange={e => onFilterChange({ cakupanWilayah: e.target.value })}
          aria-label="Filter Cakupan Wilayah"
          className="w-full text-xs rounded-xl border border-[#D3E4F1] bg-white px-3 py-2.5 text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs font-medium"
        >
          {wilayahlList.map(item => (
            <option key={item} value={item === 'Semua Wilayah' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Filter Tahun Data */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          Periode Tahun
        </label>
        <select
          value={filters.tahun}
          onChange={e => onFilterChange({ tahun: e.target.value })}
          aria-label="Filter Periode Tahun"
          className="w-full text-xs rounded-xl border border-[#D3E4F1] bg-white px-3 py-2.5 text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs font-medium"
        >
          {tahunList.map(item => (
            <option key={item} value={item === 'Semua Tahun' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Filter PIC Pengelola */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-2">
          PIC Tim Pusdatin
        </label>
        <select
          value={filters.pic}
          onChange={e => onFilterChange({ pic: e.target.value })}
          aria-label="Filter PIC Tim Pusdatin"
          className="w-full text-xs rounded-xl border border-[#D3E4F1] bg-white px-3 py-2.5 text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs font-medium"
        >
          <option value="">Semua PIC</option>
          {picList.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 bg-white rounded-2xl border border-[#D3E4F1] p-5 shadow-xs">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D3E4F1] mb-4">
                <span className="font-bold text-[#181E24]">Filter Indikator</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>

            <div className="pt-6 border-t border-[#D3E4F1] mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-xl bg-[#286084] text-white font-bold text-xs shadow-sm hover:bg-[#1D4661]"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
