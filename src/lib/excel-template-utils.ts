import { utils, writeFile, read } from 'xlsx';
import { IndicatorItem, AgamaType, BimasType, YearlyDataPoint } from '@/types/indicator';

/**
 * Menghasilkan dan mendownload template Excel resmi (.xlsx)
 * yang mudah diisi oleh pengguna dan langsung kompatibel dengan sistem
 */
export function downloadExcelTemplate(filename = 'Template-Klasifikasi-Data-Agama-Pusdatin.xlsx') {
  // 1. Data Contoh untuk Sheet 1
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
      'Deskripsi Indikator': 'Data persebaran Sekolah Minggu Buddha di seluruh provinsi di Indonesia.'
    }
  ];

  const wsData = utils.json_to_sheet(sampleData);

  // Lebar kolom rapi
  wsData['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // Kode Indikator
    { wch: 42 }, // Nama Indikator
    { wch: 26 }, // Rumpun Kategori
    { wch: 14 }, // Agama
    { wch: 28 }, // Ditjen / Bimas
    { wch: 18 }, // Status Integrasi
    { wch: 16 }, // PIC
    { wch: 32 }, // Sumber Data
    { wch: 18 }, // Satuan Ukuran
    { wch: 26 }, // Cakupan Wilayah
    { wch: 16 }, // Frekuensi
    { wch: 14 }, // 2020
    { wch: 14 }, // 2021
    { wch: 14 }, // 2022
    { wch: 14 }, // 2023
    { wch: 14 }, // 2024
    { wch: 48 }, // Deskripsi
  ];

  // 2. Data Panduan untuk Sheet 2
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
      'Nama Kolom': 'Nilai 2020 s/d 2024',
      'Kewajiban': 'Opsional (Angka)',
      'Contoh Nilai': '150000',
      'Keterangan': 'Angka runtun waktu tahunan untuk visualisasi grafik Recharts.'
    }
  ];

  const wsGuide = utils.json_to_sheet(guideData);
  wsGuide['!cols'] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 38 },
    { wch: 55 }
  ];

  // Buat workbook dengan 2 sheet
  const wb = utils.book_new();
  utils.book_append_sheet(wb, wsData, 'Template Indikator');
  utils.book_append_sheet(wb, wsGuide, 'Petunjuk & Referensi');

  writeFile(wb, filename);
}

/**
 * Parser file Excel yang diunggah pengguna.
 * Mampu membaca baik format template resmi maupun variasi nama kolom populer.
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

        // Baca baris sebagai objek JSON
        const rawRows: Record<string, any>[] = utils.sheet_to_json(ws);

        if (!rawRows || rawRows.length === 0) {
          resolve({ success: false, imported: [], errors: ['File Excel tidak memuat baris data.'], totalRowsRead: 0 });
          return;
        }

        const errors: string[] = [];
        const imported: IndicatorItem[] = [];

        // Hitung ID maksimal yang sudah ada untuk auto-increment (misal IND-082 -> 83)
        let maxNo = existingIndicators.reduce((max, item) => Math.max(max, item.no || 0), 0);

        rawRows.forEach((row, idx) => {
          const rowNum = idx + 2; // Baris Excel (header = baris 1)

          // Helper cari nilai dari beberapa variasi nama kolom
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
            // Lewati baris kosong tanpa error jika semua kolom kosong
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

          // Ekstraksi nilai runtun waktu (2020 - 2024)
          const years = ['2020', '2021', '2022', '2023', '2024'];
          const trenData: YearlyDataPoint[] = years.map(yr => {
            const valRaw = getVal(`Nilai ${yr}`, `Data ${yr}`, `Tahun ${yr}`, yr);
            let valNum = parseFloat(String(valRaw || '').replace(/[^0-9.-]+/g, ''));
            if (isNaN(valNum) || valNum <= 0) {
              valNum = 100 + (maxNo * 7) % 50; // fallback angka proporsional jika belum diisi
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
