import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Moon, Cross, Church, Flame, Sun, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
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
        return <Cross className="w-5 h-5 text-sky-600" />;
      case 'Church':
        return <Church className="w-5 h-5 text-indigo-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-orange-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-purple-600" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
    }
  };

  const getThemeClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          cardBorder: 'hover:border-emerald-300',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          barBg: 'bg-emerald-500',
          iconBg: 'bg-emerald-100',
          arrowHover: 'group-hover:text-emerald-700',
        };
      case 'sky':
        return {
          cardBorder: 'hover:border-sky-300',
          badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
          barBg: 'bg-sky-500',
          iconBg: 'bg-sky-100',
          arrowHover: 'group-hover:text-sky-700',
        };
      case 'indigo':
        return {
          cardBorder: 'hover:border-indigo-300',
          badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          barBg: 'bg-indigo-500',
          iconBg: 'bg-indigo-100',
          arrowHover: 'group-hover:text-indigo-700',
        };
      case 'amber':
        return {
          cardBorder: 'hover:border-amber-300',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          barBg: 'bg-amber-500',
          iconBg: 'bg-amber-100',
          arrowHover: 'group-hover:text-amber-700',
        };
      case 'orange':
        return {
          cardBorder: 'hover:border-orange-300',
          badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
          barBg: 'bg-orange-500',
          iconBg: 'bg-orange-100',
          arrowHover: 'group-hover:text-orange-700',
        };
      case 'rose':
        return {
          cardBorder: 'hover:border-rose-300',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          barBg: 'bg-rose-500',
          iconBg: 'bg-rose-100',
          arrowHover: 'group-hover:text-rose-700',
        };
      case 'purple':
        return {
          cardBorder: 'hover:border-purple-300',
          badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          barBg: 'bg-purple-500',
          iconBg: 'bg-purple-100',
          arrowHover: 'group-hover:text-purple-700',
        };
      default:
        return {
          cardBorder: 'hover:border-teal-300',
          badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
          barBg: 'bg-teal-500',
          iconBg: 'bg-teal-100',
          arrowHover: 'group-hover:text-teal-700',
        };
    }
  };

  const theme = getThemeClass(bimas.color);

  return (
    <Link
      href={`/eksplorasi?bimas=${encodeURIComponent(bimas.nama)}`}
      className={`group relative block p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-lg transition-all duration-200 ${theme.cardBorder} hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-11 h-11 rounded-xl ${theme.iconBg} flex items-center justify-center`}>
            {renderIcon(bimas.iconName)}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {bimas.shortName}
            </h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
              {bimas.agama}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-gray-900">{bimas.totalIndikator}</span>
          <span className="text-xs text-gray-500 block">Indikator</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 line-clamp-2 mt-3 leading-relaxed">
        {bimas.deskripsi}
      </p>

      {/* Progress Keterisian Data */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center space-x-1 text-gray-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terisi: <strong className="text-gray-900">{bimas.terisi}</strong></span>
          </div>
          <span className="text-gray-500 font-semibold">{bimas.persentase}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${theme.barBg}`}
            style={{ width: `${bimas.persentase}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-500 group-hover:text-emerald-700 transition-colors">
        <span>Jelajahi Indikator</span>
        <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${theme.arrowHover}`} />
      </div>
    </Link>
  );
}
