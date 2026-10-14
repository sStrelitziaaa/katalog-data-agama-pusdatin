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
        return <HeartHandshake className="w-5 h-5 text-[#286084]" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5 text-[#286084]" />;
    }
  };

  return (
    <Link
      href={`/eksplorasi?bimas=${encodeURIComponent(bimas.nama)}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-[#D3E4F1] hover:border-[#8EBEDE] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#E7F1F8] border border-[#D3E4F1] group-hover:border-[#8EBEDE] flex items-center justify-center shrink-0 transition-colors">
              {renderIcon(bimas.iconName)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#181E24] group-hover:text-[#286084] transition-colors leading-snug">
                {bimas.shortName}
              </h3>
              <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7F1F8] text-[#1D4661] border border-[#D3E4F1]">
                {bimas.agama}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-[#181E24] tracking-tight">{bimas.totalIndikator}</span>
            <span className="text-[10px] text-[#7E8B99] uppercase font-bold tracking-wider block">Indikator</span>
          </div>
        </div>

        <p className="text-xs text-[#55606D] line-clamp-2 mt-3 leading-relaxed">
          {bimas.deskripsi}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#D3E4F1]">
        {/* Metric bar */}
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center space-x-1.5 text-[#55606D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Terisi: <strong className="text-[#181E24]">{bimas.terisi}</strong></span>
          </div>
          <span className="text-[11px] font-bold text-[#286084]">{bimas.persentase}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#E7F1F8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5F9ECB] to-[#286084] transition-all duration-500"
            style={{ width: `${bimas.persentase}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#286084] group-hover:text-[#1D4661] transition-colors">
          <span className="tracking-wide">Lihat Data Agency</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
