import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  FileText,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { getCatalogStats, getBimasSummaries, getAllCategories } from '@/lib/data-loader';
import StatCard from '@/components/StatCard';
import BimasCard from '@/components/BimasCard';

export default function HomePage() {
  const stats = getCatalogStats();
  const bimasList = getBimasSummaries();
  const categories = getAllCategories();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-800 via-emerald-900 to-teal-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow & subtle patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Database className="w-3.5 h-3.5" />
            <span>Satu Data Kementerian Agama Republik Indonesia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Katalog & Repositori Data <br className="hidden sm:inline" />
            <span className="text-emerald-400">Agama dan Keagamaan</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Portal repositori data terpadu Pusat Data dan Informasi (Pusdatin) Kemenag RI untuk klasifikasi, inventarisasi, dan visualisasi indikator lintas Ditjen Bimas dan unit kerja.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form action="/eksplorasi" method="GET" className="relative flex items-center">
              <input
                type="text"
                name="q"
                placeholder="Cari indikator (contoh: Masjid, Penyuluh, Peristiwa Nikah, Wakaf, Gereja)..."
                className="w-full px-5 py-4 pl-12 pr-28 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm shadow-xl focus:outline-hidden focus:ring-4 focus:ring-emerald-400/30 font-medium"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md"
              >
                Cari Data
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-emerald-200/80">
              <span className="font-semibold text-white">Pencarian Populer:</span>
              <Link href="/eksplorasi?q=Masjid" className="underline hover:text-white">Rumah Ibadah</Link>
              <span>•</span>
              <Link href="/eksplorasi?q=Penyuluh" className="underline hover:text-white">Penyuluh</Link>
              <span>•</span>
              <Link href="/eksplorasi?q=Nikah" className="underline hover:text-white">Peristiwa Nikah</Link>
              <span>•</span>
              <Link href="/eksplorasi?q=Zakat" className="underline hover:text-white">ZIS & Wakaf</Link>
              <span>•</span>
              <Link href="/eksplorasi?q=Kitab+Suci" className="underline hover:text-white">Kitab Suci</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Ringkasan Statistik */}
        <section className="-mt-16 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Indikator"
              value={stats.totalIndikator}
              subtitle="Klasifikasi dataset acuan"
              icon={FileText}
              color="emerald"
            />
            <StatCard
              title="Data Terintegrasi"
              value={stats.totalTerisi}
              trend={`${stats.persentaseTerisi}% Terisi`}
              subtitle="Data telah aktif & terverifikasi"
              icon={CheckCircle2}
              color="blue"
            />
            <StatCard
              title="Tahap Integrasi"
              value={stats.totalBelumTerisi}
              subtitle="Dalam koordinasi produsen data"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Rumpun Kategori"
              value={stats.totalKategori}
              subtitle="Rumpun data keagamaan"
              icon={Layers}
              color="purple"
            />
          </div>
        </section>

        {/* Seksi Katalog Kartu Berdasarkan Bimas / Agama */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Katalog Data Berdasarkan Ditjen Bimas & Agama
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Pilih kategori direktorat bimbingan masyarakat atau unit kerja untuk melihat indikator spesifik
              </p>
            </div>

            <Link
              href="/eksplorasi"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Lihat Semua {stats.totalIndikator} Indikator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {bimasList.map(bimas => (
              <BimasCard key={bimas.nama} bimas={bimas} />
            ))}
          </div>
        </section>

        {/* Seksi Rumpun Kategori Data */}
        <section className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Rumpun Kategori Klasifikasi Data</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Jelajahi indikator data berdasarkan kelompok tematik layanan keagamaan
              </p>
            </div>
            <Link
              href="/eksplorasi"
              className="text-xs font-semibold text-emerald-700 hover:underline hidden sm:block"
            >
              Buka Filter Lengkap
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.slice(0, 12).map(cat => (
              <Link
                key={cat}
                href={`/eksplorasi?kategori=${encodeURIComponent(cat)}`}
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/70 border border-gray-200/70 hover:border-emerald-200 transition-all text-center group"
              >
                <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-800 block truncate">
                  {cat}
                </span>
                <span className="text-[10px] text-gray-400 group-hover:text-emerald-600 mt-1 block">
                  Jelajahi &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner Quick Link Eksplorasi */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Butuh Mengunduh Seluruh Klasifikasi Data?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Gunakan fitur Eksplorasi Data untuk melakukan pencarian mendalam, filtering multi-kriteria, serta ekspor langsung ke format Excel (.xlsx) atau CSV.
            </p>
          </div>
          <Link
            href="/eksplorasi"
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm hover:bg-emerald-50 shadow-lg transition-all shrink-0 flex items-center space-x-2"
          >
            <span>Buka Eksplorasi Data</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
