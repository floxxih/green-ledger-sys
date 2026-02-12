/**
 * Theme Types
 * Type definitions for theme system
 * @version 1.0.0
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  systemPreference: 'light' | 'dark';
}
