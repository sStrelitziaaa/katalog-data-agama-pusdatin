-- ==============================================================================
-- SISTEM INTEGRASI DATA AGAMA & KEAGAMAAN - PUSDATIN KEMENAG RI
-- Database Schema: PostgreSQL 14+
-- Standar Satu Data Indonesia (SDI)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL UTAMA: INDIKATOR DATA AGAMA
CREATE TABLE IF NOT EXISTS indicators (
    id VARCHAR(20) PRIMARY KEY,                    -- e.g. 'IND-001'
    no INT NOT NULL,                               -- Nomor urut acuan (1 s.d. 82)
    nama VARCHAR(255) NOT NULL,                    -- Nama indikator data
    kategori VARCHAR(100) NOT NULL,                -- Rumpun kategori (e.g. 'Rumah Ibadah', 'Pendidikan')
    agama VARCHAR(50) NOT NULL,                    -- 'Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Semua Agama', 'Umum'
    bimas VARCHAR(150) NOT NULL,                   -- 'Ditjen Bimas Islam', 'Pusbimdik Khonghucu', 'BMBPSDM', dll.
    satuan VARCHAR(50) NOT NULL,                   -- 'Unit', 'Orang', 'Lembaga', 'Rupiah', dll.
    cakupan_wilayah VARCHAR(50) NOT NULL,          -- 'Nasional', 'Provinsi', 'Kab/Kota'
    frekuensi_update VARCHAR(50) NOT NULL,         -- 'Tahunan', 'Semesteran', 'Bulanan'
    sumber_data TEXT NOT NULL,                     -- Nama aplikasi / unit kerja sumber data
    deskripsi TEXT,                                -- Keterangan operasional indikator
    pic VARCHAR(100) NOT NULL,                     -- Nama PIC pengelola data di Pusdatin
    terisi BOOLEAN NOT NULL DEFAULT false,         -- Status keterisian data
    status_text VARCHAR(100) NOT NULL,             -- 'Data Terisi', 'Dalam Proses Integrasi', dll.
    terakhir_diperbarui VARCHAR(50) NOT NULL,      -- Tanggal pembaruan terakhir (e.g. '15 Des 2024')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL NILAI TREN TAHUNAN HISTORIS (2020 - 2024+)
CREATE TABLE IF NOT EXISTS indicator_yearly_data (
    id SERIAL PRIMARY KEY,
    indicator_id VARCHAR(20) NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
    tahun VARCHAR(10) NOT NULL,                    -- '2020', '2021', '2022', '2023', '2024'
    nilai NUMERIC(18, 2) NOT NULL DEFAULT 0,       -- Nilai capaian angka statistik
    satuan VARCHAR(50),                            -- Satuan nilai
    catatan TEXT,                                  -- Catatan verifikasi atau metodologi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_indicator_year UNIQUE (indicator_id, tahun)
);

-- 4. TABEL AUDIT LOG UNGGAH BERKAS (KEAMANAN & RIWAYAT CMS)
CREATE TABLE IF NOT EXISTS upload_audit_logs (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    upload_mode VARCHAR(50) NOT NULL,              -- 'single', 'category', 'bulk'
    total_records INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,                   -- 'SUCCESS', 'VALIDATION_FAILED', 'ERROR'
    message TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INDEX OPTIMASI QUERY (TINGKATKAN KECEPATAN SAAT TRAFFIC TINGGI)
CREATE INDEX IF NOT EXISTS idx_indicators_kategori ON indicators(kategori);
CREATE INDEX IF NOT EXISTS idx_indicators_agama ON indicators(agama);
CREATE INDEX IF NOT EXISTS idx_indicators_bimas ON indicators(bimas);
CREATE INDEX IF NOT EXISTS idx_indicators_terisi ON indicators(terisi);
CREATE INDEX IF NOT EXISTS idx_yearly_indicator_id ON indicator_yearly_data(indicator_id);
CREATE INDEX IF NOT EXISTS idx_yearly_tahun ON indicator_yearly_data(tahun);

-- 6. TRIGGER AUTO UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_indicators_timestamp ON indicators;
CREATE TRIGGER set_indicators_timestamp
BEFORE UPDATE ON indicators
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();
