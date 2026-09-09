'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, LineChart as LineIcon, Layers } from 'lucide-react';
import { YearlyDataPoint } from '@/types/indicator';

interface TrendChartProps {
  data: YearlyDataPoint[];
  satuan: string;
  namaIndikator: string;
}

export default function TrendChart({ data, satuan, namaIndikator }: TrendChartProps) {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as YearlyDataPoint;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
          <p className="font-bold text-gray-900 mb-1">Tahun {label}</p>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-sm">
            <span>{formatNumber(point.nilai)}</span>
            <span className="text-xs text-gray-500 font-normal">{satuan}</span>
          </div>
          {point.catatan && (
            <p className="text-[11px] text-gray-400 mt-1 border-t border-gray-100 pt-1">
              {point.catatan}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Grafik Tren Runtun Waktu (2020 - 2024)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Satuan pengukuran: <strong className="text-gray-700">{satuan}</strong>
          </p>
        </div>

        {/* Switch Chart Type */}
        <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
              chartType === 'area'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
              chartType === 'bar'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
              chartType === 'line'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Garis</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="nilai" 
                stroke="#059669" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#emeraldGrad)" 
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="nilai" 
                fill="#059669" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="nilai" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#047857' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Runtun Waktu Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-gray-100">
        {data.map(item => (
          <div key={item.tahun} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-center">
            <span className="text-[11px] font-semibold text-gray-500 block">Tahun {item.tahun}</span>
            <span className="text-sm sm:text-base font-extrabold text-gray-900 block mt-0.5">
              {formatNumber(item.nilai)}
            </span>
            <span className="text-[10px] text-gray-400 block truncate">{satuan}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
