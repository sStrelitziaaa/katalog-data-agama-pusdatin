'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Loader2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IndicatorItem } from '@/types/indicator';
import { downloadExcelTemplate, parseUploadedExcel } from '@/lib/excel-template-utils';

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (imported: IndicatorItem[], mode: 'append' | 'replace') => void;
  existingIndicators: IndicatorItem[];
}

export default function UploadExcelModal({
  isOpen,
  onClose,
  onImportSuccess,
  existingIndicators,
}: UploadExcelModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<IndicatorItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setErrors(['Format berkas harus berupa Excel (.xlsx atau .xls).']);
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setErrors([]);
    setPreviewData([]);

    try {
      const result = await parseUploadedExcel(selectedFile, existingIndicators);
      if (result.success) {
        setPreviewData(result.imported);
        setErrors(result.errors);
      } else {
        setErrors(result.errors.length > 0 ? result.errors : ['Tidak ada data valid yang dapat dibaca dari file ini.']);
      }
    } catch (err: any) {
      setErrors([err?.message || 'Terjadi kesalahan saat memproses file Excel.']);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (previewData.length > 0) {
      onImportSuccess(previewData, importMode);
      onClose();
    }
  };

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-teal-50/30">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Unggah & Impor Data Excel
                </h3>
                <p className="text-xs text-gray-500">
                  Satu Data Agama & Keagamaan • Pusdatin Kemenag RI
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { resetState(); onClose(); }}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Template Download Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs sm:text-sm">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Belum punya format tabel yang sesuai?</span>
              </div>
              <p className="text-xs text-emerald-700/90 leading-relaxed">
                Unduh template resmi kami dengan contoh pengisian data, pilihan agama/bimas resmi, dan kolom data tahun 2020–2024.
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template Excel</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Pilih Berkas Excel (.xlsx / .xls)
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>

              {file ? (
                <div>
                  <p className="text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Klik untuk mengganti berkas
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Klik untuk memilih berkas atau seret file ke sini
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Mendukung format Microsoft Excel (.xlsx dan .xls)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-6 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span>Sedang memverifikasi struktur kolom dan membaca data Excel...</span>
            </div>
          )}

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Peringatan Pembacaan Berkas:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ditemukan {previewData.length} indikator valid siap diimpor:</span>
                </div>
                <span className="text-[11px] text-gray-400">Pratinjau Data</span>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase sticky top-0 border-b border-gray-100">
                    <tr>
                      <th className="px-3 py-2">Kode</th>
                      <th className="px-3 py-2">Nama Indikator</th>
                      <th className="px-3 py-2">Agama</th>
                      <th className="px-3 py-2">Kategori</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono font-bold text-gray-800 text-[11px]">
                          {item.id}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.agama}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                          {item.kategori}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.terisi ? (
                            <span className="text-emerald-700 font-semibold text-[11px]">Terisi</span>
                          ) : (
                            <span className="text-amber-700 font-semibold text-[11px]">Proses</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mode Impor */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <span className="font-bold text-gray-800 block">Metode Impor Data:</span>
                <div className="space-y-1.5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700 font-medium">
                      <strong>Tambahkan / Perbarui ke Katalog</strong> (Rekomendasi: menggabungkan dengan 82 data acuan yang ada)
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700 font-medium">
                      <strong>Ganti Seluruh Data Katalog</strong> (Hanya menampilkan data dari file Excel ini)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            type="button"
            onClick={() => { resetState(); onClose(); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center space-x-2">
            {previewData.length > 0 && (
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition-all"
              >
                <span>Terapkan {previewData.length} Data ke Website</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
