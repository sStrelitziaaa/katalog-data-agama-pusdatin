import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

/**
 * Mendapatkan instance connection pool PostgreSQL secara singleton.
 * Dilengkapi pembatas koneksi (max 20) agar database tidak kewalahan saat traffic tinggi.
 */
export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;

  // Jika URL database belum disetel, kembalikan null (sistem akan fallback otomatis ke data JSON)
  if (!connectionString || connectionString.trim() === '') {
    return null;
  }

  if (!pool) {
    const isSsl = connectionString.includes('sslmode=require') || connectionString.includes('supabase.com') || connectionString.includes('neon.tech');

    const config: PoolConfig = {
      connectionString,
      max: 20, // Maksimal 20 koneksi bersamaan (Connection Pooling)
      idleTimeoutMillis: 30000, // Tutup koneksi nganggur setelah 30 detik
      connectionTimeoutMillis: 5000, // Timeout 5 detik jika DB lambat merespons
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    };

    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('[Database Pool Error]: Terjadi kendala koneksi tak terduga:', err.message);
    });
  }

  return pool;
}

/**
 * Cek ketersediaan koneksi database
 */
export async function testDbConnection(): Promise<{ connected: boolean; message: string }> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return {
      connected: false,
      message: 'DATABASE_URL belum dikonfigurasi di file .env. Sistem berjalan dengan acuan lokal (JSON).',
    };
  }

  try {
    const client = await dbPool.connect();
    try {
      const res = await client.query('SELECT NOW() as current_time, count(*) as total_indicators FROM indicators');
      return {
        connected: true,
        message: `Terhubung ke Database. Waktu server: ${res.rows[0].current_time}, Indikator di DB: ${res.rows[0].total_indicators}`,
      };
    } finally {
      client.release();
    }
  } catch (error: any) {
    return {
      connected: false,
      message: `Gagal tersambung ke database: ${error.message}. Sistem otomatis menggunakan fallback data lokal.`,
    };
  }
}
