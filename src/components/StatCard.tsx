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
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EBE5E0] hover:border-[#BC9887] shadow-xs hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C8077] mb-1.5">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl sm:text-4xl font-black text-[#2E231F] tracking-tight">{value}</h3>
            {trend && (
              <span className="text-[11px] font-bold text-[#A47864] px-2 py-0.5 rounded-full bg-[#F4ECE7] border border-[#E5D5CD]">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[#68605A] mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F5] border border-[#EBE5E0] group-hover:border-[#E5D5CD] flex items-center justify-center text-[#A47864] shadow-2xs shrink-0 transition-colors">
          <Icon className="w-5 h-5 text-[#A47864]" />
        </div>
      </div>
    </div>
  );
}
