import React from 'react';
import Link from 'next/link';
import { Database, Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-900 text-base">Pusdatin Kemenag RI</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              Pusat Data dan Informasi (Pusdatin) Kementerian Agama Republik Indonesia. Mengintegrasikan seluruh klasifikasi data agama dan keagamaan dari produsen data unit Eselon I / Ditjen Bimas ke dalam arsitektur Satu Data Terpadu.
            </p>
            <p className="text-[11px] text-gray-400">
              Berdasarkan Klasifikasi Data Agama Pusdatin & Kepmen Terkait Tata Kelola Data Nasional.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Unit Pengampu</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li><Link href="/eksplorasi?bimas=Ditjen+Bimas+Islam" className="hover:text-emerald-700">Ditjen Bimas Islam</Link></li>
              <li><Link href="/eksplorasi?bimas=Ditjen+Bimas+Kristen" className="hover:text-emerald-700">Ditjen Bimas Kristen</Link></li>
              <li><Link href="/eksplorasi?bimas=Ditjen+Bimas+Katolik" className="hover:text-emerald-700">Ditjen Bimas Katolik</Link></li>
              <li><Link href="/eksplorasi?bimas=Ditjen+Bimas+Hindu" className="hover:text-emerald-700">Ditjen Bimas Hindu</Link></li>
              <li><Link href="/eksplorasi?bimas=Ditjen+Bimas+Buddha" className="hover:text-emerald-700">Ditjen Bimas Buddha</Link></li>
              <li><Link href="/eksplorasi?bimas=Pusbimdik+Khonghucu" className="hover:text-emerald-700">Pusbimdik Khonghucu</Link></li>
              <li><Link href="/eksplorasi?bimas=Setjen" className="hover:text-emerald-700">Setjen</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Sistem Integrasi Terkait</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li className="flex items-center space-x-1">
                <span>SIMAS (Masjid/Musala)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>SIMKAH (Layanan Nikah/KUA)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>SIWAK (Tanah Wakaf)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>BAZNAS & SIMZAT (Zakat)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>EMIS Pendidikan Keagamaan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Pusat Data dan Informasi (Pusdatin) Kementerian Agama RI. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>Katalog Repositori Terpadu</span>
            <span>•</span>
            <span>Versi 1.0 (Next.js App Router)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
