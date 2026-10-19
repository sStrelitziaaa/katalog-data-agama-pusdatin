import React from 'react';
import Link from 'next/link';
import {
  Database,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Compass,
  TrendingUp,
  FileText
} from 'lucide-react';
import { getCatalogStats, getBimasSummaries, getAllCategories } from '@/lib/catalog';
import { getIndicatorsWithFallback } from '@/lib/db/indicators';
import BimasCard from '@/components/BimasCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const indicators = await getIndicatorsWithFallback();
  const stats = getCatalogStats(indicators);
  const bimasList = getBimasSummaries(indicators);
  const categories = getAllCategories(indicators);
  const firstIndicatorId = indicators[0]?.id;

  // Produsen Data Bimas & Unit Kerja Kemenag
  const floatingPillsRow1 = [
    { label: 'Bimas Islam', icon: '🕌', href: '/eksplorasi?bimas=Islam' },
    { label: 'Bimas Kristen', icon: '⛪', href: '/eksplorasi?bimas=Kristen' },
    { label: 'Bimas Katolik', icon: '✝️', href: '/eksplorasi?bimas=Katolik' },
    { label: 'Bimas Hindu', icon: '🛕', href: '/eksplorasi?bimas=Hindu' },
    { label: 'Bimas Buddha', icon: '☸️', href: '/eksplorasi?bimas=Buddha' },
  ];

  const floatingPillsRow2 = [
    { label: 'Pusbimdik Khonghucu', icon: '⛩️', href: '/eksplorasi?bimas=Khonghucu' },
    { label: 'Pendidikan Islam', icon: '📚', href: '/eksplorasi?kategori=Pendidikan%20Agama' },
    { label: 'BMBPSDM', icon: '🔬', href: '/eksplorasi?bimas=BMBPSDM' },
    { label: 'Sekretariat Jenderal', icon: '🏛️', href: '/eksplorasi?bimas=Setjen' },
    { label: 'Pusat Kerukunan Umat Beragama', icon: '🤝', href: '/eksplorasi?bimas=Pusat%20Kerukunan%20Umat%20Beragama%20(PKUB)' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0EEE9]">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Cloud Dancer Canvas with Ice Melt & Lemon Icing) */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-28 md:pb-36 bg-gradient-to-b from-white via-[#F7F6F3] to-[#F0EEE9]">
        {/* Subtle Ice Melt radial ambient dots */}
        <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#B5D3E8_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Dual-tone Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#181E24] leading-tight mb-5 sm:mb-6">
            <span className="block">Kementerian Agama</span>
            <span className="text-[#286084] font-extrabold block sm:inline">open data portal</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#55606D] font-normal leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
            Eksplorasi dataset nasional dan indikator statistik keagamaan terpadu. Terbuka, terverifikasi, dan siap pakai untuk inovasi publik.
          </p>

          {/* Giant Elongated Pill Search Bar with Lemon Icing Button */}
          <div className="max-w-xl mx-auto mb-8 sm:mb-10 px-1 sm:px-0">
            <form action="/eksplorasi" method="GET" className="relative group">
              <div className="flex items-center w-full h-12 sm:h-14 pl-4 sm:pl-6 pr-1.5 sm:pr-2 rounded-full bg-white border-2 border-[#D3E4F1] hover:border-[#8EBEDE] focus-within:border-[#5F9ECB] focus-within:ring-4 focus-within:ring-[#D3E4F1]/40 shadow-md transition-all">
                <input
                  type="text"
                  name="q"
                  placeholder='Cari kata kunci: "Masjid", "Nikah", "Penyuluh"...'
                  className="w-full bg-transparent text-xs sm:text-base text-[#181E24] placeholder-[#7E8B99] outline-none font-medium pr-2 sm:pr-3"
                />
                <button
                  type="submit"
                  aria-label="Cari Data"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F6EBC8] hover:bg-[#EEDFA7] active:bg-[#E3CF7E] border border-[#E3CF7E] text-[#4D410E] flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#4D410E]" />
                </button>
              </div>
            </form>
          </div>

          {/* Signature 2-Row Floating Category Pills */}
          <div className="space-y-2.5 sm:space-y-3 pt-1 max-w-full">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {floatingPillsRow1.map(pill => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#D3E4F1] text-xs sm:text-sm font-semibold text-[#181E24] shadow-2xs hover:shadow-md hover:border-[#8EBEDE] hover:bg-[#F5F9FD] hover:text-[#286084] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <span className="text-xs sm:text-sm">{pill.icon}</span>
                  <span>{pill.label}</span>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {floatingPillsRow2.map(pill => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#D3E4F1] text-xs sm:text-sm font-semibold text-[#181E24] shadow-2xs hover:shadow-md hover:border-[#8EBEDE] hover:bg-[#F5F9FD] hover:text-[#286084] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <span className="text-xs sm:text-sm">{pill.icon}</span>
                  <span>{pill.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy landscape SVG at hero bottom (Cloud Dancer & Ice Melt) */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 sm:h-24 object-cover"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60C240 110 480 20 720 70C960 120 1200 40 1440 80V120H0V60Z"
              fill="#F0EEE9"
            />
            <path
              d="M0 80C300 130 600 50 900 95C1200 140 1350 70 1440 90"
              stroke="#8EBEDE"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. METRICS & COUNTER STRIP (Cloud Dancer Base & Ice Melt)    */}
      {/* ============================================================ */}
      <section className="py-12 border-b border-[#D3E4F1] bg-[#F0EEE9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#181E24]">
              Portal Data Terbuka untuk <span className="text-[#286084]">Publik, Riset, & Kebijakan</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#55606D] mt-1">
              Data statistik agama mutakhir hasil inventarisasi resmi lintas satuan kerja
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#D3E4F1] shadow-2xs hover:border-[#8EBEDE] transition-all">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#181E24] tracking-tight">{stats.totalIndikator}</span>
                <span className="text-lg font-bold text-[#286084]">+</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#55606D] mt-1">Total Indikator</p>
              <p className="text-[11px] text-[#7E8B99] mt-0.5">Klasifikasi terpadu</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#D3E4F1] shadow-2xs hover:border-[#8EBEDE] transition-all">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#181E24] tracking-tight">{stats.totalBimas}</span>
                <span className="text-lg font-bold text-[#286084]">Unit</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#55606D] mt-1">Ditjen & Badan</p>
              <p className="text-[11px] text-[#7E8B99] mt-0.5">Produsen data resmi</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#D3E4F1] shadow-2xs hover:border-[#8EBEDE] transition-all">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#181E24] tracking-tight">5</span>
                <span className="text-lg font-bold text-[#286084]">Tahun</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#55606D] mt-1">Deret Waktu</p>
              <p className="text-[11px] text-[#7E8B99] mt-0.5">Tren 2020 s/d 2024</p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#D3E4F1] shadow-2xs hover:border-[#8EBEDE] transition-all">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#181E24] tracking-tight">{stats.persentaseTerisi}</span>
                <span className="text-lg font-bold text-[#286084]">%</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#55606D] mt-1">Data Terverifikasi</p>
              <p className="text-[11px] text-[#7E8B99] mt-0.5">Siap dianalisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. AGENCIES & DIRECTORATES SECTION (data.gov.sg Agency Grid)  */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#F0EEE9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#181E24] tracking-tight">
              {stats.totalIndikator > 0
                ? `${stats.totalIndikator}+ indikator dari ${stats.totalBimas} unit kerja & direktorat jenderal`
                : 'Katalog Indikator Terpadu Lintas Unit Kerja & Ditjen Bimas'}
            </h2>
            <p className="text-sm sm:text-base text-[#55606D]">
              Pilih direktorat jenderal bimbingan masyarakat atau unit kerja untuk melihat indikator data terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {bimasList.map(bimas => (
              <BimasCard key={bimas.nama} bimas={bimas} />
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/eksplorasi"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#286084] hover:text-[#1D4661] transition-colors"
            >
              <span>{stats.totalIndikator > 0 ? `Lihat semua ${stats.totalIndikator} indikator di Eksplorasi Data` : 'Buka Halaman Eksplorasi Data'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "CREATE WITH CONFIDENCE" FEATURE SECTION (Singapore Style)  */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#D3E4F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#181E24] tracking-tight">
              Akses Data Terbuka & Tepercaya
            </h2>
            <p className="text-sm sm:text-base text-[#55606D]">
              Dirancang untuk mempermudah perumusan kebijakan, kajian akademisi, dan transparansi publik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F0EEE9] border border-[#D3E4F1] hover:border-[#8EBEDE] shadow-xs hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F1F8] flex items-center justify-center text-[#286084] border border-[#D3E4F1]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#181E24] leading-snug">
                  Pengambilan keputusan berbasis data keagamaan akurat
                </h3>
                <p className="text-sm text-[#55606D] leading-relaxed">
                  Akses seluruh indikator resmi dari seluruh Ditjen Bimas dan unit kerja Kementerian Agama RI secara transparan dan terstandarisasi.
                </p>
              </div>

              <div>
                <Link
                  href="/eksplorasi"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-[#286084] text-[#286084] text-xs sm:text-sm font-bold hover:bg-[#286084] hover:text-white transition-all shadow-2xs"
                >
                  <span>Buka Tabel Indikator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F0EEE9] border border-[#D3E4F1] hover:border-[#8EBEDE] shadow-xs hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F1F8] flex items-center justify-center text-[#286084] border border-[#D3E4F1]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#181E24] leading-snug">
                  Eksplorasi visualisasi & tren deret waktu interaktif
                </h3>
                <p className="text-sm text-[#55606D] leading-relaxed">
                  Pahami dinamika tren tahunan dengan grafik visual yang informatif, lengkap dengan indikator pertumbuhan.
                </p>
              </div>

              <div>
                <Link
                  href={firstIndicatorId ? `/indikator/${firstIndicatorId}` : '/eksplorasi'}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-[#286084] text-[#286084] text-xs sm:text-sm font-bold hover:bg-[#286084] hover:text-white transition-all shadow-2xs"
                >
                  <span>{firstIndicatorId ? 'Contoh Detail Visualisasi' : 'Eksplorasi Indikator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. OPEN DATA EXPORT & PORTAL ADMIN BANNER (Deep Ice Melt & Lemon Icing) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#F0EEE9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#162938] via-[#1D4661] to-[#286084] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
            {/* Background glowing Ice Melt and Lemon Icing orbs */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#D3E4F1]/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#F6EBC8]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#F6EBC8] border border-[#E3CF7E] text-xs font-bold text-[#4D410E]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#7E6B1D]" />
                  <span>Akses Data Terbuka & Ekspor Resmi</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Eksplorasi Lengkap & Ekspor Dataset ke Excel atau CSV
                </h3>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                  Masyarakat, akademisi, dan instansi dapat melihat seluruh indikator keagamaan secara transparan, melihat visualisasi tren tahunan, dan mengunduh data dalam format Excel (.xlsx) atau CSV secara bebas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/eksplorasi"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F6EBC8] hover:bg-[#EEDFA7] active:bg-[#E3CF7E] text-[#4D410E] text-sm font-extrabold shadow-lg shadow-[#F6EBC8]/25 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4 text-[#4D410E]" />
                  <span>Buka Eksplorasi & Unduh Data</span>
                </Link>
                <Link
                  href="/admin"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold transition-all text-center flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B5D3E8]" />
                  <span>Portal Admin (CMS)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
