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
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e9eaee] hover:border-[#a89ff2] shadow-xs hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#848484] mb-1.5">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl sm:text-4xl font-black text-[#151523] tracking-tight">{value}</h3>
            {trend && (
              <span className="text-[11px] font-bold text-[#6253e8] px-2 py-0.5 rounded-full bg-[#e4e1fb] border border-[#c7c1f7]">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[#686868] mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#f9f9fc] border border-[#e9eaee] group-hover:border-[#c7c1f7] flex items-center justify-center text-[#6253e8] shadow-2xs shrink-0 transition-colors">
          <Icon className="w-5 h-5 text-[#6253e8]" />
        </div>
      </div>
    </div>
  );
}
