import { IndicatorItem, BimasSummary, CatalogStats, AgamaType, BimasType } from '@/types/indicator';
import rawData from '@/data/data-agama.json';

const indicators: IndicatorItem[] = rawData as IndicatorItem[];

export function getAllIndicators(): IndicatorItem[] {
  return indicators;
}

export function getIndicatorById(id: string): IndicatorItem | undefined {
  return indicators.find(item => item.id.toLowerCase() === id.toLowerCase());
}

export function getCatalogStats(): CatalogStats {
  const totalIndikator = indicators.length;
  const totalTerisi = indicators.filter(item => item.terisi).length;
  const totalBelumTerisi = totalIndikator - totalTerisi;
  const persentaseTerisi = totalIndikator > 0 ? Math.round((totalTerisi / totalIndikator) * 100) : 0;
  const kategoriSet = new Set(indicators.map(item => item.kategori));
  const bimasSet = new Set(indicators.map(item => item.bimas));

  return {
    totalIndikator,
    totalTerisi,
    totalBelumTerisi,
    persentaseTerisi,
    totalKategori: kategoriSet.size,
    totalBimas: bimasSet.size,
  };
}

export function getBimasSummaries(): BimasSummary[] {
  const bimasDefinitions: {
    nama: BimasType;
    agama: AgamaType;
    shortName: string;
    color: string;
    iconName: string;
    deskripsi: string;
  }[] = [
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
      shortName: 'PKUB',
      color: 'purple',
      iconName: 'HeartHandshake',
      deskripsi: 'Data Forum Kerukunan Umat Beragama (FKUB), kantor sekretariat, dan Desa Sadar Kerukunan.',
    },
  ];

  return bimasDefinitions.map(def => {
    const matched = indicators.filter(item => 
      item.bimas === def.nama || 
      (def.nama === 'Setjen' && (item.bimas === 'Setjen' || item.bimas === 'Sekretariat Jenderal / Pusdatin'))
    );
    const terisi = matched.filter(item => item.terisi).length;
    const persentase = matched.length > 0 ? Math.round((terisi / matched.length) * 100) : 0;

    return {
      ...def,
      totalIndikator: matched.length,
      terisi,
      persentase,
    };
  });
}

export function getAllCategories(): string[] {
  const categories = Array.from(new Set(indicators.map(item => item.kategori)));
  return categories.sort();
}

export function getAllAgama(): AgamaType[] {
  return ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Semua Agama', 'Umum'];
}

export function getAllPIC(): string[] {
  const pics = Array.from(new Set(indicators.map(item => item.pic)));
  return pics.sort();
}
