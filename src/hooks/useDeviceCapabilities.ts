/**
 * Hook to detect device capabilities for performance optimization.
 * The initial state is conservative to avoid mounting heavy 3D on first paint.
 */

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const MIN_DEVICE_MEMORY_GB = 4;
const MIN_CPU_CORES = 4;

interface DeviceCapabilities {
  canHandle3D: boolean;
  hasDiscreteGPU: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  saveData: boolean;
  prefersReducedMotion: boolean;
  hasMounted: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    canHandle3D: false,
    hasDiscreteGPU: false,
    saveData: false,
    prefersReducedMotion: false,
    hasMounted: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    async function detectCapabilities() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const prefersReducedMotion = mediaQuery.matches;
      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      const saveData = connection?.saveData || false;
      const effectiveType = connection?.effectiveType;
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency;

      let hasDiscreteGPU = false;
      let webglAvailable = true;

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { powerPreference: 'low-power' }) || canvas.getContext('webgl');

        if (!gl) {
          webglAvailable = false;
        } else {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).toLowerCase();
            hasDiscreteGPU =
              renderer.includes('nvidia') ||
              renderer.includes('amd') ||
              renderer.includes('radeon') ||
              renderer.includes('geforce') ||
              (renderer.includes('intel') && renderer.includes('iris'));
          }
        }
      } catch {
        webglAvailable = false;
      }

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const hasLowMemory = typeof deviceMemory === 'number' && deviceMemory < MIN_DEVICE_MEMORY_GB;
      const hasFewCores = typeof hardwareConcurrency === 'number' && hardwareConcurrency < MIN_CPU_CORES;
      const hasSlowConnection = effectiveType === '2g' || effectiveType === 'slow-2g';

      const canHandle3D =
        webglAvailable &&
        !prefersReducedMotion &&
        !saveData &&
        !hasSlowConnection &&
        !hasLowMemory &&
        !hasFewCores &&
        !isMobile;

      setCapabilities({
        canHandle3D,
        hasDiscreteGPU,
        deviceMemory,
        hardwareConcurrency,
        saveData,
        prefersReducedMotion,
        hasMounted: true,
      });
    }

    detectCapabilities();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => detectCapabilities();

    window.addEventListener('resize', handleChange);
    mediaQuery.addEventListener?.('change', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
      mediaQuery.removeEventListener?.('change', handleChange);
    };
  }, []);

  return capabilities;
}
