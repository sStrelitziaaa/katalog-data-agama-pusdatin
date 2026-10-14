import { read, utils } from 'xlsx';
import { IndicatorItem, YearlyDataPoint } from '@/types/indicator';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedItems: IndicatorItem[];
  summary: {
    totalRows: number;
    validRows: number;
    corruptedRows: number;
  };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validasi mendalam struktur berkas Excel dan isi baris data sebelum masuk ke Database.
 * Menghindari kesalahan template, format kolom tertukar, atau data korup.
 */
export function validateAndParseExcel(
  buffer: ArrayBuffer | Buffer,
  filename: string,
  existingIndicators: IndicatorItem[] = []
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsedItems: IndicatorItem[] = [];

  // 1. Validasi Keamanan: Ekstensi Berkas
  const lowerName = filename.toLowerCase();
  if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
    return {
      isValid: false,
      errors: ['Format berkas tidak didukung. Harap unggah file Microsoft Excel dengan ekstensi .xlsx atau .xls.'],
      warnings: [],
      parsedItems: [],
      summary: { totalRows: 0, validRows: 0, corruptedRows: 0 }
    };
  }

  // 2. Validasi Keamanan: Ukuran Berkas
  const byteLength = buffer instanceof Buffer ? buffer.length : buffer.byteLength;
  if (byteLength > MAX_FILE_SIZE) {
    return {
      isValid: false,
      errors: [`Ukuran file terlalu besar (${(byteLength / 1024 / 1024).toFixed(2)} MB). Batas maksimum adalah 10 MB.`],
      warnings: [],
      parsedItems: [],
      summary: { totalRows: 0, validRows: 0, corruptedRows: 0 }
    };
  }

  // 3. Baca Workbook Excel
  let workbook;
  try {
    workbook = read(buffer, { type: 'buffer' });
  } catch (err: any) {
    return {
      isValid: false,
      errors: ['Gagal membaca berkas Excel. Berkas mungkin korup atau terproteksi kata sandi.'],
      warnings: [],
      parsedItems: [],
      summary: { totalRows: 0, validRows: 0, corruptedRows: 0 }
    };
  }

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return {
      isValid: false,
      errors: ['Berkas Excel tidak memiliki lembar kerja (worksheet).'],
      warnings: [],
      parsedItems: [],
      summary: { totalRows: 0, validRows: 0, corruptedRows: 0 }
    };
  }

  // Gunakan sheet pertama atau sheet bernama 'Data Indikator'
  const sheetName = workbook.SheetNames.includes('Data Indikator') ? 'Data Indikator' : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    return {
      isValid: false,
      errors: ['Lembar kerja Excel kosong. Tidak ditemukan baris data untuk diimpor.'],
      warnings: [],
      parsedItems: [],
      summary: { totalRows: 0, validRows: 0, corruptedRows: 0 }
    };
  }

  // 4. Validasi Struktur Header / Kolom
  const firstRow = rawRows[0];
  const keys = Object.keys(firstRow).map(k => k.trim());

  // Cek apakah kolom penting ada
  const hasIdCol = keys.some(k => /kode|id/i.test(k));
  const hasNamaCol = keys.some(k => /nama/i.test(k));
  const hasYearCol = keys.some(k => /2020|2021|2022|2023|2024/i.test(k));

  if (!hasIdCol && !hasNamaCol) {
    errors.push('Struktur header Excel tidak sesuai template resmi Pusdatin. Kolom "Kode Indikator" atau "Nama Indikator" tidak ditemukan.');
  }

  if (!hasYearCol) {
    warnings.push('Tidak ditemukan kolom tahunan (2020–2024). Data yang diimpor mungkin tidak memiliki angka capaian deret waktu.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
      parsedItems: [],
      summary: { totalRows: rawRows.length, validRows: 0, corruptedRows: rawRows.length }
    };
  }

  // Peta existing indicators untuk lookup
  const existingMap = new Map<string, IndicatorItem>();
  existingIndicators.forEach(item => existingMap.set(item.id.toLowerCase(), item));

  let validCount = 0;
  let corruptedCount = 0;

  // 5. Validasi Baris Demi Baris
  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // Baris Excel (1-indexed + header)

    // Ekstrak Nilai Kolom dengan toleransi nama header
    const rawId = findVal(row, ['Kode Indikator', 'Kode', 'ID', 'Id Indikator']);
    const rawNama = findVal(row, ['Nama Indikator', 'Nama', 'Indikator']);
    const rawKategori = findVal(row, ['Kategori', 'Rumpun Kategori']);
    const rawAgama = findVal(row, ['Agama']);
    const rawBimas = findVal(row, ['Ditjen / Bimas', 'Bimas', 'Produsen Data', 'Unit']);
    const rawSatuan = findVal(row, ['Satuan', 'Satuan Ukuran']);
    const rawPic = findVal(row, ['PIC Pusdatin', 'PIC', 'Penanggung Jawab']);
    const rawSumber = findVal(row, ['Sumber Data', 'Sumber']);

    // Validasi baris kosong
    if (!rawId && !rawNama) {
      return; // Lewati baris kosong di akhir sheet
    }

    // Validasi Kode Indikator
    const id = String(rawId || '').trim();
    if (!id) {
      errors.push(`Baris ${rowNum}: Kolom "Kode Indikator" kosong.`);
      corruptedCount++;
      return;
    }

    const existingMatch = existingMap.get(id.toLowerCase());

    const nama = String(rawNama || existingMatch?.nama || '').trim();
    if (!nama) {
      errors.push(`Baris ${rowNum} (${id}): Nama indikator tidak boleh kosong.`);
      corruptedCount++;
      return;
    }

    // Parsing & Validasi Angka Tahunan (2020 s.d. 2024)
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const trenData: YearlyDataPoint[] = [];

    years.forEach(yr => {
      const valRaw = row[yr] ?? row[`Tahun ${yr}`] ?? row[`Nilai ${yr}`];
      let numVal = 0;

      if (valRaw !== undefined && valRaw !== '' && valRaw !== null) {
        const cleanedStr = String(valRaw).replace(/\./g, '').replace(/,/g, '.').trim();
        const parsed = Number(cleanedStr);

        if (isNaN(parsed)) {
          warnings.push(`Baris ${rowNum} (${id}): Nilai tahun ${yr} bernilai '${valRaw}' (bukan angka), disetel menjadi 0.`);
          numVal = 0;
        } else if (parsed < 0) {
          warnings.push(`Baris ${rowNum} (${id}): Nilai tahun ${yr} bernilai negatif (${parsed}).`);
          numVal = parsed;
        } else {
          numVal = parsed;
        }
      } else if (existingMatch) {
        const existingPoint = existingMatch.trenData?.find(p => p.tahun === yr);
        numVal = existingPoint ? existingPoint.nilai : 0;
      }

      trenData.push({
        tahun: yr,
        nilai: numVal,
        satuan: String(rawSatuan || existingMatch?.satuan || 'Unit'),
      });
    });

    const hasValues = trenData.some(p => p.nilai > 0);

    const indicatorItem: IndicatorItem = {
      id,
      no: existingMatch ? existingMatch.no : rawRows.length + 1,
      nama,
      kategori: String(rawKategori || existingMatch?.kategori || 'Lainnya'),
      agama: (rawAgama || existingMatch?.agama || 'Umum') as any,
      bimas: (rawBimas || existingMatch?.bimas || 'Pusdatin') as any,
      satuan: String(rawSatuan || existingMatch?.satuan || 'Unit'),
      cakupanWilayah: (existingMatch?.cakupanWilayah || 'Nasional') as any,
      frekuensiUpdate: (existingMatch?.frekuensiUpdate || 'Tahunan') as any,
      sumberData: String(rawSumber || existingMatch?.sumberData || 'Pusdatin Kemenag RI'),
      deskripsi: String(existingMatch?.deskripsi || `Indikator data ${nama}`),
      pic: String(rawPic || existingMatch?.pic || 'Pusdatin'),
      terisi: hasValues,
      statusText: (hasValues ? 'Terisi / Terintegrasi' : 'Dalam Proses') as any,
      terakhirDiperbarui: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      trenData,
      tags: existingMatch?.tags || [nama, String(rawKategori || 'Data Agama')],
    };

    parsedItems.push(indicatorItem);
    validCount++;
  });

  return {
    isValid: errors.length === 0 && parsedItems.length > 0,
    errors,
    warnings,
    parsedItems,
    summary: {
      totalRows: rawRows.length,
      validRows: validCount,
      corruptedRows: corruptedCount,
    }
  };
}

function findVal(row: any, candidates: string[]): any {
  for (const c of candidates) {
    if (row[c] !== undefined && row[c] !== '') return row[c];
    // case-insensitive check
    const matchedKey = Object.keys(row).find(k => k.trim().toLowerCase() === c.toLowerCase());
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') return row[matchedKey];
  }
  return '';
}
