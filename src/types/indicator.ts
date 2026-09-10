export type AgamaType = 
  | 'Islam' 
  | 'Kristen' 
  | 'Katolik' 
  | 'Hindu' 
  | 'Buddha' 
  | 'Khonghucu' 
  | 'Semua Agama' 
  | 'Umum';

export type BimasType = 
  | 'Ditjen Bimas Islam'
  | 'Ditjen Bimas Kristen'
  | 'Ditjen Bimas Katolik'
  | 'Ditjen Bimas Hindu'
  | 'Ditjen Bimas Buddha'
  | 'Pusbimdik Khonghucu'
  | 'Setjen'
  | 'Sekretariat Jenderal / Pusdatin'
  | 'Pusat Kerukunan Umat Beragama (PKUB)';

export interface YearlyDataPoint {
  tahun: string;
  nilai: number;
  satuan: string;
  catatan?: string;
}

export interface IndicatorItem {
  id: string; // e.g. IND-001
  no: number;
  nama: string;
  kategori: string;
  agama: AgamaType;
  bimas: BimasType;
  pic: string;
  terisi: boolean;
  statusText: 'Terisi / Terintegrasi' | 'Dalam Proses';
  sumberData: string;
  cakupanWilayah: 'Nasional' | 'Provinsi' | 'Kab/Kota' | 'Nasional, Provinsi, Kab/Kota';
  satuan: string;
  deskripsi: string;
  frekuensiUpdate: 'Bulanan' | 'Semesteran' | 'Tahunan' | 'Real-time';
  terakhirDiperbarui: string;
  trenData: YearlyDataPoint[];
  tags: string[];
}

export interface BimasSummary {
  nama: BimasType;
  agama: AgamaType;
  shortName: string;
  totalIndikator: number;
  terisi: number;
  persentase: number;
  color: string;
  iconName: string;
  deskripsi: string;
}

export interface CatalogStats {
  totalIndikator: number;
  totalTerisi: number;
  totalBelumTerisi: number;
  persentaseTerisi: number;
  totalKategori: number;
  totalBimas: number;
}
