import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// 1. Baca .env atau .env.local jika ada
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
      console.log(`[Env Loaded]: ${file}`);
      break;
    }
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('\n❌ ERROR: DATABASE_URL / DATABASE_URL_UNPOOLED tidak ditemukan.');
  console.error('Silakan isi variabel DATABASE_URL di file .env atau .env.local terlebih dahulu.');
  console.error('Contoh: DATABASE_URL="postgresql://postgres:password@localhost:5432/kemenag_data_agama?sslmode=disable"\n');
  process.exit(1);
}

const { Pool } = pg;
const isSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('supabase.com') || dbUrl.includes('neon.tech');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});

async function main() {
  console.log('\n🚀 Memulai Inisialisasi & Seeding Database Pusdatin Kemenag RI...\n');
  const client = await pool.connect();

  try {
    // 1. Eksekusi Schema DDL
    const schemaSqlPath = resolve(rootDir, 'database', 'schema.sql');
    console.log(`[1/3] Menjalankan DDL Schema dari ${schemaSqlPath}...`);
    const schemaSql = readFileSync(schemaSqlPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Tabel "indicators", "indicator_yearly_data", dan "upload_audit_logs" berhasil dibuat.');

    // 2. Baca Data Awal dari src/data/data-agama.json
    const jsonPath = resolve(rootDir, 'src', 'data', 'data-agama.json');
    console.log(`\n[2/3] Membaca 82 data acuan dari ${jsonPath}...`);
    const rawJson = readFileSync(jsonPath, 'utf8');
    const indicators = JSON.parse(rawJson);
    console.log(`Ditemukan ${indicators.length} indikator acuan standar.`);

    // 3. Masukkan ke Database secara Transaksional
    console.log('\n[3/3] Memasukkan data ke tabel PostgreSQL...');
    await client.query('BEGIN');

    let totalPoints = 0;
    for (const item of indicators) {
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
          totalPoints++;
        }
      }
    }

    await client.query('COMMIT');
    console.log(`\n🎉 SUKSES! Berhasil memasukkan ${indicators.length} indikator dan ${totalPoints} data tahunan ke Database.`);
    console.log('Database Anda kini siap digunakan dan terintegrasi penuh dengan portal web.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Terjadi kesalahan saat seeding:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
