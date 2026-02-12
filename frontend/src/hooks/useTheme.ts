/**
 * useTheme Hook
 * Custom hook for accessing theme context
 * @version 1.0.0
 */

import { useContext } from 'react';
import { useTheme as useThemeContext } from '@/components/ThemeToggle';

export function useTheme() {
  const context = useThemeContext();
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export default useTheme;
