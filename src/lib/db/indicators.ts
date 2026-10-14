import { getDbPool } from './pool';
import { IndicatorItem, YearlyDataPoint } from '@/types/indicator';
import { getAllIndicators as getFallbackIndicators } from '@/lib/data-loader';

/**
 * Mengambil seluruh indikator dari Database PostgreSQL.
 * ARSITEKTUR ZERO-DOWNTIME:
 * Jika DATABASE_URL belum disetel, DB mati, atau koneksi timeout,
 * fungsi ini OTOMATIS fallback ke data lokal (src/data/data-agama.json).
 * Sehingga website TIDAK PERNAH crash atau menampilkan halaman putih!
 */
export async function getIndicatorsWithFallback(): Promise<IndicatorItem[]> {
  const pool = getDbPool();

  if (!pool) {
    return getFallbackIndicators();
  }

  try {
    const client = await pool.connect();
    try {
      // 1. Ambil data indikator
      const indicatorsResult = await client.query(`
        SELECT 
          id, no, nama, kategori, agama, bimas, satuan, 
          cakupan_wilayah as "cakupanWilayah",
          frekuensi_update as "frekuensiUpdate",
          sumber_data as "sumberData",
          deskripsi, pic, terisi, 
          status_text as "statusText",
          terakhir_diperbarui as "terakhirDiperbarui"
        FROM indicators
        ORDER BY no ASC
      `);

      if (indicatorsResult.rows.length === 0) {
        // Jika tabel masih kosong, gunakan fallback lokal
        return getFallbackIndicators();
      }

      // 2. Ambil seluruh data tahunan (2020-2024)
      const yearlyResult = await client.query(`
        SELECT indicator_id, tahun, nilai, satuan, catatan
        FROM indicator_yearly_data
        ORDER BY tahun ASC
      `);

      const yearlyMap = new Map<string, YearlyDataPoint[]>();
      for (const row of yearlyResult.rows) {
        const id = row.indicator_id;
        if (!yearlyMap.has(id)) {
          yearlyMap.set(id, []);
        }
        yearlyMap.get(id)!.push({
          tahun: String(row.tahun),
          nilai: Number(row.nilai),
          satuan: row.satuan,
          catatan: row.catatan || undefined,
        });
      }

      // 3. Gabungkan menjadi objek IndicatorItem
      const indicators: IndicatorItem[] = indicatorsResult.rows.map(row => ({
        ...row,
        trenData: yearlyMap.get(row.id) || [],
      }));

      return indicators;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.warn('[Database Fallback Activated]: Kendala DB:', error.message, '- Menampilkan data lokal acuan.');
    return getFallbackIndicators();
  }
}

/**
 * Menyimpan atau memperbarui data indikator ke Database secara transaksional (ACID).
 * Menggunakan Parameterized Query untuk mencegah serangan SQL Injection 100%.
 */
export async function upsertIndicatorsTransaction(
  items: IndicatorItem[],
  auditFilename = 'cms-upload.xlsx'
): Promise<{ success: boolean; count: number; error?: string }> {
  const pool = getDbPool();
  if (!pool) {
    return {
      success: false,
      count: 0,
      error: 'DATABASE_URL belum dikonfigurasi. Hubungkan database terlebih dahulu di .env.',
    };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Mulai Transaksi

    for (const item of items) {
      // 1. Upsert Indikator Utama
      await client.query(`
        INSERT INTO indicators (
          id, no, nama, kategori, agama, bimas, satuan, 
          cakupan_wilayah, frekuensi_update, sumber_data, 
          deskripsi, pic, terisi, status_text, terakhir_diperbarui
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          nama = EXCLUDED.nama,
          kategori = EXCLUDED.kategori,
          agama = EXCLUDED.agama,
          bimas = EXCLUDED.bimas,
          satuan = EXCLUDED.satuan,
          cakupan_wilayah = EXCLUDED.cakupan_wilayah,
          frekuensi_update = EXCLUDED.frekuensi_update,
          sumber_data = EXCLUDED.sumber_data,
          deskripsi = EXCLUDED.deskripsi,
          pic = EXCLUDED.pic,
          terisi = EXCLUDED.terisi,
          status_text = EXCLUDED.status_text,
          terakhir_diperbarui = EXCLUDED.terakhir_diperbarui;
      `, [
        item.id,
        item.no || 0,
        item.nama,
        item.kategori,
        item.agama,
        item.bimas,
        item.satuan,
        item.cakupanWilayah,
        item.frekuensiUpdate,
        item.sumberData,
        item.deskripsi,
        item.pic,
        item.terisi,
        item.statusText,
        item.terakhirDiperbarui,
      ]);

      // 2. Upsert Data Tahunan
      if (item.trenData && item.trenData.length > 0) {
        for (const pt of item.trenData) {
          await client.query(`
            INSERT INTO indicator_yearly_data (indicator_id, tahun, nilai, satuan, catatan)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (indicator_id, tahun) DO UPDATE SET
              nilai = EXCLUDED.nilai,
              satuan = EXCLUDED.satuan,
              catatan = EXCLUDED.catatan;
          `, [
            item.id,
            String(pt.tahun),
            pt.nilai,
            pt.satuan || item.satuan,
            pt.catatan || null,
          ]);
        }
      }
    }

    // 3. Catat Riwayat Audit Log
    await client.query(`
      INSERT INTO upload_audit_logs (filename, upload_mode, total_records, status, message)
      VALUES ($1, $2, $3, $4, $5);
    `, [
      auditFilename,
      'bulk-upsert',
      items.length,
      'SUCCESS',
      `Berhasil memperbarui ${items.length} dataset secara transaksional.`,
    ]);

    await client.query('COMMIT'); // Commit transaksi jika semua baris sukses
    return { success: true, count: items.length };
  } catch (error: any) {
    await client.query('ROLLBACK'); // Rollback jika ada 1 baris yang gagal
    console.error('[Database Transaction Error]: Rollback dilakukan:', error.message);
    return { success: false, count: 0, error: error.message };
  } finally {
    client.release();
  }
}
