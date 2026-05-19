import { useMemo } from 'react';

/**
 * Hook to detect performance capabilities
 * Returns optimization flags for 3D rendering
 */
export const useThreePerformance = () => {
  const performanceMode = useMemo(() => {
    // Detect low-power / mobile
    const isLowPowerDevice =
      typeof navigator !== 'undefined'
        ? navigator.hardwareConcurrency != null &&
          navigator.hardwareConcurrency <= 4
        : false;

    const isMobile =
      typeof window !== 'undefined'
        ? window.innerWidth < 768 ||
          /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
        : false;

    const isLowEnd = isLowPowerDevice || isMobile;

    return {
      enabled: true,
      isLowEnd,
      isMobile,
      isLowPowerDevice,
      shadows: !isLowEnd,
      antialias: !isLowEnd,
      dpr: isLowEnd ? 1 : 1.5,
      precision: isLowEnd ? 'lowp' : 'mediump',
    };
  }, []);

  return performanceMode;
};
