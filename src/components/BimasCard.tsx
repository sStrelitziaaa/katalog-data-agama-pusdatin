import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Moon, Cross, Church, Flame, Sun, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BimasSummary } from '@/types/indicator';

interface BimasCardProps {
  bimas: BimasSummary;
}

export default function BimasCard({ bimas }: BimasCardProps) {
  // Map icon names
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Moon':
        return <Moon className="w-5 h-5 text-emerald-600" />;
      case 'Cross':
        return <Cross className="w-5 h-5 text-blue-600" />;
      case 'Church':
        return <Church className="w-5 h-5 text-cyan-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-orange-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#6253e8]" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5 text-[#6253e8]" />;
    }
  };

  return (
    <Link
      href={`/eksplorasi?bimas=${encodeURIComponent(bimas.nama)}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-[#e9eaee] hover:border-[#a89ff2] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#f9f9fc] border border-[#e9eaee] group-hover:border-[#c7c1f7] flex items-center justify-center shrink-0 transition-colors">
              {renderIcon(bimas.iconName)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151523] group-hover:text-[#6253e8] transition-colors leading-snug">
                {bimas.shortName}
              </h3>
              <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f9f9fc] text-[#686868] border border-[#e9eaee]">
                {bimas.agama}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-[#151523] tracking-tight">{bimas.totalIndikator}</span>
            <span className="text-[10px] text-[#848484] uppercase font-bold tracking-wider block">Indikator</span>
          </div>
        </div>

        <p className="text-xs text-[#686868] line-clamp-2 mt-3 leading-relaxed">
          {bimas.deskripsi}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#f0f0f4]">
        {/* Metric bar */}
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center space-x-1.5 text-[#474747]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Terisi: <strong className="text-[#151523]">{bimas.terisi}</strong></span>
          </div>
          <span className="text-[11px] font-bold text-[#6253e8]">{bimas.persentase}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#f0f0f4] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6253e8] to-[#877cee] transition-all duration-500"
            style={{ width: `${bimas.persentase}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#6253e8] group-hover:text-[#4e49a8] transition-colors">
          <span className="tracking-wide">Lihat Data Agency</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
