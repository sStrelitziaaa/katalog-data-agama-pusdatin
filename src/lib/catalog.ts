import {
  IndicatorItem,
  BimasSummary,
  CatalogStats,
  AgamaType,
  BimasType,
} from '@/types/indicator';

/**
 * Helper katalog yang murni (tanpa I/O). Semua fungsi menerima daftar indikator
 * sebagai parameter, sehingga bisa dipakai di server maupun client dengan data
 * yang sama persis dari database.
 */

export const AGAMA_LIST: AgamaType[] = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Khonghucu',
  'Semua Agama',
  'Umum',
];

export const BIMAS_LIST: BimasType[] = [
  'Ditjen Bimas Islam',
  'Ditjen Bimas Kristen',
  'Ditjen Bimas Katolik',
  'Ditjen Bimas Hindu',
  'Ditjen Bimas Buddha',
  'Pusbimdik Khonghucu',
  'Setjen',
  'Sekretariat Jenderal / Pusdatin',
  'Pusat Kerukunan Umat Beragama (PKUB)',
];

export const CAKUPAN_WILAYAH_LIST: IndicatorItem['cakupanWilayah'][] = [
  'Nasional',
  'Provinsi',
  'Kab/Kota',
  'Nasional, Provinsi, Kab/Kota',
];

export const FREKUENSI_UPDATE_LIST: IndicatorItem['frekuensiUpdate'][] = [
  'Tahunan',
  'Semesteran',
  'Bulanan',
  'Real-time',
];

/** Tahun deret waktu yang dikelola CMS. */
export const TAHUN_DATA = ['2020', '2021', '2022', '2023', '2024'];

/** Agama default yang paling sesuai untuk tiap produsen data. */
export const DEFAULT_AGAMA_BY_BIMAS: Record<BimasType, AgamaType> = {
  'Ditjen Bimas Islam': 'Islam',
  'Ditjen Bimas Kristen': 'Kristen',
  'Ditjen Bimas Katolik': 'Katolik',
  'Ditjen Bimas Hindu': 'Hindu',
  'Ditjen Bimas Buddha': 'Buddha',
  'Pusbimdik Khonghucu': 'Khonghucu',
  'Setjen': 'Umum',
  'Sekretariat Jenderal / Pusdatin': 'Umum',
  'Pusat Kerukunan Umat Beragama (PKUB)': 'Semua Agama',
};

type BimasDefinition = Omit<BimasSummary, 'totalIndikator' | 'terisi' | 'persentase'>;

const BIMAS_DEFINITIONS: BimasDefinition[] = [
  {
    nama: 'Ditjen Bimas Islam',
    agama: 'Islam',
    shortName: 'Bimas Islam',
    color: 'emerald',
    iconName: 'Moon',
    deskripsi: 'Data rumah ibadah (masjid/musala), penyuluh, KUA & nikah, zakat, wakaf, dan ormas Islam.',
  },
  {
    nama: 'Ditjen Bimas Kristen',
    agama: 'Kristen',
    shortName: 'Bimas Kristen',
    color: 'sky',
    iconName: 'Cross',
    deskripsi: 'Data gereja/rumah ibadah, penyuluh, rohaniwan, bimbingan perkawinan, dan lembaga Kristen.',
  },
  {
    nama: 'Ditjen Bimas Katolik',
    agama: 'Katolik',
    shortName: 'Bimas Katolik',
    color: 'indigo',
    iconName: 'Church',
    deskripsi: 'Data gereja Katolik, penyuluh, rohaniwan, bimbingan keluarga, dan lembaga keagamaan Katolik.',
  },
  {
    nama: 'Ditjen Bimas Hindu',
    agama: 'Hindu',
    shortName: 'Bimas Hindu',
    color: 'amber',
    iconName: 'Flame',
    deskripsi: 'Data pura/rumah ibadah, penyuluh, rohaniwan, bimbingan perkawinan, dan lembaga Hindu.',
  },
  {
    nama: 'Ditjen Bimas Buddha',
    agama: 'Buddha',
    shortName: 'Bimas Buddha',
    color: 'orange',
    iconName: 'Sun',
    deskripsi: 'Data vihara/rumah ibadah, penyuluh, rohaniwan, bimbingan keluarga, dan lembaga Buddha.',
  },
  {
    nama: 'Pusbimdik Khonghucu',
    agama: 'Khonghucu',
    shortName: 'Pusbimdik Khonghucu',
    color: 'rose',
    iconName: 'BookOpen',
    deskripsi: 'Data kelenteng/litang, penyuluh, rohaniwan, bimbingan perkawinan, dan lembaga Khonghucu.',
  },
  {
    nama: 'Setjen',
    agama: 'Umum',
    shortName: 'Setjen',
    color: 'teal',
    iconName: 'ShieldCheck',
    deskripsi: 'Data kependudukan agama terpadu, tata kelola BMN, SDM Aparatur, dan keuangan APBN.',
  },
  {
    nama: 'Pusat Kerukunan Umat Beragama (PKUB)',
    agama: 'Semua Agama',
    shortName: 'Pusat Kerukunan Umat Beragama',
    color: 'purple',
    iconName: 'HeartHandshake',
    deskripsi: 'Data Forum Kerukunan Umat Beragama (FKUB), kantor sekretariat, dan Desa Sadar Kerukunan.',
  },
];

export function getCatalogStats(indicators: IndicatorItem[]): CatalogStats {
  const totalIndikator = indicators.length;
  const totalTerisi = indicators.filter(item => item.terisi).length;

  return {
    totalIndikator,
    totalTerisi,
    totalBelumTerisi: totalIndikator - totalTerisi,
    persentaseTerisi: totalIndikator > 0 ? Math.round((totalTerisi / totalIndikator) * 100) : 0,
    totalKategori: new Set(indicators.map(item => item.kategori)).size,
    totalBimas: new Set(indicators.map(item => item.bimas)).size,
  };
}

export function getBimasSummaries(indicators: IndicatorItem[]): BimasSummary[] {
  // Satu kali iterasi untuk mengelompokkan indikator per produsen data.
  const counts = new Map<string, { total: number; terisi: number }>();
  for (const item of indicators) {
    // "Sekretariat Jenderal / Pusdatin" digabung ke kartu "Setjen".
    const key = item.bimas === 'Sekretariat Jenderal / Pusdatin' ? 'Setjen' : item.bimas;
    const entry = counts.get(key) ?? { total: 0, terisi: 0 };
    entry.total += 1;
    if (item.terisi) entry.terisi += 1;
    counts.set(key, entry);
  }

  return BIMAS_DEFINITIONS.map(def => {
    const { total, terisi } = counts.get(def.nama) ?? { total: 0, terisi: 0 };
    return {
      ...def,
      totalIndikator: total,
      terisi,
      persentase: total > 0 ? Math.round((terisi / total) * 100) : 0,
    };
  });
}

export function getAllCategories(indicators: IndicatorItem[]): string[] {
  return Array.from(new Set(indicators.map(item => item.kategori))).sort();
}
