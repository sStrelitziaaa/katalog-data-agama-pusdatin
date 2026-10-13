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
        <div className="bg-[#151523] text-white p-3.5 rounded-xl shadow-xl border border-[#44418b] text-xs">
          <p className="font-semibold text-[#c7c1f7] mb-1">Tahun {label}</p>
          <div className="flex items-center space-x-1.5 font-bold text-base text-white">
            <span>{formatNumber(point.nilai)}</span>
            <span className="text-xs text-[#a89ff2] font-normal">{satuan}</span>
          </div>
          {point.catatan && (
            <p className="text-[11px] text-gray-400 mt-1.5 border-t border-gray-700 pt-1.5">
              {point.catatan}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e9eaee] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#6253e8]" />
            <h3 className="font-bold text-[#151523] text-sm sm:text-base">
              Grafik Tren Runtun Waktu (2020 - 2024)
            </h3>
          </div>
          <p className="text-xs text-[#686868] mt-0.5">
            Satuan pengukuran: <strong className="text-[#151523]">{satuan}</strong>
          </p>
        </div>

        {/* Switch Chart Type */}
        <div className="inline-flex p-1 bg-[#f0f0f4] rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'area'
                ? 'bg-white text-[#6253e8] font-bold shadow-xs'
                : 'text-[#686868] hover:text-[#151523]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'bar'
                ? 'bg-white text-[#6253e8] font-bold shadow-xs'
                : 'text-[#686868] hover:text-[#151523]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'line'
                ? 'bg-white text-[#6253e8] font-bold shadow-xs'
                : 'text-[#686868] hover:text-[#151523]'
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
                <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6253e8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6253e8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f4" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#686868', fontSize: 12 }} 
                axisLine={{ stroke: '#e9eaee' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#686868', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="nilai" 
                stroke="#6253e8" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#violetGrad)" 
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f4" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#686868', fontSize: 12 }} 
                axisLine={{ stroke: '#e9eaee' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#686868', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="nilai" 
                fill="#6253e8" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f4" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#686868', fontSize: 12 }} 
                axisLine={{ stroke: '#e9eaee' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#686868', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="nilai" 
                stroke="#6253e8" 
                strokeWidth={3}
                dot={{ fill: '#6253e8', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#44418b' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Runtun Waktu Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-[#f0f0f4]">
        {data.map(item => (
          <div key={item.tahun} className="p-3 bg-[#f9f9fc] rounded-xl border border-[#e9eaee] text-center">
            <span className="text-[11px] font-semibold text-[#848484] block">Tahun {item.tahun}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#151523] block mt-0.5">
              {formatNumber(item.nilai)}
            </span>
            <span className="text-[10px] text-[#848484] block truncate">{satuan}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
