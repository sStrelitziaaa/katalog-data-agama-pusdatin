'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileSpreadsheet, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BarChart2,
  FileText
} from 'lucide-react';
import { IndicatorItem } from '@/types/indicator';
import { exportToExcel, exportToCSV } from '@/lib/export-utils';

interface DataTableProps {
  data: IndicatorItem[];
  totalRaw: number;
}

export default function DataTable({ data, totalRaw }: DataTableProps) {
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

  const getAgamaBadgeColor = (agama: string) => {
    switch (agama) {
      case 'Islam':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Kristen':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Katolik':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Hindu':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Buddha':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Khonghucu':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Table Toolbar / Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            Daftar Indikator Data Agama
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Ditemukan <strong className="text-gray-900">{totalItems}</strong> indikator (dari total {totalRaw} klasifikasi data)
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100/80 transition-all shadow-2xs"
            title="Download file Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold hover:bg-gray-100 transition-all shadow-2xs"
            title="Download file CSV (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
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
          <tbody className="divide-y divide-gray-100 font-normal">
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-emerald-50/30 transition-colors group"
                >
                  <td className="px-4 py-3 text-center text-gray-400 font-mono text-[11px]">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">
                    <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 text-[11px]">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/indikator/${item.id}`}
                      className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors block text-xs sm:text-sm"
                    >
                      {item.nama}
                    </Link>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Satuan: {item.satuan} • {item.cakupanWilayah}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold mb-1 ${getAgamaBadgeColor(item.agama)}`}>
                      {item.agama}
                    </span>
                    <span className="text-[11px] text-gray-500 block truncate max-w-[140px]" title={item.bimas}>
                      {item.bimas.replace('Ditjen Bimas ', '')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-gray-700 font-medium">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.terisi ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Terisi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Proses</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                    {item.pic}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-gray-600 truncate block max-w-[180px]" title={item.sumberData}>
                      {item.sumberData}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <Link
                      href={`/indikator/${item.id}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all font-semibold text-xs shadow-2xs"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400">
                  <FileText className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold text-gray-700">Tidak ada indikator yang cocok</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter Anda.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span>Menampilkan</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Jumlah baris per halaman"
            className="border border-gray-200 rounded-lg px-2 py-1 text-gray-700 bg-white font-medium focus:outline-hidden focus:border-emerald-500"
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
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
