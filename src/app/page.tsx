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
  Sparkles,
  Compass,
  TrendingUp,
  FileText
} from 'lucide-react';
import { getCatalogStats, getBimasSummaries, getAllCategories } from '@/lib/data-loader';
import BimasCard from '@/components/BimasCard';

export default function HomePage() {
  const stats = getCatalogStats();
  const bimasList = getBimasSummaries();
  const categories = getAllCategories();

  // Signature data.gov.sg floating category pills
  const floatingPillsRow1 = [
    { label: 'Bimas Islam', icon: '🕌', href: '/eksplorasi?bimas=Islam' },
    { label: 'Bimas Kristen', icon: '⛪', href: '/eksplorasi?bimas=Kristen' },
    { label: 'Bimas Katolik', icon: '✝️', href: '/eksplorasi?bimas=Katolik' },
    { label: 'Bimas Hindu', icon: '🛕', href: '/eksplorasi?bimas=Hindu' },
    { label: 'Bimas Buddha', icon: '☸️', href: '/eksplorasi?bimas=Buddha' },
  ];

  const floatingPillsRow2 = [
    { label: 'Bimas Khonghucu', icon: '⛩️', href: '/eksplorasi?bimas=Khonghucu' },
    { label: 'Pendidikan Islam', icon: '📚', href: '/eksplorasi?kategori=Pendidikan%20Agama' },
    { label: 'Balitbang Diklat', icon: '🔬', href: '/eksplorasi?bimas=Sekretariat%20%26%20Badan' },
    { label: 'Tren 2020–2024', icon: '📈', href: '/eksplorasi' },
    { label: 'Data Terverifikasi', icon: '🛡️', href: '/eksplorasi?status=Terisi' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (data.gov.sg Signature Look & Wave Landscape) */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-28 md:pb-36 bg-gradient-to-b from-white via-[#faf9ff] to-[#f4f0fd]">
        {/* Subtle radial ambient dots */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#c7c1f7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e4e1fb] shadow-2xs mb-6 hover:border-[#a89ff2] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#6253e8] animate-pulse" />
            <span className="text-xs font-bold text-[#44418b] tracking-wide">
              Pusat Data dan Informasi (Pusdatin) Kemenag RI
            </span>
          </div>

          {/* Dual-tone Headline (Singapore data.gov.sg heavy contrast) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#151523] leading-none mb-6">
            <span>Kementerian Agama</span>
            <br className="hidden sm:inline" />
            <span className="text-[#6253e8] font-extrabold sm:ml-3">open data portal</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#686868] font-normal leading-relaxed mb-8">
            Eksplorasi dataset nasional dan indikator statistik keagamaan terpadu. Terbuka, terverifikasi, dan siap pakai untuk inovasi publik.
          </p>

          {/* Giant Elongated Pill Search Bar (Signature data.gov.sg Search) */}
          <div className="max-w-xl mx-auto mb-10">
            <form action="/eksplorasi" method="GET" className="relative group">
              <div className="flex items-center w-full h-13 sm:h-14 pl-6 pr-2 rounded-full bg-white border-2 border-[#e9eaee] hover:border-[#a89ff2] focus-within:border-[#6253e8] focus-within:ring-4 focus-within:ring-[#6253e8]/10 shadow-md transition-all">
                <input
                  type="text"
                  name="q"
                  placeholder='Cari kata kunci: "Masjid", "Nikah", "Penyuluh", "Gereja"...'
                  className="w-full bg-transparent text-sm sm:text-base text-[#151523] placeholder-[#848484] outline-none font-medium pr-3"
                />
                <button
                  type="submit"
                  aria-label="Cari Data"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#6253e8] hover:bg-[#4e49a8] active:bg-[#44418b] text-white flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Signature 2-Row Floating Category Pills */}
          <div className="space-y-3 pt-2">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {floatingPillsRow1.map(pill => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-[#e9eaee] text-xs sm:text-sm font-semibold text-[#2e2e2e] shadow-2xs hover:shadow-md hover:border-[#a89ff2] hover:text-[#6253e8] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <span className="text-sm">{pill.icon}</span>
                  <span>{pill.label}</span>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {floatingPillsRow2.map(pill => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-[#e9eaee] text-xs sm:text-sm font-semibold text-[#2e2e2e] shadow-2xs hover:shadow-md hover:border-[#a89ff2] hover:text-[#6253e8] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <span className="text-sm">{pill.icon}</span>
                  <span>{pill.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy violet landscape SVG at hero bottom */}
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
              fill="#ffffff"
            />
            <path
              d="M0 80C300 130 600 50 900 95C1200 140 1350 70 1440 90"
              stroke="#c7c1f7"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. METRICS & COUNTER STRIP (Singapore Style Numbers)         */}
      {/* ============================================================ */}
      <section className="py-12 border-b border-[#e9eaee] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#151523]">
              Portal Data Terbuka untuk <span className="text-[#6253e8]">Publik, Riset, & Kebijakan</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#686868] mt-1">
              Data statistik agama mutakhir hasil inventarisasi resmi lintas satuan kerja
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f9f9fc] border border-[#e9eaee]">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#151523] tracking-tight">{stats.totalIndikator}</span>
                <span className="text-lg font-bold text-[#6253e8]">+</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#686868] mt-1">Total Indikator</p>
              <p className="text-[11px] text-[#848484] mt-0.5">Klasifikasi terpadu</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f9f9fc] border border-[#e9eaee]">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#151523] tracking-tight">{stats.totalBimas}</span>
                <span className="text-lg font-bold text-[#6253e8]">Unit</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#686868] mt-1">Ditjen & Badan</p>
              <p className="text-[11px] text-[#848484] mt-0.5">Produsen data resmi</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f9f9fc] border border-[#e9eaee]">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#151523] tracking-tight">5</span>
                <span className="text-lg font-bold text-[#6253e8]">Tahun</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#686868] mt-1">Deret Waktu</p>
              <p className="text-[11px] text-[#848484] mt-0.5">Tren 2020 s/d 2024</p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f9f9fc] border border-[#e9eaee]">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-[#151523] tracking-tight">{stats.persentaseTerisi}</span>
                <span className="text-lg font-bold text-[#6253e8]">%</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#686868] mt-1">Data Terverifikasi</p>
              <p className="text-[11px] text-[#848484] mt-0.5">Siap dianalisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. AGENCIES & DIRECTORATES SECTION (data.gov.sg Agency Grid)  */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#151523] tracking-tight">
              {stats.totalIndikator}+ indikator dari {stats.totalBimas} unit kerja & direktorat jenderal
            </h2>
            <p className="text-sm sm:text-base text-[#686868]">
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
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#6253e8] hover:text-[#4e49a8] transition-colors"
            >
              <span>Lihat semua {stats.totalIndikator} indikator di Eksplorasi Data</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "CREATE WITH CONFIDENCE" FEATURE SECTION (Singapore Style)  */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#faf9ff] border-y border-[#e9eaee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#151523] tracking-tight">
              Akses Data Terbuka & Tepercaya
            </h2>
            <p className="text-sm sm:text-base text-[#686868]">
              Dirancang untuk mempermudah perumusan kebijakan, kajian akademisi, dan transparansi publik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e9eaee] hover:border-[#a89ff2] shadow-xs hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e4e1fb] flex items-center justify-center text-[#6253e8]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#151523] leading-snug">
                  Pengambilan keputusan berbasis data keagamaan akurat
                </h3>
                <p className="text-sm text-[#686868] leading-relaxed">
                  Akses 82+ indikator resmi dari seluruh Ditjen Bimas dan unit kerja Kementerian Agama RI secara gratis dan terstandarisasi.
                </p>
              </div>

              <div>
                <Link
                  href="/eksplorasi"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-[#6253e8] text-[#6253e8] text-xs sm:text-sm font-bold hover:bg-[#6253e8]/5 transition-all"
                >
                  <span>Buka Tabel Indikator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e9eaee] hover:border-[#a89ff2] shadow-xs hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e4e1fb] flex items-center justify-center text-[#6253e8]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#151523] leading-snug">
                  Eksplorasi visualisasi & tren deret waktu interaktif
                </h3>
                <p className="text-sm text-[#686868] leading-relaxed">
                  Pahami dinamika tren 2020 s/d 2024 dengan grafik visual yang informatif, lengkap dengan indikator pertumbuhan tahunan.
                </p>
              </div>

              <div>
                <Link
                  href="/indikator/IND-001"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-[#6253e8] text-[#6253e8] text-xs sm:text-sm font-bold hover:bg-[#6253e8]/5 transition-all"
                >
                  <span>Contoh Detail Visualisasi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. CMS & EXCEL INTEGRATION BANNER (Futuristic Purple Canvas)  */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#151523] via-[#211f3d] to-[#151523] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
            {/* Background glowing violet orb */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#6253e8]/30 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#877cee]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#c7c1f7]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#a89ff2]" />
                  <span>Sistem CMS & Pembaruan Data Excel</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Template Excel Khusus Per Indikator & Impor Cepat
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Produsen data dapat mengunduh format Excel resmi yang disesuaikan untuk masing-masing nama indikator, melakukan pembaruan nilai 2020–2024, dan menyinkronkan kembali ke portal data secara langsung.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/eksplorasi"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#6253e8] hover:bg-[#4e49a8] active:bg-[#44418b] text-white text-sm font-bold shadow-lg shadow-[#6253e8]/30 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Kelola & Unduh Template</span>
                </Link>
                <Link
                  href="/eksplorasi"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold transition-all text-center"
                >
                  Buka Eksplorasi Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
