/**
 * Hook to detect device capabilities for performance optimization
 * Helps decide whether to enable expensive features like 3D backgrounds
 */

import { useEffect, useState } from 'react';

interface DeviceCapabilities {
  /** Whether the device can handle heavy 3D graphics */
  canHandle3D: boolean;
  /** Whether the device has a discrete GPU */
  hasDiscreteGPU: boolean;
  /** Device memory in GB (if available) */
  deviceMemory?: number;
  /** Number of logical CPU cores */
  hardwareConcurrency?: number;
  /** Whether user prefers reduced data usage */
  saveData: boolean;
}

/**
 * Detect device capabilities for performance optimization
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    // Initial values (conservative defaults)
    return {
      canHandle3D: true, // Assume capable initially
      hasDiscreteGPU: false,
      saveData: false,
    };
  });

  useEffect(() => {
    // Only run detection in browser
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    async function detectCapabilities() {
      // Check for save-data preference
      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      const saveData = connection?.saveData || false;
      const effectiveType = connection?.effectiveType;

      // Check device memory (Chrome/Edge only)
      const deviceMemory = (navigator as Navigator & {
        deviceMemory?: number;
      }).deviceMemory;

      // Check hardware concurrency (number of logical processors)
      const hardwareConcurrency = navigator.hardwareConcurrency;

      // Check for WebGL capabilities
      let hasDiscreteGPU = false;
      let canHandle3D = true;

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            
            // Check for discrete GPU indicators
            const rendererLower = String(renderer).toLowerCase();
            hasDiscreteGPU = 
              rendererLower.includes('nvidia') ||
              rendererLower.includes('amd') ||
              rendererLower.includes('radeon') ||
              rendererLower.includes('geforce') ||
              (rendererLower.includes('intel') && rendererLower.includes('iris'));
          }
        }
      } catch (error) {
        console.warn('Failed to detect GPU capabilities:', error);
        canHandle3D = false;
      }

      // Decision logic for 3D support
      // Disable 3D if:
      // 1. User has save-data enabled
      // 2. Connection is slow (2g/slow-2g)
      // 3. Device has low memory (< 4GB)
      // 4. Device has few CPU cores (< 4)
      // 5. Mobile device (detected by screen width)
      const isMobile = window.innerWidth < 768;
      const hasLowMemory = deviceMemory && deviceMemory < 4;
      const hasFewCores = hardwareConcurrency && hardwareConcurrency < 4;
      const hasSlowConnection = effectiveType === '2g' || effectiveType === 'slow-2g';

      canHandle3D = canHandle3D && 
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
      });
    }

    detectCapabilities();

    // Re-check on resize (for responsive behavior)
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setCapabilities(prev => ({
        ...prev,
        canHandle3D: prev.canHandle3D && !isMobile,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}
