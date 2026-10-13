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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e9eaee] shadow-xs">
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
              <span className="text-base sm:text-xl font-black tracking-tight text-[#151523]">
                Kemenag
              </span>
              <p className="text-[11px] text-[#686868] font-medium hidden sm:block">
                Pusat Data dan Informasi (Pusdatin) • Data Agama dan Keagamaan
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
  );
}
