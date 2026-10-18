import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { testDbConnection } from '../src/lib/db/pool.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Load .env.local
const envPath = resolve(rootDir, '.env.local');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
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
}

import pg from 'pg';
const { Pool } = pg;

console.log('Testing connection to Neon Postgres via DATABASE_URL...');
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  const client = await pool.connect();
  console.log('Connected to Neon successfully!');

  // Query 1: Test Server Time & Version
  const timeRes = await client.query('SELECT NOW() as server_time, version() as pg_version');
  console.log('Neon Server Time:', timeRes.rows[0].server_time);
  console.log('Postgres Version:', timeRes.rows[0].pg_version.slice(0, 40) + '...');

  // Query 2: Test Indicators count
  const countRes = await client.query('SELECT count(*) as total_indicators FROM indicators');
  console.log('Total Indicators in Neon:', countRes.rows[0].total_indicators);

  // Query 3: Test Sample data fetch
  const sampleRes = await client.query('SELECT id, nama, bimas, kategori FROM indicators ORDER BY no ASC LIMIT 3');
  console.log('Sample Data Rows from Neon:');
  console.table(sampleRes.rows);

  // Query 4: Test Yearly data count
  const yearlyRes = await client.query('SELECT count(*) as total_yearly_points FROM indicator_yearly_data');
  console.log('Total Yearly Data Points in Neon:', yearlyRes.rows[0].total_yearly_points);

  client.release();
  await pool.end();
  console.log('\nAll Neon Postgres end-to-end service tests PASSED successfully!');
  process.exit(0);
} catch (err) {
  console.error('Neon test failed:', err);
  process.exit(1);
}
