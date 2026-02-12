/**
 * Mobile Viewport Utilities
 * Helper functions for mobile viewport handling
 * @version 1.0.0
 */

/**
 * Check if device is iPhone SE (or similar small screen)
 */
export function isSmallMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 375 && window.innerHeight <= 667;
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if in landscape mode
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
}
