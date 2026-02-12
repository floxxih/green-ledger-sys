/**
 * Theme Constants
 * Color and configuration constants for theming
 * @version 1.0.0
 */

export const THEME_COLORS = {
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    border: {
      default: '#E5E7EB',
      subtle: '#F3F4F6',
      emphasis: '#D1D5DB',
    },
  },
  dark: {
    background: {
      primary: '#030712',
      secondary: '#111827',
      tertiary: '#1F2937',
      elevated: '#374151',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
    },
    border: {
      default: '#374151',
      subtle: '#1F2937',
      emphasis: '#6B7280',
    },
  },
} as const;

export const THEME_TRANSITION_DURATION = 200;

export const THEME_STORAGE_KEY = 'auroramint-theme';
