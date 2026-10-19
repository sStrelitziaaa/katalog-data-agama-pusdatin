import { IndicatorItem, YearlyDataPoint } from '@/types/indicator';
import {
  AGAMA_LIST,
  BIMAS_LIST,
  CAKUPAN_WILAYAH_LIST,
  FREKUENSI_UPDATE_LIST,
} from '@/lib/catalog';

/**
 * Validasi & normalisasi data indikator yang dikirim ke API admin.
 * Dijalankan di SERVER: input dari browser tidak pernah dipercaya begitu saja,
 * walaupun form/Excel di sisi client juga sudah melakukan pengecekan.
 */

export type NewIndicatorInput = Omit<IndicatorItem, 'id' | 'no' | 'statusText' | 'terakhirDiperbarui' | 'tags'>;

type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const MAX_TREN_POINTS = 50;

function text(raw: unknown, field: string, max: number, errors: string[], required = true): string {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (required && !value) errors.push(`${field} wajib diisi.`);
  if (value.length > max) errors.push(`${field} maksimal ${max} karakter.`);
  return value;
}

function oneOf<T extends string>(raw: unknown, field: string, allowed: readonly T[], errors: string[]): T {
  if (typeof raw === 'string' && (allowed as readonly string[]).includes(raw)) return raw as T;
  errors.push(`${field} tidak valid.`);
  return allowed[0];
}

function trenData(raw: unknown, satuan: string, errors: string[]): YearlyDataPoint[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.length > MAX_TREN_POINTS) {
    errors.push('Data tren tahunan tidak valid.');
    return [];
  }

  const byYear = new Map<string, YearlyDataPoint>();
  for (const point of raw) {
    const tahun = String(point?.tahun ?? '').trim();
    const nilai = Number(point?.nilai);
    if (!/^\d{4}$/.test(tahun)) {
      errors.push(`Tahun "${tahun}" tidak valid (gunakan 4 digit, mis. 2024).`);
      continue;
    }
    if (!Number.isFinite(nilai) || nilai < 0) {
      errors.push(`Nilai tahun ${tahun} harus berupa angka 0 atau lebih.`);
      continue;
    }
    const catatan = typeof point?.catatan === 'string' ? point.catatan.trim().slice(0, 500) : undefined;
    byYear.set(tahun, { tahun, nilai, satuan, catatan: catatan || undefined });
  }

  return Array.from(byYear.values()).sort((a, b) => a.tahun.localeCompare(b.tahun));
}

function baseFields(raw: Record<string, unknown>, errors: string[]): NewIndicatorInput {
  const satuan = text(raw.satuan, 'Satuan', 50, errors);
  return {
    nama: text(raw.nama, 'Nama indikator', 255, errors),
    kategori: text(raw.kategori, 'Kategori', 100, errors),
    agama: oneOf(raw.agama, 'Agama', AGAMA_LIST, errors),
    bimas: oneOf(raw.bimas, 'Produsen data', BIMAS_LIST, errors),
    pic: text(raw.pic, 'PIC', 100, errors),
    sumberData: text(raw.sumberData, 'Sumber data', 1000, errors),
    cakupanWilayah: oneOf(raw.cakupanWilayah, 'Cakupan wilayah', CAKUPAN_WILAYAH_LIST, errors),
    frekuensiUpdate: oneOf(raw.frekuensiUpdate, 'Frekuensi update', FREKUENSI_UPDATE_LIST, errors),
    satuan,
    deskripsi: text(raw.deskripsi, 'Deskripsi', 5000, errors, false),
    terisi: Boolean(raw.terisi),
    trenData: trenData(raw.trenData, satuan, errors),
  };
}

/** Validasi indikator BARU dari form "Tambah Indikator" (ID dibuat oleh server). */
export function parseNewIndicator(raw: unknown): Result<NewIndicatorInput> {
  if (!raw || typeof raw !== 'object') return { ok: false, errors: ['Data indikator tidak valid.'] };
  const errors: string[] = [];
  const value = baseFields(raw as Record<string, unknown>, errors);
  return errors.length ? { ok: false, errors } : { ok: true, value };
}

/** Validasi indikator yang DIPERBARUI dari CMS (Excel / input cepat), wajib menyertakan ID. */
export function parseIndicatorUpdate(raw: unknown): Result<IndicatorItem> {
  if (!raw || typeof raw !== 'object') return { ok: false, errors: ['Data indikator tidak valid.'] };
  const record = raw as Record<string, unknown>;
  const errors: string[] = [];

  const id = text(record.id, 'Kode indikator', 20, errors);
  const base = baseFields(record, errors);
  if (errors.length) return { ok: false, errors: errors.map(e => (id ? `[${id}] ${e}` : e)) };

  const no = Number(record.no);
  return {
    ok: true,
    value: {
      ...base,
      id,
      no: Number.isInteger(no) && no > 0 ? no : 0,
      statusText: base.terisi ? 'Terisi / Terintegrasi' : 'Dalam Proses',
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
      tags: [],
    },
  };
}
