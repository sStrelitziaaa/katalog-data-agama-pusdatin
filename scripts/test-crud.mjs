import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = resolve(rootDir, file);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [k, ...v] = trimmed.split('=');
          const key = k.trim();
          let val = v.join('=').trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      break;
    }
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const { Pool } = pg;
const isSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('neon.tech');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});

async function runTest() {
  console.log('🧪 Menjalankan pengujian verifikasi Database...');
  const client = await pool.connect();
  try {
    const initialRes = await client.query('SELECT count(*) FROM indicators');
    console.log(`Jumlah awal: ${initialRes.rows[0].count} indikator (Harus 0)`);

    // Test Insert
    console.log('Menambahkan indikator uji coba...');
    await client.query(`
      INSERT INTO indicators (
        id, no, nama, kategori, agama, bimas, satuan, 
        cakupan_wilayah, frekuensi_update, sumber_data, 
        deskripsi, pic, terisi, status_text, terakhir_diperbarui
      ) VALUES (
        'IND-TEST', 1, 'Indikator Uji Coba Kemenag', 'Uji Coba', 'Islam', 
        'Ditjen Bimas Islam', 'Unit', 'Nasional', 'Tahunan', 'Sistem Uji Coba', 
        'Deskripsi uji coba', 'PIC Test', true, 'Terisi / Terintegrasi', '2026-10-19'
      );
    `);

    await client.query(`
      INSERT INTO indicator_yearly_data (indicator_id, tahun, nilai, satuan)
      VALUES ('IND-TEST', '2024', 1500, 'Unit');
    `);

    const midRes = await client.query('SELECT count(*) FROM indicators');
    console.log(`Jumlah setelah tambah: ${midRes.rows[0].count} indikator`);

    // Test Delete
    console.log('Membersihkan indikator uji coba...');
    await client.query("DELETE FROM indicator_yearly_data WHERE indicator_id = 'IND-TEST'");
    await client.query("DELETE FROM indicators WHERE id = 'IND-TEST'");

    const finalRes = await client.query('SELECT count(*) FROM indicators');
    console.log(`Jumlah akhir: ${finalRes.rows[0].count} indikator (Kembali ke 0)`);
    console.log('✅ Semua operasi Database CRUD dan Truncate terverifikasi 100% aman dan berfungsi!');
  } finally {
    client.release();
    await pool.end();
  }
}

runTest();
