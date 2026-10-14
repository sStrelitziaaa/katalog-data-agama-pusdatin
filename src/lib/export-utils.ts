import { utils, writeFile } from 'xlsx';
import { IndicatorItem } from '@/types/indicator';

export function exportToCSV(data: IndicatorItem[], filename = 'indikator-data-agama.csv') {
  const headers = [
    'No',
    'Kode Indikator',
    'Nama Indikator',
    'Kategori',
    'Agama',
    'Ditjen / Bimas',
    'Status Integrasi',
    'PIC Pusdatin',
    'Sumber Data',
    'Satuan',
    'Cakupan Wilayah',
    'Frekuensi Update',
    'Terakhir Diperbarui'
  ];

  const rows = data.map((item, index) => [
    index + 1,
    `"${item.id}"`,
    `"${item.nama.replace(/"/g, '""')}"`,
    `"${item.kategori.replace(/"/g, '""')}"`,
    `"${item.agama}"`,
    `"${item.bimas}"`,
    `"${item.statusText}"`,
    `"${item.pic}"`,
    `"${item.sumberData.replace(/"/g, '""')}"`,
    `"${item.satuan}"`,
    `"${item.cakupanWilayah}"`,
    `"${item.frekuensiUpdate}"`,
    `"${item.terakhirDiperbarui}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: IndicatorItem[], filename = 'indikator-data-agama.xlsx') {
  const exportData = data.map((item, index) => ({
    'No': index + 1,
    'Kode Indikator': item.id,
    'Nama Indikator': item.nama,
    'Kategori': item.kategori,
    'Agama': item.agama,
    'Ditjen / Bimas': item.bimas,
    'Status Integrasi': item.statusText,
    'PIC Pusdatin': item.pic,
    'Sumber Data': item.sumberData,
    'Satuan': item.satuan,
    'Cakupan Wilayah': item.cakupanWilayah,
    'Frekuensi Update': item.frekuensiUpdate,
    'Terakhir Diperbarui': item.terakhirDiperbarui,
  }));

  const worksheet = utils.json_to_sheet(exportData);
  
  // Set column widths for clean presentation
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 14 }, // Kode
    { wch: 38 }, // Nama
    { wch: 22 }, // Kategori
    { wch: 14 }, // Agama
    { wch: 28 }, // Bimas
    { wch: 22 }, // Status
    { wch: 14 }, // PIC
    { wch: 28 }, // Sumber Data
    { wch: 14 }, // Satuan
    { wch: 24 }, // Wilayah
    { wch: 16 }, // Frekuensi
    { wch: 18 }, // Tanggal
  ];

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Katalog Data Agama');
  writeFile(workbook, filename);
}

export function exportSingleIndicatorToExcel(item: IndicatorItem, filename?: string) {
  const actualFilename = filename || `${item.id}-${item.nama.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.xlsx`;

  // 1. Data Ringkasan Indikator
  const metadataRows = [
    { 'Informasi Indikator': 'Kode Indikator', 'Keterangan': item.id },
    { 'Informasi Indikator': 'Nama Indikator', 'Keterangan': item.nama },
    { 'Informasi Indikator': 'Kategori', 'Keterangan': item.kategori },
    { 'Informasi Indikator': 'Agama', 'Keterangan': item.agama },
    { 'Informasi Indikator': 'Ditjen / Bimas / Produsen', 'Keterangan': item.bimas },
    { 'Informasi Indikator': 'Satuan', 'Keterangan': item.satuan },
    { 'Informasi Indikator': 'Cakupan Wilayah', 'Keterangan': item.cakupanWilayah },
    { 'Informasi Indikator': 'Frekuensi Pembaruan', 'Keterangan': item.frekuensiUpdate },
    { 'Informasi Indikator': 'Sumber Data Resmi', 'Keterangan': item.sumberData },
    { 'Informasi Indikator': 'Status Keterisian Data', 'Keterangan': item.statusText },
    { 'Informasi Indikator': 'Terakhir Diperbarui', 'Keterangan': item.terakhirDiperbarui },
  ];

  // 2. Data Tren Historis
  const trenRows = (item.trenData || []).map(p => ({
    'Tahun': p.tahun,
    'Nilai': p.nilai,
    'Satuan': p.satuan || item.satuan,
    'Status': item.statusText,
    'Catatan': p.catatan || '-'
  }));

  const wb = utils.book_new();
  
  const wsMetadata = utils.json_to_sheet(metadataRows);
  wsMetadata['!cols'] = [{ wch: 28 }, { wch: 55 }];
  utils.book_append_sheet(wb, wsMetadata, 'Informasi Indikator');

  const wsTren = utils.json_to_sheet(trenRows);
  wsTren['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 20 }];
  utils.book_append_sheet(wb, wsTren, 'Data Nilai Historis');

  writeFile(wb, actualFilename);
}

