'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Database, Layers, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Katalog Data', href: '/', icon: Layers },
    { label: 'Eksplorasi Indikator', href: '/eksplorasi', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F0EEE9]/95 backdrop-blur-md border-b border-[#D3E4F1] shadow-2xs">
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
              <span className="text-base sm:text-xl font-black tracking-tight text-[#181E24]">
                Kemenag
              </span>
              <p className="text-[11px] text-[#55606D] font-medium hidden sm:block">
                Pusat Data dan Teknologi Informasi (Pusdatin) • Data Agama dan Keagamaan
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
              className="ml-2 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#F6EBC8] text-[#4D410E] hover:bg-[#EEDFA7] active:bg-[#E3CF7E] border border-[#E3CF7E] text-xs sm:text-sm font-bold shadow-2xs hover:shadow-md transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-[#4D410E]" />
              <span className="hidden sm:inline">Cari Dataset</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
