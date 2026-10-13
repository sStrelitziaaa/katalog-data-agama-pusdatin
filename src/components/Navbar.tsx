'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Database, Layers, Search, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Katalog Data', href: '/', icon: Layers },
    { label: 'Eksplorasi Indikator', href: '/eksplorasi', icon: Database },
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* Singapore Gov Masthead Style (SGDS Masthead) */}
      <div className="bg-[#f0f0f0] border-b border-[#e5e5e5] text-[11px] text-[#474747] py-1 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white shrink-0" />
            <span className="font-medium text-gray-700">
              Situs Resmi Pemerintah Republik Indonesia
            </span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-gray-600 hidden sm:inline">Kementerian Agama RI</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-gray-500">
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span className="hidden md:inline">HTTPS Terenkripsi</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center space-x-1 text-[#6253e8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">Satu Data Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#e9eaee] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/logo-kemenag.png"
                  alt="Logo Kementerian Agama RI"
                  width={40}
                  height={40}
                  className="object-contain w-auto h-9 sm:h-10"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#151523]">
                    data<span className="text-[#6253e8]">.kemenag</span>.go.id
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#e4e1fb] text-[#44418b] border border-[#c7c1f7]">
                    OPEN DATA
                  </span>
                </div>
                <p className="text-[11px] text-[#686868] font-medium hidden sm:block">
                  Pusat Data dan Informasi (Pusdatin) • Satu Data Agama
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#e4e1fb] text-[#44418b]'
                        : 'text-[#474747] hover:text-[#151523] hover:bg-[#f9f9fc]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6253e8]' : 'text-[#686868]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/eksplorasi"
                className="ml-2 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#6253e8] text-white text-xs sm:text-sm font-bold hover:bg-[#4e49a8] shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Cari Dataset</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
