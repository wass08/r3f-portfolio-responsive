import { WINDOW_DEFAULTS } from './constants';

/**
 * Window utility functions
 */

/**
 * Constrain position to viewport bounds
 */
export const constrainWindowPosition = (x, y, width, height) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const constrainedX = Math.max(0, Math.min(x, windowWidth - width));
  const constrainedY = Math.max(0, Math.min(y, windowHeight - height));

  return { x: constrainedX, y: constrainedY };
};

/**
 * Constrain size to min/max bounds
 */
export const constrainWindowSize = (width, height) => {
  const constrainedWidth = Math.max(
    WINDOW_DEFAULTS.minWidth,
    Math.min(width, WINDOW_DEFAULTS.maxWidth)
  );
  const constrainedHeight = Math.max(
    WINDOW_DEFAULTS.minHeight,
    Math.min(height, WINDOW_DEFAULTS.maxHeight)
  );

  return { width: constrainedWidth, height: constrainedHeight };
};

/**
 * Calculate maximized window dimensions
 */
export const getMaximizedDimensions = () => {
  const padding = 16;
  return {
    x: padding,
    y: padding,
    width: window.innerWidth - padding * 2,
    height: window.innerHeight - padding * 2,
  };
};

/**
 * Check if window is overlapping with another
 */
export const isWindowOverlapping = (window1, window2) => {
  const { x: x1, y: y1, width: w1, height: h1 } = window1;
  const { x: x2, y: y2, width: w2, height: h2 } = window2;

  return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
};

/**
 * Generate unique window ID
 */
export const generateWindowId = (app) => {
  return `${app}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Cascade window positions (for multiple windows of same app)
 */
export const cascadeWindowPosition = (index = 0, baseX = 50, baseY = 50) => {
  const offset = 30;
  return {
    x: baseX + index * offset,
    y: baseY + index * offset,
  };
};
