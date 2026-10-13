'use client';

import { IndicatorItem } from '@/types/indicator';

const STORAGE_KEY = 'pusdatin_custom_data_agama';

/**
 * Mengambil indikator tambahan yang tersimpan di localStorage browser
 */
export function getStoredIndicators(): IndicatorItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca data dari storage lokal:', e);
    return [];
  }
}

/**
 * Menyimpan data impor baru ke localStorage
 */
export function saveStoredIndicators(
  importedItems: IndicatorItem[],
  mode: 'append' | 'replace' = 'append',
  baseIndicators: IndicatorItem[] = []
): IndicatorItem[] {
  if (typeof window === 'undefined') return [];

  try {
    let finalCustomItems: IndicatorItem[] = [];

    if (mode === 'replace') {
      finalCustomItems = importedItems;
    } else {
      const existingStored = getStoredIndicators();
      const existingMap = new Map<string, IndicatorItem>();

      // Masukkan yang sudah ada di storage
      existingStored.forEach(item => existingMap.set(item.id.toLowerCase(), item));

      // Timpa atau tambahkan yang baru diimpor
      importedItems.forEach(item => existingMap.set(item.id.toLowerCase(), item));

      finalCustomItems = Array.from(existingMap.values());
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCustomItems));
    return finalCustomItems;
  } catch (e) {
    console.error('Gagal menyimpan data ke storage lokal:', e);
    return [];
  }
}

/**
 * Menghapus data impor kustom (kembali ke data default 82 indikator)
 */
export function resetStoredIndicators(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Gagal reset storage:', e);
  }
}

/**
 * Menggabungkan data default dengan data hasil upload di storage
 */
export function mergeWithStoredIndicators(baseIndicators: IndicatorItem[]): {
  merged: IndicatorItem[];
  customCount: number;
} {
  const customItems = getStoredIndicators();
  if (customItems.length === 0) {
    return { merged: baseIndicators, customCount: 0 };
  }

  const map = new Map<string, IndicatorItem>();
  // 1. Masukkan data dasar
  baseIndicators.forEach(item => map.set(item.id.toLowerCase(), item));
  // 2. Timpa atau tambahkan data kustom
  customItems.forEach(item => map.set(item.id.toLowerCase(), item));

  const merged = Array.from(map.values()).sort((a, b) => (a.no || 0) - (b.no || 0));
  return {
    merged,
    customCount: customItems.length,
  };
}
