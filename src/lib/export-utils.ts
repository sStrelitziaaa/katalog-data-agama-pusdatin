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
