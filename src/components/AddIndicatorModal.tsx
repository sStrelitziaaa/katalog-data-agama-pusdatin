'use client';

import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  AGAMA_LIST, 
  BIMAS_LIST, 
  CAKUPAN_WILAYAH_LIST, 
  FREKUENSI_UPDATE_LIST,
  DEFAULT_AGAMA_BY_BIMAS,
  TAHUN_DATA
} from '@/lib/catalog';
import { IndicatorItem, AgamaType, BimasType } from '@/types/indicator';

interface AddIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (indicator: IndicatorItem) => void;
}

export default function AddIndicatorModal({
  isOpen,
  onClose,
  onCreated
}: AddIndicatorModalProps) {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [bimas, setBimas] = useState<BimasType>('Ditjen Bimas Islam');
  const [agama, setAgama] = useState<AgamaType>('Islam');
  const [pic, setPic] = useState('');
  const [satuan, setSatuan] = useState('Unit');
  const [cakupanWilayah, setCakupanWilayah] = useState<IndicatorItem['cakupanWilayah']>('Nasional');
  const [frekuensiUpdate, setFrekuensiUpdate] = useState<IndicatorItem['frekuensiUpdate']>('Tahunan');
  const [sumberData, setSumberData] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Nilai tren tahunan (2020-2025)
  const [yearlyValues, setYearlyValues] = useState<Record<string, string>>({
    '2020': '',
    '2021': '',
    '2022': '',
    '2023': '',
    '2024': '',
    '2025': '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBimasChange = (newBimas: BimasType) => {
    setBimas(newBimas);
    const suggestedAgama = DEFAULT_AGAMA_BY_BIMAS[newBimas];
    if (suggestedAgama) {
      setAgama(suggestedAgama);
    }
  };

  const handleYearChange = (year: string, val: string) => {
    setYearlyValues(prev => ({ ...prev, [year]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trenData = TAHUN_DATA.map(tahun => {
        const raw = yearlyValues[tahun];
        const num = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : 0;
        return {
          tahun,
          nilai: num,
          satuan,
        };
      });

      const payload = {
        nama: nama.trim(),
        kategori: kategori.trim() || 'Umum',
        agama,
        bimas,
        pic: pic.trim(),
        satuan: satuan.trim(),
        cakupanWilayah,
        frekuensiUpdate,
        sumberData: sumberData.trim(),
        deskripsi: deskripsi.trim(),
        terisi: trenData.some(d => d.nilai > 0),
        trenData,
      };

      const res = await fetch('/api/admin/indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menambahkan indikator.');
      }

      // Reset form
      setNama('');
      setKategori('');
      setPic('');
      setSumberData('');
      setDeskripsi('');
      setYearlyValues({ '2020': '', '2021': '', '2022': '', '2023': '', '2024': '', '2025': '' });

      onCreated(json.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#D3E4F1] shadow-2xl p-6 sm:p-8 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-[#D3E4F1] shrink-0">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E7F1F8] border border-[#D3E4F1] text-[11px] font-bold text-[#1D4661] mb-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-[#286084]" />
              <span>Input Data Baru • CMS Administrator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#181E24]">
              Tambah Indikator Baru
            </h2>
            <p className="text-xs text-[#55606D] mt-0.5">
              Formulir penambahan indikator resmi ke database katalog Pusdatin Kemenag RI.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7E8B99] hover:text-[#181E24] hover:bg-[#F0EEE9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama Indikator */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
              Nama Indikator <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Contoh: Jumlah Masjid dan Musala Terdaftar"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 focus:border-[#5F9ECB] font-medium"
            />
          </div>

          {/* Grid 2 Kolom: Kategori & Produsen Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Rumpun Kategori <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                placeholder="Mis. Rumah Ibadah, Penyuluh, dll."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 focus:border-[#5F9ECB] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Produsen Data / Satker <span className="text-rose-500">*</span>
              </label>
              <select
                value={bimas}
                onChange={e => handleBimasChange(e.target.value as BimasType)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              >
                {BIMAS_LIST.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid 3 Kolom: Agama, PIC, Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Agama <span className="text-rose-500">*</span>
              </label>
              <select
                value={agama}
                onChange={e => setAgama(e.target.value as AgamaType)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              >
                {AGAMA_LIST.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                PIC / Subdit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pic}
                onChange={e => setPic(e.target.value)}
                placeholder="Mis. Subdit Kemasjidan"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Satuan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={satuan}
                onChange={e => setSatuan(e.target.value)}
                placeholder="Mis. Unit, Orang, Lembaga"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              />
            </div>
          </div>

          {/* Grid 2 Kolom: Cakupan & Frekuensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Cakupan Wilayah
              </label>
              <select
                value={cakupanWilayah}
                onChange={e => setCakupanWilayah(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              >
                {CAKUPAN_WILAYAH_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
                Frekuensi Pembaruan
              </label>
              <select
                value={frekuensiUpdate}
                onChange={e => setFrekuensiUpdate(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
              >
                {FREKUENSI_UPDATE_LIST.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sumber Data & Aplikasi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
              Sumber Data / Nama Aplikasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sumberData}
              onChange={e => setSumberData(e.target.value)}
              placeholder="Contoh: SIMAS (Sistem Informasi Masjid) Kemenag RI"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55606D] mb-1">
              Deskripsi / Definisi Operasional
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              placeholder="Jelaskan definisi, cakupan, dan metode pengumpulan data indikator ini..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D3E4F1] bg-[#F0EEE9]/30 focus:bg-white text-[#181E24] focus:outline-hidden focus:ring-2 focus:ring-[#286084]/20 font-medium resize-none"
            />
          </div>

          {/* Input Nilai Tren Deret Waktu (2020-2024) */}
          <div className="p-4 rounded-2xl bg-[#F5F9FD] border border-[#D3E4F1] space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#286084]" />
              <h3 className="text-xs font-bold text-[#181E24] uppercase tracking-wider">
                Nilai Deret Waktu Tahunan (Opsional - Bisa Diisi Nanti)
              </h3>
            </div>
            <p className="text-[11px] text-[#55606D]">
              Masukkan angka riil untuk tiap tahun. Jika belum tersedia, kosongkan saja.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {TAHUN_DATA.map(tahun => (
                <div key={tahun}>
                  <label className="block text-[11px] font-bold text-[#55606D] mb-1 text-center font-mono">
                    {tahun}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={yearlyValues[tahun]}
                    onChange={e => handleYearChange(tahun, e.target.value)}
                    placeholder="0"
                    className="w-full text-xs text-center px-2 py-1.5 rounded-lg border border-[#D3E4F1] bg-white text-[#181E24] focus:outline-hidden focus:border-[#5F9ECB] font-mono font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Aksi */}
          <div className="pt-3 border-t border-[#D3E4F1] flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-[#D3E4F1] text-xs font-bold text-[#55606D] hover:bg-[#F0EEE9] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#286084] hover:bg-[#1D4661] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Menyimpan ke Database...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Indikator Baru</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
