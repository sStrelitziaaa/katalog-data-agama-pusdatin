'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Database, Layers, Search, Lock, ShieldCheck, Menu, X, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';

export default function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Katalog Data', href: '/', icon: Layers, desc: 'Beranda & Ringkasan Produsen Data' },
    { label: 'Eksplorasi Indikator', href: '/eksplorasi', icon: Database, desc: 'Tabel, Filter, & Unduh Dataset' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F0EEE9]/95 backdrop-blur-md border-b border-[#D3E4F1] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
          {/* Brand Logo & Title */}
          <Link 
            href="/" 
            className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo-kemenag.png"
                alt="Logo Kementerian Agama RI"
                width={40}
                height={40}
                className="object-contain w-auto h-8 sm:h-10"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#181E24] truncate">
                Kemenag
              </span>
              <p className="text-[11px] text-[#55606D] font-medium hidden sm:block truncate">
                Pusat Data dan Teknologi Informasi (Pusdatin) • Data Agama dan Keagamaan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (>= md) */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E7F1F8] text-[#1D4661] border border-[#D3E4F1] shadow-2xs'
                      : 'text-[#55606D] hover:text-[#181E24] hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#286084]' : 'text-[#7E8B99]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Highlight: Lemon Icing Button */}
            <Link
              href="/eksplorasi"
              className="ml-2 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#F6EBC8] text-[#4D410E] hover:bg-[#EEDFA7] active:bg-[#E3CF7E] border border-[#E3CF7E] text-sm font-bold shadow-2xs hover:shadow-md transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-[#4D410E]" />
              <span>Cari Dataset</span>
            </Link>

            {/* Portal Admin / CMS */}
            <Link
              href="/admin"
              className={`ml-1 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/admin'
                  ? 'bg-[#E7F1F8] text-[#1D4661] border border-[#D3E4F1]'
                  : isAdmin
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-[#7E8B99] hover:text-[#181E24] hover:bg-white/80'
              }`}
              title={isAdmin ? "Dashboard Administrator Aktif" : "Portal Administrator (CMS)"}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#7E8B99]" />
                  <span>Admin</span>
                </>
              )}
            </Link>
          </nav>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center space-x-2 shrink-0">
            {/* Quick Search Shortcut */}
            <Link
              href="/eksplorasi"
              className="w-9 h-9 rounded-full bg-[#F6EBC8] text-[#4D410E] border border-[#E3CF7E] flex items-center justify-center shadow-2xs active:scale-95 transition-all"
              aria-label="Cari Dataset"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
              aria-expanded={isMobileMenuOpen}
              className="w-9 h-9 rounded-xl bg-white border border-[#D3E4F1] text-[#181E24] flex items-center justify-center hover:bg-[#F5F9FD] active:scale-95 transition-all shadow-2xs"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#286084]" />
              ) : (
                <Menu className="w-5 h-5 text-[#181E24]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D3E4F1] bg-[#F0EEE9]/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2">
          {/* Quick Search Form inside drawer */}
          <form 
            action="/eksplorasi" 
            method="GET" 
            onSubmit={() => setIsMobileMenuOpen(false)}
            className="relative"
          >
            <div className="flex items-center w-full h-11 pl-4 pr-1.5 rounded-full bg-white border border-[#D3E4F1] shadow-2xs focus-within:border-[#5F9ECB] focus-within:ring-2 focus-within:ring-[#D3E4F1]">
              <input
                type="text"
                name="q"
                placeholder='Cari dataset: "Masjid", "Nikah"...'
                className="w-full bg-transparent text-xs text-[#181E24] placeholder-[#7E8B99] outline-none font-medium pr-2"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="w-8 h-8 rounded-full bg-[#F6EBC8] text-[#4D410E] flex items-center justify-center shrink-0 border border-[#E3CF7E]"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Nav Items List */}
          <div className="space-y-1.5 pt-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#E7F1F8] border border-[#D3E4F1] text-[#1D4661] shadow-2xs'
                      : 'bg-white/80 border border-[#D3E4F1]/60 text-[#181E24] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#286084] text-white' : 'bg-[#E7F1F8] text-[#286084]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{item.label}</span>
                      <span className="text-[11px] text-[#55606D] font-normal">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7E8B99]" />
                </Link>
              );
            })}

            {/* Portal Admin / CMS in Drawer */}
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                pathname === '/admin'
                  ? 'bg-[#E7F1F8] border border-[#D3E4F1] text-[#1D4661]'
                  : isAdmin
                  ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-900'
                  : 'bg-white/80 border border-[#D3E4F1]/60 text-[#181E24] hover:bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAdmin ? 'bg-emerald-600 text-white' : 'bg-[#F0EEE9] text-[#7E8B99]'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold">Portal Administrator</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-800 text-[10px] font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#55606D] font-normal">
                    {isAdmin ? 'Akses CMS & Unggah Excel Terbuka' : 'Khusus Pengelola Data Pusdatin (CMS)'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7E8B99]" />
            </Link>
          </div>

          {/* Subtitle / Department note */}
          <div className="pt-2 border-t border-[#D3E4F1]/70 text-center">
            <p className="text-[10px] text-[#7E8B99] font-medium">
              Pusat Data dan Teknologi Informasi (Pusdatin) • Kementerian Agama RI
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
