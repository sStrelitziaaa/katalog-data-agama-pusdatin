'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileSpreadsheet, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  BarChart2,
  FileText,
  UploadCloud,
  FileDown,
  RotateCcw
} from 'lucide-react';
import { IndicatorItem } from '@/types/indicator';
import { exportToExcel, exportToCSV } from '@/lib/export-utils';
import { downloadExcelTemplate } from '@/lib/excel-template-utils';

interface DataTableProps {
  data: IndicatorItem[];
  totalRaw: number;
  onOpenUploadModal?: () => void;
  customCount?: number;
  onResetCustomData?: () => void;
}

export default function DataTable({ 
  data, 
  totalRaw, 
  onOpenUploadModal,
  customCount = 0,
  onResetCustomData
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Pagination calculation
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Reset current page if out of bounds
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = data.slice(startIndex, endIndex);

  const handleExportExcel = () => {
    exportToExcel(data, `Katalog-Data-Agama-Pusdatin-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleExportCSV = () => {
    exportToCSV(data, `Katalog-Data-Agama-Pusdatin-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
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
        return 'bg-[#f0f0f4] text-[#474747] border-[#e9eaee]';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5E0] shadow-xs overflow-hidden">
      {/* Table Toolbar / Header */}
      <div className="p-4 sm:p-5 border-b border-[#EBE5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-[#2E231F] text-sm sm:text-base">
              Daftar Indikator Data Agama
            </h3>
            {customCount > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#F4ECE7] text-[#744D3D] border border-[#E5D5CD] text-[10px] font-bold">
                <span>+{customCount} Data Diperbarui</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#68605A] mt-0.5 font-medium">
            Menampilkan <strong className="text-[#2E231F]">{totalItems}</strong> indikator (dari total {totalRaw} dataset terdaftar)
          </p>
        </div>

        {/* Action Buttons: Upload, Template, Export */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Tombol Upload Excel */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#A47864] text-white text-xs font-bold hover:bg-[#8E614E] active:bg-[#744D3D] transition-all shadow-xs"
              title="Kelola dan perbarui data via CMS Excel"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Kelola / CMS</span>
            </button>
          )}

          {/* Tombol Download Template */}
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#FAF7F5] text-[#744D3D] border border-[#E5D5CD] text-xs font-semibold hover:bg-[#F4ECE7] transition-all shadow-2xs"
            title="Download template tabel Excel standar"
          >
            <FileDown className="w-3.5 h-3.5 text-[#A47864]" />
            <span className="hidden md:inline">Template Excel</span>
          </button>

          {/* Tombol Export Excel */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white text-[#2E231F] border border-[#EBE5E0] text-xs font-semibold hover:bg-[#FAF7F5] hover:border-[#BC9887] transition-all shadow-2xs"
            title="Download file Excel (.xlsx) dari filter saat ini"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#A47864]" />
            <span>Export Excel</span>
          </button>

          {/* Tombol Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-2.5 py-2 rounded-xl bg-white text-[#474747] border border-[#EBE5E0] text-xs font-semibold hover:bg-[#FAF7F5] transition-all shadow-2xs"
            title="Download file CSV (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-[#8C8077]" />
            <span>CSV</span>
          </button>

          {/* Reset custom data if active */}
          {customCount > 0 && onResetCustomData && (
            <button
              onClick={onResetCustomData}
              className="p-2 rounded-xl border border-[#EBE5E0] text-[#8C8077] hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Kembalikan data ke 82 indikator acuan bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#474747]">
          <thead className="bg-[#FAF7F5] text-[#68605A] font-bold uppercase tracking-wider text-[11px] border-b border-[#EBE5E0]">
            <tr>
              <th scope="col" className="px-4 py-3.5 w-14 text-center">No</th>
              <th scope="col" className="px-4 py-3.5 w-24">Kode</th>
              <th scope="col" className="px-4 py-3.5">Nama Indikator</th>
              <th scope="col" className="px-4 py-3.5">Agama & Bimas</th>
              <th scope="col" className="px-4 py-3.5">Rumpun Kategori</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">PIC</th>
              <th scope="col" className="px-4 py-3.5">Sumber Data</th>
              <th scope="col" className="px-4 py-3.5 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE5E0] font-normal">
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-[#FAF7F5] transition-colors group"
                >
                  <td className="px-4 py-3 text-center text-[#8C8077] font-mono text-[11px]">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#2E231F]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF7F5] text-[#744D3D] border border-[#EBE5E0] text-[11px]">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/indikator/${item.id}`}
                      className="font-bold text-[#2E231F] group-hover:text-[#A47864] transition-colors block text-xs sm:text-sm"
                    >
                      {item.nama}
                    </Link>
                    <span className="text-[11px] text-[#8C8077] block mt-0.5 font-medium">
                      Satuan: {item.satuan} • {item.cakupanWilayah}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-semibold mb-1 ${getAgamaBadgeColor(item.agama)}`}>
                      {item.agama}
                    </span>
                    <span className="text-[11px] text-[#68605A] block truncate max-w-[140px]" title={item.bimas}>
                      {item.bimas.replace('Ditjen Bimas ', '')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-[#2E231F] font-semibold">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.terisi ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Terisi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Proses</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#2E231F]">
                    {item.pic}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-[#68605A] truncate block max-w-[180px]" title={item.sumberData}>
                      {item.sumberData}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <Link
                      href={`/indikator/${item.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#F4ECE7] text-[#744D3D] hover:bg-[#A47864] hover:text-white transition-all font-bold text-xs shadow-2xs"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#8C8077]">
                  <FileText className="w-8 h-8 mx-auto text-[#CFC5BD] mb-2" />
                  <p className="font-semibold text-[#2E231F]">Tidak ada indikator yang cocok</p>
                  <p className="text-xs text-[#8C8077] mt-1">
                    Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter Anda.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#EBE5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#68605A]">
        <div className="flex items-center space-x-2">
          <span>Menampilkan</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Jumlah baris per halaman"
            className="border border-[#EBE5E0] rounded-lg px-2 py-1 text-[#2E231F] bg-white font-medium focus:outline-hidden focus:border-[#A47864]"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>baris per halaman (Total: {totalItems})</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg border border-[#EBE5E0] hover:bg-[#FAF7F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && validCurrentPage > 3) {
                pageNum = validCurrentPage - 3 + i + 1;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    validCurrentPage === pageNum
                      ? 'bg-[#A47864] text-white shadow-xs'
                      : 'border border-[#EBE5E0] text-[#474747] hover:bg-[#FAF7F5]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#EBE5E0] hover:bg-[#FAF7F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
