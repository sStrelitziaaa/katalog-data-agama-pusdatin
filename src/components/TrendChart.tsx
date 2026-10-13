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
        <div className="bg-[#2E231F] text-white p-3.5 rounded-xl shadow-xl border border-[#744D3D] text-xs">
          <p className="font-semibold text-[#E5D5CD] mb-1">Tahun {label}</p>
          <div className="flex items-center space-x-1.5 font-bold text-base text-white">
            <span>{formatNumber(point.nilai)}</span>
            <span className="text-xs text-[#D2B8AB] font-normal">{satuan}</span>
          </div>
          {point.catatan && (
            <p className="text-[11px] text-[#D2B8AB]/80 mt-1.5 border-t border-[#5C3C2F] pt-1.5">
              {point.catatan}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5E0] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#A47864]" />
            <h3 className="font-bold text-[#2E231F] text-sm sm:text-base">
              Grafik Tren Runtun Waktu (2020 - 2024)
            </h3>
          </div>
          <p className="text-xs text-[#68605A] mt-0.5">
            Satuan pengukuran: <strong className="text-[#2E231F]">{satuan}</strong>
          </p>
        </div>

        {/* Switch Chart Type */}
        <div className="inline-flex p-1 bg-[#FAF7F5] border border-[#EBE5E0] rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'area'
                ? 'bg-white text-[#A47864] font-bold shadow-xs'
                : 'text-[#68605A] hover:text-[#2E231F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'bar'
                ? 'bg-white text-[#A47864] font-bold shadow-xs'
                : 'text-[#68605A] hover:text-[#2E231F]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
              chartType === 'line'
                ? 'bg-white text-[#A47864] font-bold shadow-xs'
                : 'text-[#68605A] hover:text-[#2E231F]'
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
                <linearGradient id="mochaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A47864" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#A47864" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4ECE7" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#68605A', fontSize: 12 }} 
                axisLine={{ stroke: '#EBE5E0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#68605A', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="nilai" 
                stroke="#A47864" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#mochaGrad)" 
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4ECE7" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#68605A', fontSize: 12 }} 
                axisLine={{ stroke: '#EBE5E0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#68605A', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="nilai" 
                fill="#A47864" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4ECE7" vertical={false} />
              <XAxis 
                dataKey="tahun" 
                tick={{ fill: '#68605A', fontSize: 12 }} 
                axisLine={{ stroke: '#EBE5E0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#68605A', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatNumber(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="nilai" 
                stroke="#A47864" 
                strokeWidth={3}
                dot={{ fill: '#A47864', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#744D3D' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Runtun Waktu Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-[#EBE5E0]">
        {data.map(item => (
          <div key={item.tahun} className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EBE5E0] text-center">
            <span className="text-[11px] font-semibold text-[#8C8077] block">Tahun {item.tahun}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#2E231F] block mt-0.5">
              {formatNumber(item.nilai)}
            </span>
            <span className="text-[10px] text-[#8C8077] block truncate">{satuan}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
