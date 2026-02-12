/**
 * Theme Utilities
 * Helper functions for theme management
 * @version 1.0.0
 */

import { THEME_STORAGE_KEY } from '@/constants/theme';

/**
 * Get system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get saved theme from localStorage
 */
export function getSavedTheme(): 'light' | 'dark' | 'system' | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved as 'light' | 'dark' | 'system';
  }
  return null;
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: 'light' | 'dark' | 'system'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

/**
 * Update meta theme-color
 */
export function updateMetaThemeColor(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#111827' : '#FFFFFF');
  }
}
