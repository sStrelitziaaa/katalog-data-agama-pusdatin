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
if (!dbUrl) {
  console.error('❌ DATABASE_URL tidak ditemukan.');
  process.exit(1);
}

const { Pool } = pg;
const isSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('neon.tech');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});

async function reset() {
  console.log('🔄 Mengosongkan data dummy di Neon PostgreSQL...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE indicator_yearly_data, indicators, upload_audit_logs CASCADE;');
    await client.query('COMMIT');
    console.log('✅ Semua data berhasil dikosongkan (0 indikator, 0 tren tahunan, 0 audit log).');

    const indRes = await client.query('SELECT count(*) FROM indicators');
    console.log(`Verifikasi jumlah indikator di Neon: ${indRes.rows[0].count}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal mereset database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
