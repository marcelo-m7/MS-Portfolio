/**
 * Hook to detect device capabilities for performance optimization.
 * Keeps 3D disabled by default until a device proves it can handle heavier rendering.
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
  shouldUseStaticExperience: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    canHandle3D: false,
    hasDiscreteGPU: false,
    saveData: false,
    prefersReducedMotion: false,
    shouldUseStaticExperience: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    async function detectCapabilities() {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const saveData = connection?.saveData || false;
      const effectiveType = connection?.effectiveType;
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency;

      let hasDiscreteGPU = false;
      let webGlAvailable = true;

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
          webGlAvailable = false;
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
        webGlAvailable = false;
      }

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const hasLowMemory = typeof deviceMemory === 'number' && deviceMemory < MIN_DEVICE_MEMORY_GB;
      const hasFewCores = typeof hardwareConcurrency === 'number' && hardwareConcurrency < MIN_CPU_CORES;
      const hasSlowConnection = effectiveType === '2g' || effectiveType === 'slow-2g';

      const canHandle3D = Boolean(
        webGlAvailable &&
          !reducedMotion &&
          !saveData &&
          !hasSlowConnection &&
          !hasLowMemory &&
          !hasFewCores &&
          !isMobile,
      );

      setCapabilities({
        canHandle3D,
        hasDiscreteGPU,
        deviceMemory,
        hardwareConcurrency,
        saveData,
        prefersReducedMotion: reducedMotion,
        shouldUseStaticExperience: !canHandle3D,
      });
    }

    detectCapabilities();
    window.addEventListener('resize', detectCapabilities);
    return () => window.removeEventListener('resize', detectCapabilities);
  }, []);

  return capabilities;
}
