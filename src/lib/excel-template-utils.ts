import { utils, writeFile, read } from 'xlsx';
import { IndicatorItem, AgamaType, BimasType, YearlyDataPoint } from '@/types/indicator';

/**
 * 1. Download Template Khusus untuk 1 Nama Indikator Spesifik
 * Sudah terisi metadata nama data, kode, satuan, dan tabel tahun 2020-2024
 */
export function downloadIndicatorTemplate(indicator: IndicatorItem) {
  // Baris metadata & data runtun waktu
  const rows = [
    { 'Parameter': 'Kode Indikator', 'Nilai / Keterangan': indicator.id },
    { 'Parameter': 'Nama Indikator', 'Nilai / Keterangan': indicator.nama },
    { 'Parameter': 'Rumpun Kategori', 'Nilai / Keterangan': indicator.kategori },
    { 'Parameter': 'Agama', 'Nilai / Keterangan': indicator.agama },
    { 'Parameter': 'Ditjen / Bimas', 'Nilai / Keterangan': indicator.bimas },
    { 'Parameter': 'Satuan Pengukuran', 'Nilai / Keterangan': indicator.satuan },
    { 'Parameter': 'PIC Tim Pusdatin', 'Nilai / Keterangan': indicator.pic },
    { 'Parameter': 'Sistem Produsen Data', 'Nilai / Keterangan': indicator.sumberData },
    { 'Parameter': 'Status Integrasi', 'Nilai / Keterangan': indicator.statusText },
    { 'Parameter': '-------------------', 'Nilai / Keterangan': '-------------------' },
  ];

  const wsMeta = utils.json_to_sheet(rows);
  wsMeta['!cols'] = [{ wch: 24 }, { wch: 50 }];

  // Sheet 2: Tabel Angka Runtun Waktu yang siap diedit
  const timeSeriesData = (indicator.trenData && indicator.trenData.length > 0)
    ? indicator.trenData.map(t => ({
        'Kode': indicator.id,
        'Tahun': t.tahun,
        'Nilai Terukur': t.nilai,
        'Satuan': indicator.satuan,
        'Status Verifikasi': indicator.terisi ? 'Terverifikasi' : 'Tahap Verifikasi',
        'Catatan / Sumber': t.catatan || indicator.sumberData,
      }))
    : [
        { 'Kode': indicator.id, 'Tahun': '2020', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
        { 'Kode': indicator.id, 'Tahun': '2021', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
        { 'Kode': indicator.id, 'Tahun': '2022', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
        { 'Kode': indicator.id, 'Tahun': '2023', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
        { 'Kode': indicator.id, 'Tahun': '2024', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
        { 'Kode': indicator.id, 'Tahun': '2025', 'Nilai Terukur': 0, 'Satuan': indicator.satuan, 'Status Verifikasi': 'Terverifikasi', 'Catatan / Sumber': '' },
      ];

  const wsData = utils.json_to_sheet(timeSeriesData);
  wsData['!cols'] = [
    { wch: 14 },
    { wch: 10 },
    { wch: 18 },
    { wch: 16 },
    { wch: 20 },
    { wch: 35 },
  ];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, wsData, 'Runtun Waktu Data');
  utils.book_append_sheet(wb, wsMeta, 'Metadata Indikator');

  const cleanName = indicator.nama.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 35);
  const filename = `Template_${indicator.id}_${cleanName}.xlsx`;
  writeFile(wb, filename);
}

/**
 * 2. Download Template Khusus untuk Seluruh Indikator dalam 1 Kategori Tertentu
 */
export function downloadCategoryTemplate(categoryName: string, categoryIndicators: IndicatorItem[]) {
  const exportRows = categoryIndicators.map((item, idx) => {
    const val2020 = item.trenData?.find(t => t.tahun === '2020')?.nilai ?? '';
    const val2021 = item.trenData?.find(t => t.tahun === '2021')?.nilai ?? '';
    const val2022 = item.trenData?.find(t => t.tahun === '2022')?.nilai ?? '';
    const val2023 = item.trenData?.find(t => t.tahun === '2023')?.nilai ?? '';
    const val2024 = item.trenData?.find(t => t.tahun === '2024')?.nilai ?? '';
    const val2025 = item.trenData?.find(t => t.tahun === '2025')?.nilai ?? '';

    return {
      'No': idx + 1,
      'Kode Indikator': item.id,
      'Nama Indikator': item.nama,
      'Rumpun Kategori': item.kategori,
      'Agama': item.agama,
      'Ditjen / Bimas': item.bimas,
      'Status Integrasi': item.statusText,
      'Satuan Ukuran': item.satuan,
      'Nilai 2020': val2020,
      'Nilai 2021': val2021,
      'Nilai 2022': val2022,
      'Nilai 2023': val2023,
      'Nilai 2024': val2024,
      'Nilai 2025': val2025,
      'PIC Tim Pusdatin': item.pic,
      'Sumber Data': item.sumberData,
      'Cakupan Wilayah': item.cakupanWilayah,
    };
  });

  const ws = utils.json_to_sheet(exportRows);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 14 },
    { wch: 38 },
    { wch: 22 },
    { wch: 14 },
    { wch: 26 },
    { wch: 20 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
  ];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, `Kategori ${categoryName.slice(0, 20)}`);

  const cleanName = categoryName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const filename = `Template_Kategori_${cleanName}.xlsx`;
  writeFile(wb, filename);
}

/**
 * 3. Parser Excel untuk Pembaruan 1 Indikator Tertentu
 */
export async function parseSingleIndicatorExcel(
  file: File,
  targetIndicator: IndicatorItem
): Promise<{
  success: boolean;
  updatedIndicator?: IndicatorItem;
  errors: string[];
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          resolve({ success: false, errors: ['Gagal membaca berkas Excel.'] });
          return;
        }

        const wb = read(buffer, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];

        if (!ws) {
          resolve({ success: false, errors: ['Sheet kosong atau tidak ditemukan.'] });
          return;
        }

        const rawRows: Record<string, any>[] = utils.sheet_to_json(ws);
        if (!rawRows || rawRows.length === 0) {
          resolve({ success: false, errors: ['Tabel Excel tidak memuat data.'] });
          return;
        }

        // Cek struktur: apakah berbentuk baris per tahun (Tahun | Nilai) atau kolom (Nilai 2020 | Nilai 2021)
        const newTrenData: YearlyDataPoint[] = [];

        // Bentuk A: Baris per tahun
        const hasTahunCol = Object.keys(rawRows[0] || {}).some(k => k.toLowerCase().includes('tahun'));

        if (hasTahunCol) {
          rawRows.forEach((row) => {
            let yr = '';
            let val = 0;
            let note = '';

            for (const [k, v] of Object.entries(row)) {
              const kl = k.toLowerCase();
              if (kl.includes('tahun')) yr = String(v).trim();
              else if (kl.includes('nilai')) val = parseFloat(String(v).replace(/[^0-9.-]+/g, '')) || 0;
              else if (kl.includes('catatan') || kl.includes('sumber')) note = String(v || '').trim();
            }

            if (yr && yr.length === 4) {
              newTrenData.push({
                tahun: yr,
                nilai: Math.round(val),
                satuan: targetIndicator.satuan,
                catatan: note || targetIndicator.sumberData,
              });
            }
          });
        }

        // Bentuk B: Kolom Nilai 2020 s/d 2025
        if (newTrenData.length === 0) {
          const firstRow = rawRows[0];
          ['2020', '2021', '2022', '2023', '2024', '2025'].forEach(yr => {
            let val = 0;
            for (const [k, v] of Object.entries(firstRow)) {
              if (k.includes(yr)) {
                val = parseFloat(String(v).replace(/[^0-9.-]+/g, '')) || 0;
                break;
              }
            }
            newTrenData.push({
              tahun: yr,
              nilai: Math.round(val),
              satuan: targetIndicator.satuan,
              catatan: targetIndicator.sumberData,
            });
          });
        }

        // Urutkan tahun
        newTrenData.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));

        const updatedIndicator: IndicatorItem = {
          ...targetIndicator,
          terisi: true,
          statusText: 'Terisi / Terintegrasi',
          terakhirDiperbarui: new Date().toISOString().slice(0, 10),
          trenData: newTrenData.length > 0 ? newTrenData : targetIndicator.trenData,
        };

        resolve({
          success: true,
          updatedIndicator,
          errors: [],
        });
      } catch (err: any) {
        resolve({
          success: false,
          errors: [`Error memproses file: ${err?.message || 'Format tidak dikenali'}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, errors: ['Gagal membaca file dari sistem.'] });
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 4. Download Template Excel Universal (Semua Data / Masal)
 */
export function downloadExcelTemplate(filename = 'Template-Klasifikasi-Data-Agama-Pusdatin.xlsx') {
  const sampleData = [
    {
      'No': 1,
      'Kode Indikator': 'IND-083',
      'Nama Indikator': 'Jumlah Lembaga Pendidikan Al-Qur\'an (LPQ)',
      'Rumpun Kategori': 'Pendidikan Keagamaan',
      'Agama': 'Islam',
      'Ditjen / Bimas': 'Ditjen Bimas Islam',
      'Status Integrasi': 'Terisi',
      'PIC Tim Pusdatin': 'Ghozy',
      'Sumber Data': 'EMIS (Education Management Information System)',
      'Satuan Ukuran': 'Lembaga / Unit',
      'Cakupan Wilayah': 'Nasional, Provinsi, Kab/Kota',
      'Frekuensi Update': 'Tahunan',
      'Nilai 2020': 125400,
      'Nilai 2021': 134200,
      'Nilai 2022': 142800,
      'Nilai 2023': 151500,
      'Nilai 2024': 160300,
      'Nilai 2025': 169000,
      'Deskripsi Indikator': 'Data agregat lembaga LPQ resmi terdaftar di EMIS Kementerian Agama RI.'
    },
    {
      'No': 2,
      'Kode Indikator': 'IND-084',
      'Nama Indikator': 'Sekolah Minggu Buddha (SMB)',
      'Rumpun Kategori': 'Pendidikan Keagamaan',
      'Agama': 'Buddha',
      'Ditjen / Bimas': 'Ditjen Bimas Buddha',
      'Status Integrasi': 'Dalam Proses',
      'PIC Tim Pusdatin': 'Rosyid',
      'Sumber Data': 'Sistem Informasi Ditjen Bimas Buddha',
      'Satuan Ukuran': 'Lembaga / Unit',
      'Cakupan Wilayah': 'Nasional, Provinsi, Kab/Kota',
      'Frekuensi Update': 'Tahunan',
      'Nilai 2020': 850,
      'Nilai 2021': 920,
      'Nilai 2022': 980,
      'Nilai 2023': 1050,
      'Nilai 2024': 1120,
      'Nilai 2025': 1190,
      'Deskripsi Indikator': 'Data persebaran Sekolah Minggu Buddha di seluruh provinsi di Indonesia.'
    }
  ];

  const wsData = utils.json_to_sheet(sampleData);
  wsData['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 42 },
    { wch: 26 },
    { wch: 14 },
    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 32 },
    { wch: 18 },
    { wch: 26 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 48 },
  ];

  const guideData = [
    {
      'Nama Kolom': 'Kode Indikator',
      'Kewajiban': 'Opsional',
      'Contoh Nilai': 'IND-085',
      'Keterangan': 'Boleh dikosongkan. Jika kosong, sistem otomatis membuat kode urut lanjutan.'
    },
    {
      'Nama Kolom': 'Nama Indikator',
      'Kewajiban': 'Wajib',
      'Contoh Nilai': 'Jumlah Majelis Taklim',
      'Keterangan': 'Nama indikator data resmi yang ingin dimasukkan.'
    },
    {
      'Nama Kolom': 'Rumpun Kategori',
      'Kewajiban': 'Wajib',
      'Contoh Nilai': 'Rumah Ibadah, Penyuluh Agama, Zakat & Pemberdayaan, Wakaf, Pendidikan Keagamaan, Ormas, dll.',
      'Keterangan': 'Pengelompokan tematik layanan keagamaan.'
    },
    {
      'Nama Kolom': 'Agama',
      'Kewajiban': 'Wajib',
      'Contoh Nilai': 'Islam / Kristen / Katolik / Hindu / Buddha / Khonghucu / Semua Agama / Umum',
      'Keterangan': 'Pilih salah satu dari 8 opsi agama/kategori umum yang diakui.'
    },
    {
      'Nama Kolom': 'Ditjen / Bimas',
      'Kewajiban': 'Wajib',
      'Contoh Nilai': 'Ditjen Bimas Islam, Ditjen Bimas Kristen, Ditjen Bimas Katolik, Ditjen Bimas Hindu, Ditjen Bimas Buddha, Pusbimdik Khonghucu, Sekretariat Jenderal / Pusdatin, PKUB',
      'Keterangan': 'Unit Eselon I / Satker pembina data terkait.'
    },
    {
      'Nama Kolom': 'Status Integrasi',
      'Kewajiban': 'Wajib',
      'Contoh Nilai': 'Terisi atau Dalam Proses',
      'Keterangan': 'Pilih "Terisi" jika data sudah aktif, atau "Dalam Proses" jika masih tahap integrasi.'
    },
    {
      'Nama Kolom': 'PIC Tim Pusdatin',
      'Kewajiban': 'Opsional',
      'Contoh Nilai': 'Ghozy, Winda, Dessy, Mukhlis, Inan Adnan, Syamsudin, Rosyid',
      'Keterangan': 'Nama petugas penanggung jawab di tim Pusdatin.'
    },
    {
      'Nama Kolom': 'Sumber Data',
      'Kewajiban': 'Opsional',
      'Contoh Nilai': 'SIMAS, SIMKAH, SIWAK, EMIS, BPS',
      'Keterangan': 'Aplikasi atau sistem produsen asal data.'
    },
    {
      'Nama Kolom': 'Nilai 2020 s/d 2025',
      'Kewajiban': 'Opsional (Angka)',
      'Contoh Nilai': '150000',
      'Keterangan': 'Angka runtun waktu tahunan untuk visualisasi grafik Recharts.'
    }
  ];

  const wsGuide = utils.json_to_sheet(guideData);
  wsGuide['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 38 }, { wch: 55 }];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, wsData, 'Template Indikator');
  utils.book_append_sheet(wb, wsGuide, 'Petunjuk & Referensi');

  writeFile(wb, filename);
}

/**
 * 5. Parser File Excel Impor Masal / Multi-Baris
 */
export async function parseUploadedExcel(file: File, existingIndicators: IndicatorItem[]): Promise<{
  success: boolean;
  imported: IndicatorItem[];
  errors: string[];
  totalRowsRead: number;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          resolve({ success: false, imported: [], errors: ['Gagal membaca file.'], totalRowsRead: 0 });
          return;
        }

        const wb = read(buffer, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];

        if (!ws) {
          resolve({ success: false, imported: [], errors: ['Sheet kosong atau tidak ditemukan.'], totalRowsRead: 0 });
          return;
        }

        const rawRows: Record<string, any>[] = utils.sheet_to_json(ws);
        if (!rawRows || rawRows.length === 0) {
          resolve({ success: false, imported: [], errors: ['File Excel tidak memuat baris data.'], totalRowsRead: 0 });
          return;
        }

        const errors: string[] = [];
        const imported: IndicatorItem[] = [];
        let maxNo = existingIndicators.reduce((max, item) => Math.max(max, item.no || 0), 0);

        rawRows.forEach((row, idx) => {
          const rowNum = idx + 2;

          const getVal = (...keys: string[]): any => {
            for (const k of keys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.toLowerCase().trim() === k.toLowerCase().trim()) {
                  return row[rowKey];
                }
              }
            }
            return undefined;
          };

          const nama = String(getVal('Nama Indikator', 'Nama Data', 'Nama', 'Indikator') || '').trim();
          if (!nama) {
            const hasAnyVal = Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '');
            if (hasAnyVal) {
              errors.push(`Baris ${rowNum}: Kolom "Nama Indikator" wajib diisi.`);
            }
            return;
          }

          maxNo += 1;
          const padNo = String(maxNo).padStart(3, '0');
          const customId = String(getVal('Kode Indikator', 'Kode', 'ID') || `IND-${padNo}`).trim();
          const kategori = String(getVal('Rumpun Kategori', 'Kategori', 'Kelompok') || 'Umum & Tata Kelola').trim();
          
          let agamaRaw = String(getVal('Agama') || '').trim();
          const validAgamaList: AgamaType[] = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Semua Agama', 'Umum'];
          const matchedAgama = validAgamaList.find(a => a.toLowerCase() === agamaRaw.toLowerCase()) || 'Umum';

          let bimasRaw = String(getVal('Ditjen / Bimas', 'Ditjen Bimas', 'Bimas', 'Unit Pengampu') || '').trim();
          const bimasMap: Record<string, BimasType> = {
            'islam': 'Ditjen Bimas Islam',
            'kristen': 'Ditjen Bimas Kristen',
            'katolik': 'Ditjen Bimas Katolik',
            'hindu': 'Ditjen Bimas Hindu',
            'buddha': 'Ditjen Bimas Buddha',
            'khonghucu': 'Pusbimdik Khonghucu',
            'pkub': 'Pusat Kerukunan Umat Beragama (PKUB)',
            'sekjen': 'Sekretariat Jenderal / Pusdatin',
          };
          let matchedBimas: BimasType = 'Sekretariat Jenderal / Pusdatin';
          for (const [key, val] of Object.entries(bimasMap)) {
            if (bimasRaw.toLowerCase().includes(key) || matchedAgama.toLowerCase().includes(key)) {
              matchedBimas = val;
              break;
            }
          }

          const statusRaw = String(getVal('Status Integrasi', 'Status', 'Terisi') || '').toLowerCase();
          const isTerisi = statusRaw.includes('terisi') || statusRaw === '1' || statusRaw === 'true' || statusRaw === 'aktif';

          const pic = String(getVal('PIC Tim Pusdatin', 'PIC', 'Penanggung Jawab') || 'Pusdatin').trim();
          const sumberData = String(getVal('Sumber Data', 'Sistem Asal', 'Sumber') || 'Sistem Pusdatin / Ditjen').trim();
          const satuan = String(getVal('Satuan Ukuran', 'Satuan') || 'Unit').trim();
          const cakupanWilayah = String(getVal('Cakupan Wilayah', 'Wilayah') || 'Nasional, Provinsi, Kab/Kota') as any;
          const frekuensiUpdate = String(getVal('Frekuensi Update', 'Frekuensi') || 'Tahunan') as any;
          const deskripsi = String(getVal('Deskripsi Indikator', 'Deskripsi', 'Keterangan') || `Indikator ${nama} hasil impor data terpadu Pusdatin Kemenag RI.`).trim();

          const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
          const trenData: YearlyDataPoint[] = years.map(yr => {
            const valRaw = getVal(`Nilai ${yr}`, `Data ${yr}`, `Tahun ${yr}`, yr);
            let valNum = parseFloat(String(valRaw || '').replace(/[^0-9.-]+/g, ''));
            if (isNaN(valNum) || valNum <= 0) {
              valNum = 100 + (maxNo * 7) % 50;
            }
            return {
              tahun: yr,
              nilai: Math.round(valNum),
              satuan: satuan,
              catatan: isTerisi ? 'Data terverifikasi' : 'Tahap verifikasi'
            };
          });

          imported.push({
            id: customId,
            no: maxNo,
            nama,
            kategori,
            agama: matchedAgama,
            bimas: matchedBimas,
            pic,
            terisi: isTerisi,
            statusText: isTerisi ? 'Terisi / Terintegrasi' : 'Dalam Proses',
            sumberData,
            cakupanWilayah,
            satuan,
            deskripsi,
            frekuensiUpdate,
            terakhirDiperbarui: new Date().toISOString().slice(0, 10),
            trenData,
            tags: [kategori, matchedAgama, matchedBimas, pic, satuan]
          });
        });

        resolve({
          success: imported.length > 0,
          imported,
          errors,
          totalRowsRead: rawRows.length
        });
      } catch (err: any) {
        resolve({
          success: false,
          imported: [],
          errors: [`Format file tidak dapat diproses: ${err?.message || 'Error tidak diketahui'}`],
          totalRowsRead: 0
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, imported: [], errors: ['Gagal membaca berkas dari sistem.'], totalRowsRead: 0 });
    };

    reader.readAsArrayBuffer(file);
  });
}
