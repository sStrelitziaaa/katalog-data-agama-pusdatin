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
        <div className="bg-[#132E40] text-white p-3.5 rounded-xl shadow-xl border border-[#286084] text-xs">
          <p className="font-semibold text-[#D3E4F1] mb-1">Tahun {label}</p>
          <div className="flex items-center space-x-1.5 font-bold text-base text-white">
            <span>{formatNumber(point.nilai)}</span>
            <span className="text-xs text-[#B5D3E8] font-normal">{satuan}</span>
          </div>
          {point.catatan && (
            <p className="text-[11px] text-[#B5D3E8]/80 mt-1.5 border-t border-[#1D4661] pt-1.5">
              {point.catatan}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D3E4F1] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#286084]" />
            <h3 className="font-bold text-[#181E24] text-sm sm:text-base">
              Grafik Tren Runtun Waktu (2020 - 2024)
            </h3>
          </div>
          <p className="text-xs text-[#55606D] mt-0.5">
            Satuan pengukuran: <strong className="text-[#181E24]">{satuan}</strong>
          </p>
        </div>

        {/* Switch Chart Type */}
        <div className="inline-flex p-1 bg-[#E7F1F8] border border-[#D3E4F1] rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'area'
                ? 'bg-white text-[#286084] font-bold shadow-2xs'
                : 'text-[#55606D] hover:text-[#181E24]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'bar'
                ? 'bg-white text-[#286084] font-bold shadow-2xs'
                : 'text-[#55606D] hover:text-[#181E24]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'line'
                ? 'bg-white text-[#286084] font-bold shadow-2xs'
                : 'text-[#55606D] hover:text-[#181E24]'
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
                <linearGradient id="iceMeltGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5F9ECB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D3E4F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F1F8" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#55606D', fontSize: 12 }} 
                axisLine={{ stroke: '#D3E4F1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#55606D', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="nilai" 
                stroke="#286084" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#iceMeltGrad)" 
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F1F8" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#55606D', fontSize: 12 }} 
                axisLine={{ stroke: '#D3E4F1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#55606D', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="nilai" 
                fill="#3D7FA9" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F1F8" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#55606D', fontSize: 12 }} 
                axisLine={{ stroke: '#D3E4F1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#55606D', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="nilai" 
                stroke="#286084" 
                strokeWidth={3}
                dot={{ fill: '#286084', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#1D4661' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Runtun Waktu Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-[#D3E4F1]">
        {data.map(item => (
          <div key={item.tahun} className="p-3 bg-[#F5F9FD] rounded-xl border border-[#D3E4F1] text-center">
            <span className="text-[11px] font-semibold text-[#7E8B99] block">Tahun {item.tahun}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#181E24] block mt-0.5">
              {formatNumber(item.nilai)}
            </span>
            <span className="text-[10px] text-[#7E8B99] block truncate">{satuan}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
