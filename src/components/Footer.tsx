import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#D3E4F1] bg-[#F0EEE9] text-[#55606D] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <Image
                src="/logo-kemenag.png"
                alt="Logo Kementerian Agama RI"
                width={36}
                height={36}
                className="object-contain w-auto h-9"
              />
            </div>
            <div>
              <span className="font-extrabold text-[#181E24] text-base sm:text-lg tracking-tight block">
                Kemenag
              </span>
              <p className="text-xs text-[#55606D]">
                Pusat Data dan Teknologi Informasi (Pusdatin) • Data Agama dan Keagamaan
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#55606D]">
            <Link href="/" className="hover:text-[#286084] transition-colors">
              Katalog
            </Link>
            <Link href="/eksplorasi" className="hover:text-[#286084] transition-colors">
              Eksplorasi Data
            </Link>
            <Link href="/eksplorasi?status=Terisi" className="hover:text-[#286084] transition-colors">
              Data Terverifikasi
            </Link>
            <Link href="/admin" className="hover:text-[#286084] transition-colors">
              Portal Admin (CMS)
            </Link>
            <a
              href="https://kemenag.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#286084] transition-colors inline-flex items-center space-x-1"
            >
              <span>Portal Kemenag RI</span>
              <ExternalLink className="w-3 h-3 text-[#7E8B99]" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#D3E4F1] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7E8B99]">
          <p>
            © {new Date().getFullYear()} Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Agama RI.
          </p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Lisensi Data Terbuka</span>
            <span>•</span>
            <span>Standar Satu Data Indonesia (SDI)</span>
            <span>•</span>
            <span>Versi Portal 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
