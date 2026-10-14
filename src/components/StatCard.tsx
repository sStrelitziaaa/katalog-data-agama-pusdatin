import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'amber' | 'purple';
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'purple',
  trend
}: StatCardProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D3E4F1] hover:border-[#8EBEDE] shadow-xs hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7E8B99] mb-1.5">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl sm:text-4xl font-black text-[#181E24] tracking-tight">{value}</h3>
            {trend && (
              <span className="text-[11px] font-bold text-[#4D410E] px-2 py-0.5 rounded-full bg-[#F6EBC8] border border-[#E3CF7E]">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[#55606D] mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#E7F1F8] border border-[#D3E4F1] group-hover:border-[#8EBEDE] flex items-center justify-center text-[#286084] shadow-2xs shrink-0 transition-colors">
          <Icon className="w-5 h-5 text-[#286084]" />
        </div>
      </div>
    </div>
  );
}
