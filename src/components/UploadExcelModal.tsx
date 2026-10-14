'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Edit3,
  Calendar,
  Building2,
  Tag,
  RotateCcw
} from 'lucide-react';
import { IndicatorItem, YearlyDataPoint } from '@/types/indicator';
import { 
  downloadExcelTemplate, 
  downloadIndicatorTemplate, 
  downloadCategoryTemplate,
  parseUploadedExcel, 
  parseSingleIndicatorExcel 
} from '@/lib/excel-template-utils';

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (imported: IndicatorItem[], mode: 'append' | 'replace') => void;
  existingIndicators: IndicatorItem[];
  initialIndicatorId?: string;
}

export default function UploadExcelModal({
  isOpen,
  onClose,
  onImportSuccess,
  existingIndicators,
  initialIndicatorId,
}: UploadExcelModalProps) {
  // Tabs: 'single' (CMS per Indikator) | 'category' (Per Kategori) | 'bulk' (Impor Masal)
  const [activeTab, setActiveTab] = useState<'single' | 'category' | 'bulk'>('single');

  // State untuk Tab 1 (CMS per Indikator)
  const [filterBimas, setFilterBimas] = useState<string>('');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    initialIndicatorId || existingIndicators[0]?.id || ''
  );
  const [inlineValues, setInlineValues] = useState<Record<string, number>>({});
  const [inlineStatus, setInlineStatus] = useState<boolean>(true);

  // State untuk Tab 2 (Per Kategori)
  const [selectedCategory, setSelectedCategory] = useState<string>('Rumah Ibadah');

  // State File Upload & Preview
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<IndicatorItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial indicator jika berubah
  useEffect(() => {
    if (initialIndicatorId) {
      setSelectedIndicatorId(initialIndicatorId);
      setActiveTab('single');
    }
  }, [initialIndicatorId]);

  // Cari objek indikator terpilih
  const currentIndicator = useMemo(() => {
    return existingIndicators.find(item => item.id.toLowerCase() === selectedIndicatorId.toLowerCase()) 
      || existingIndicators[0];
  }, [existingIndicators, selectedIndicatorId]);

  // Inisialisasi nilai form edit inline saat indikator berganti
  useEffect(() => {
    if (currentIndicator) {
      const vals: Record<string, number> = {};
      currentIndicator.trenData?.forEach(t => {
        vals[t.tahun] = t.nilai;
      });
      setInlineValues(vals);
      setInlineStatus(currentIndicator.terisi);
    }
  }, [currentIndicator]);

  // Daftar unik Bimas & Kategori untuk dropdown
  const bimasList = useMemo(() => {
    return Array.from(new Set(existingIndicators.map(item => item.bimas))).sort();
  }, [existingIndicators]);

  const categoryList = useMemo(() => {
    return Array.from(new Set(existingIndicators.map(item => item.kategori))).sort();
  }, [existingIndicators]);

  // Filter daftar indikator untuk dropdown Tab 1
  const filteredIndicatorsForSelect = useMemo(() => {
    return existingIndicators.filter(item => {
      if (filterBimas && item.bimas !== filterBimas && item.kategori !== filterBimas) {
        return false;
      }
      return true;
    });
  }, [existingIndicators, filterBimas]);

  if (!isOpen) return null;

  // Handler Download Template
  const handleDownloadSingleTemplate = () => {
    if (currentIndicator) downloadIndicatorTemplate(currentIndicator);
  };

  const handleDownloadCategoryTemplate = () => {
    const matched = existingIndicators.filter(item => item.kategori === selectedCategory);
    downloadCategoryTemplate(selectedCategory, matched);
  };

  const handleDownloadBulkTemplate = () => {
    downloadExcelTemplate();
  };

  // Handler Simpan Cepat (Inline CMS)
  const handleSaveInline = () => {
    if (!currentIndicator) return;

    const years = ['2020', '2021', '2022', '2023', '2024'];
    const newTrenData: YearlyDataPoint[] = years.map(yr => ({
      tahun: yr,
      nilai: inlineValues[yr] !== undefined ? Number(inlineValues[yr]) : 0,
      satuan: currentIndicator.satuan,
      catatan: inlineStatus ? 'Data terverifikasi' : 'Tahap verifikasi'
    }));

    const updated: IndicatorItem = {
      ...currentIndicator,
      terisi: inlineStatus,
      statusText: inlineStatus ? 'Terisi / Terintegrasi' : 'Dalam Proses',
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
      trenData: newTrenData
    };

    onImportSuccess([updated], 'append');
    setSuccessMessage(`Data indikator "${updated.nama}" berhasil diperbarui!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  // Handler Upload Berkas Excel
  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setErrors(['Format berkas harus berupa Excel (.xlsx atau .xls).']);
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setErrors([]);
    setPreviewData([]);
    setSuccessMessage(null);

    try {
      if (activeTab === 'single' && currentIndicator) {
        // Mode 1: Parse file khusus untuk 1 indikator
        const res = await parseSingleIndicatorExcel(selectedFile, currentIndicator);
        if (res.success && res.updatedIndicator) {
          setPreviewData([res.updatedIndicator]);
        } else {
          setErrors(res.errors.length > 0 ? res.errors : ['Gagal membaca data untuk indikator terpilih.']);
        }
      } else {
        // Mode 2 & 3: Parse file umum / multi baris
        const result = await parseUploadedExcel(selectedFile, existingIndicators);
        if (result.success) {
          setPreviewData(result.imported);
          setErrors(result.errors);
        } else {
          setErrors(result.errors.length > 0 ? result.errors : ['Tidak ada data valid yang dapat dibaca dari file ini.']);
        }
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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyPreview = () => {
    if (previewData.length > 0) {
      onImportSuccess(previewData, activeTab === 'single' ? 'append' : importMode);
      setSuccessMessage(`Berhasil menerapkan ${previewData.length} data ke website!`);

      // Kirim berkas ke backend API jika database terhubung
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch('/api/admin/upload-excel', {
          method: 'POST',
          headers: {
            'x-admin-auth': 'true'
          },
          body: formData,
        }).catch(err => {
          console.warn('[Database Sync]: Berjalan dalam mode lokal.', err);
        });
      }

      setTimeout(() => {
        setSuccessMessage(null);
        resetState();
        onClose();
      }, 1200);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setSuccessMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-[#D3E4F1] flex items-center justify-between bg-gradient-to-r from-[#E7F1F8] via-[#F5F9FD] to-white">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-[#286084] text-white shadow-md shadow-[#286084]/20">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-[#181E24] tracking-tight">
                  CMS Kelola & Unggah Data Agama
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#F6EBC8] text-[#4D410E] text-[10px] font-bold border border-[#E3CF7E]">
                  Pusdatin Kemenag
                </span>
              </div>
              <p className="text-xs text-[#55606D]">
                Pilih indikator data spesifik, unduh template khusus, atau unggah pembaharuan data Excel
              </p>
            </div>
          </div>

          <button
            onClick={() => { resetState(); onClose(); }}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Nav */}
        <div className="px-6 pt-3 bg-gray-50/60 border-b border-gray-100 flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('single'); resetState(); }}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'single'
                ? 'border-[#286084] text-[#1D4661] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. CMS per Nama Indikator (Rekomendasi)</span>
          </button>

          <button
            onClick={() => { setActiveTab('category'); resetState(); }}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'category'
                ? 'border-[#286084] text-[#1D4661] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Template per Kategori Data</span>
          </button>

          <button
            onClick={() => { setActiveTab('bulk'); resetState(); }}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bulk'
                ? 'border-[#286084] text-[#1D4661] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>3. Impor Masal (Banyak Data)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* ==================== TAB 1: CMS PER INDIKATOR ==================== */}
          {activeTab === 'single' && (
            <div className="space-y-6">
              
              {/* Filter & Dropdown Indikator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Dropdown Filter Bimas/Kategori untuk mempersempit */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Filter Bimas / Kategori
                    </label>
                    <select
                      value={filterBimas}
                      onChange={e => setFilterBimas(e.target.value)}
                      className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-800 font-medium focus:ring-2 focus:ring-[#D3E4F1]/50 focus:border-[#5F9ECB] shadow-2xs"
                    >
                      <option value="">Semua Ditjen Bimas & Kategori</option>
                      <optgroup label="-- Ditjen Bimas / Unit --">
                        {bimasList.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </optgroup>
                      <optgroup label="-- Rumpun Kategori --">
                        {categoryList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Dropdown Utama: Nama Indikator */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1.5">
                      Pilih Nama Indikator Data yang Ingin Dikelola:
                    </label>
                    <select
                      value={selectedIndicatorId}
                      onChange={e => setSelectedIndicatorId(e.target.value)}
                      className="w-full text-xs font-semibold rounded-xl border-2 border-[#5F9ECB]/50 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-[#D3E4F1]/50 focus:border-[#286084] shadow-xs"
                    >
                      {filteredIndicatorsForSelect.map(item => (
                        <option key={item.id} value={item.id}>
                          [{item.id}] {item.nama} ({item.agama})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Info Card Indikator Terpilih */}
                {currentIndicator && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#D3E4F1] shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                          {currentIndicator.id}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {currentIndicator.nama}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7F1F8] text-[#1D4661] border border-[#D3E4F1] font-semibold">
                          {currentIndicator.agama}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        PIC: <strong className="text-gray-700">{currentIndicator.pic}</strong> • Satuan: <strong className="text-gray-700">{currentIndicator.satuan}</strong> • Sumber: <strong className="text-gray-700">{currentIndicator.sumberData}</strong>
                      </p>
                    </div>

                    {/* Tombol Download Template Khusus Indikator Ini (Highlight Lemon Icing) */}
                    <button
                      type="button"
                      onClick={handleDownloadSingleTemplate}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#F6EBC8] text-[#4D410E] border border-[#E3CF7E] text-xs font-bold hover:bg-[#EEDFA7] shadow-sm transition-all shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-[#4D410E]" />
                      <span>Download Template Excel Indikator Ini</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pilihan Metode: A. Upload Excel Khusus, ATAU B. Input Cepat Langsung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Opsi A: Upload File Excel Khusus Indikator Ini */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#E7F1F8] text-[#1D4661] flex items-center justify-center font-bold text-[11px]">
                      A
                    </span>
                    <h4 className="text-xs font-bold text-gray-900">
                      Upload File Excel Indikator Ini
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Unggah file Excel template yang sudah Anda isi angka nilai tahunannya.
                  </p>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-[#8EBEDE] rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-gray-50/80"
                  >
                    <UploadCloud className="w-7 h-7 mx-auto text-[#286084] mb-1" />
                    <p className="text-xs font-bold text-gray-800">
                      {file ? file.name : 'Pilih / Seret Berkas Excel'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Otomatis memetakan angka tahun ke grafik
                    </p>
                  </div>
                </div>

                {/* Opsi B: Input Cepat Langsung di Browser (Inline CMS) */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                        B
                      </span>
                      <h4 className="text-xs font-bold text-gray-900">
                        Atau Edit Angka Langsung di Web
                      </h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Tanpa buka Excel</span>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Ubah nilai angka runtun waktu langsung di sini:
                  </p>

                  <div className="grid grid-cols-5 gap-1.5">
                    {['2020', '2021', '2022', '2023', '2024'].map(yr => (
                      <div key={yr}>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1 text-center">
                          {yr}
                        </label>
                        <input
                          type="number"
                          value={inlineValues[yr] ?? 0}
                          onChange={e => setInlineValues({ ...inlineValues, [yr]: parseFloat(e.target.value) || 0 })}
                          className="w-full text-center text-xs font-bold rounded-lg border border-gray-200 px-1 py-1.5 text-gray-900 focus:ring-1 focus:ring-[#286084] focus:border-[#286084]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlineStatus}
                        onChange={e => setInlineStatus(e.target.checked)}
                        className="rounded text-[#286084] focus:ring-[#286084]"
                      />
                      <span className="text-gray-700 font-medium text-[11px]">Status Terisi & Terverifikasi</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleSaveInline}
                      className="px-3.5 py-1.5 rounded-xl bg-[#286084] text-white text-xs font-bold hover:bg-[#1D4661] shadow-xs transition-all"
                    >
                      Simpan Nilai
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== TAB 2: TEMPLATE PER KATEGORI ==================== */}
          {activeTab === 'category' && (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F9FD] border border-[#D3E4F1] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#181E24]">
                  Pilih Rumpun Kategori yang Ingin Diisi:
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#D3E4F1]/40 focus:border-[#5F9ECB] shadow-2xs"
                  >
                    {categoryList.map(cat => {
                      const count = existingIndicators.filter(item => item.kategori === cat).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count} Indikator)
                        </option>
                      );
                    })}
                  </select>

                  <button
                    type="button"
                    onClick={handleDownloadCategoryTemplate}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#F6EBC8] text-[#4D410E] border border-[#E3CF7E] text-xs font-bold hover:bg-[#EEDFA7] shadow-sm transition-all shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4D410E]" />
                    <span>Download Template Kategori "{selectedCategory}"</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#1D4661]">
                  Template ini memuat seluruh nama indikator dalam kategori tersebut lengkap dengan kolom angka tahun 2020 s/d 2024.
                </p>
              </div>

              {/* Dropzone Upload Kategori */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Unggah Kembali File Excel Kategori Tersebut:
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D3E4F1] hover:border-[#5F9ECB] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-[#E7F1F8]/40"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-[#286084] mb-2" />
                  <p className="text-xs font-bold text-gray-800">
                    {file ? file.name : 'Pilih atau Seret Berkas Excel Kategori'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Mendukung pembaruan multi-indikator sekaligus
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: IMPOR MASAL (BANYAK DATA) ==================== */}
          {activeTab === 'bulk' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900 block">
                    Download Template Excel Kosong / Format Bebas
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Gunakan template ini untuk menambahkan data-data baru yang belum ada di daftar 82 indikator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBulkTemplate}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D3E4F1] text-gray-700 text-xs font-bold hover:bg-[#E7F1F8] shadow-2xs shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#286084]" />
                  <span>Download Template Excel Lengkap</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Pilih Berkas Excel untuk Diimpor:
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D3E4F1] hover:border-[#5F9ECB] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-[#E7F1F8]/40"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-[#286084] mb-2" />
                  <p className="text-xs font-bold text-gray-800">
                    {file ? file.name : 'Klik untuk memilih berkas atau seret file ke sini'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Mendukung format Microsoft Excel (.xlsx dan .xls)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Loading indicator */}
          {loading && (
            <div className="p-4 rounded-2xl bg-[#E7F1F8]/60 text-center text-xs text-gray-600 flex items-center justify-center space-x-2 border border-[#D3E4F1]">
              <Loader2 className="w-4 h-4 animate-spin text-[#286084]" />
              <span>Memvalidasi dan membaca data dari file Excel...</span>
            </div>
          )}

          {/* Success message banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-[#E7F1F8] border border-[#D3E4F1] text-xs font-bold text-[#132E40] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#286084]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Errors */}
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

          {/* Preview Table if file parsed */}
          {previewData.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-[#132E40] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#286084]" />
                  <span>Ditemukan {previewData.length} data valid siap diterapkan:</span>
                </div>
                <span className="text-[10px] text-gray-400">Pratinjau Data</span>
              </div>

              <div className="border border-[#D3E4F1] rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#E7F1F8] text-[11px] font-semibold text-[#132E40] uppercase sticky top-0 border-b border-[#D3E4F1]">
                    <tr>
                      <th className="px-3 py-2">Kode</th>
                      <th className="px-3 py-2">Nama Indikator</th>
                      <th className="px-3 py-2">Agama</th>
                      <th className="px-3 py-2">Kategori</th>
                      <th className="px-3 py-2">Tahun Terbaru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.map((item, idx) => {
                      const latestPoint = item.trenData?.[item.trenData.length - 1];
                      return (
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
                          <td className="px-3 py-2 font-mono text-[#286084] font-bold">
                            {latestPoint ? `${latestPoint.tahun}: ${latestPoint.nilai.toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {activeTab === 'bulk' && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center space-x-4">
                  <span className="font-bold text-gray-700">Metode:</span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-[#286084]"
                    />
                    <span className="text-gray-700 font-medium">Gabungkan / Update</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-[#286084]"
                    />
                    <span className="text-gray-700 font-medium">Ganti Seluruh Data</span>
                  </label>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            type="button"
            onClick={() => { resetState(); onClose(); }}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>

          {previewData.length > 0 && (
            <button
              type="button"
              onClick={handleApplyPreview}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#286084] text-white text-xs font-bold hover:bg-[#1f4e6d] shadow-md transition-all"
            >
              <span>Terapkan {previewData.length} Data ke Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
