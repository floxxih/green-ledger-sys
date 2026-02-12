/**
 * Theme Tests
 * Test file for theme functionality
 * @version 1.0.0
 */

import { getSystemTheme, getSavedTheme, saveTheme, applyTheme } from '../theme';

describe('Theme Utilities', () => {
  describe('getSystemTheme', () => {
    it('should return system theme preference', () => {
      const theme = getSystemTheme();
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('saveTheme and getSavedTheme', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save and retrieve theme', () => {
      saveTheme('dark');
      expect(getSavedTheme()).toBe('dark');
    });

    it('should return null when no theme is saved', () => {
      expect(getSavedTheme()).toBe(null);
    });
  });

  describe('applyTheme', () => {
    it('should apply theme class to document', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);

      applyTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
