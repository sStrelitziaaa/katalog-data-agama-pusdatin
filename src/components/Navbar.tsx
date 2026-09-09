'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, BarChart3, Layers, BookOpen, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Katalog', href: '/', icon: Layers },
    { label: 'Eksplorasi Data', href: '/eksplorasi', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-gray-900 tracking-tight">Pusdatin Kemenag RI</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Satu Data Agama
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">
                Katalog & Repositori Data Agama dan Keagamaan
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
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/eksplorasi"
              className="ml-2 hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Indikator</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
