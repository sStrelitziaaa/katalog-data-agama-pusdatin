'use client';

import { useState, useEffect } from 'react';

const ADMIN_STORAGE_KEY = 'pusdatin_admin_session';
export const DEFAULT_ADMIN_PASSCODE = 'adminpusdatin';
export const BACKUP_ADMIN_PASSCODE = 'kemenag2025';

/**
 * Cek apakah browser saat ini dalam sesi aktif Administrator Pusdatin
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Login sesi administrator dengan passcode
 */
export function loginAdmin(passcode: string): boolean {
  if (typeof window === 'undefined') return false;
  const clean = passcode.trim().toLowerCase();
  if (clean === DEFAULT_ADMIN_PASSCODE.toLowerCase() || clean === BACKUP_ADMIN_PASSCODE.toLowerCase()) {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      window.dispatchEvent(new Event('pusdatin_admin_auth_changed'));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Logout sesi administrator
 */
export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    window.dispatchEvent(new Event('pusdatin_admin_auth_changed'));
  } catch {
    // ignore
  }
}

/**
 * Hook reaktif untuk mengecek status login admin di seluruh komponen
 */
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setIsLoaded(true);

    const handleAuthChange = () => {
      setIsAdmin(isAdminAuthenticated());
    };

    window.addEventListener('pusdatin_admin_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('pusdatin_admin_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return {
    isAdmin,
    isLoaded,
    login: loginAdmin,
    logout: logoutAdmin,
  };
}
