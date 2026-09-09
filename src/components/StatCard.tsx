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
  color = 'emerald',
  trend
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200/70',
      iconBg: 'bg-emerald-600',
      text: 'text-emerald-700',
      sub: 'text-emerald-600',
    },
    blue: {
      bg: 'bg-sky-50/70',
      border: 'border-sky-200/70',
      iconBg: 'bg-sky-600',
      text: 'text-sky-700',
      sub: 'text-sky-600',
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200/70',
      iconBg: 'bg-amber-600',
      text: 'text-amber-700',
      sub: 'text-amber-600',
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-200/70',
      iconBg: 'bg-purple-600',
      text: 'text-purple-700',
      sub: 'text-purple-600',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-5 rounded-2xl border ${scheme.border} ${scheme.bg} backdrop-blur-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
            {trend && (
              <span className={`text-xs font-semibold ${scheme.text} px-2 py-0.5 rounded-full bg-white/80 border ${scheme.border}`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-600 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${scheme.iconBg} flex items-center justify-center text-white shadow-sm shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
