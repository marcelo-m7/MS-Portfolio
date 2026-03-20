import { lazy, Suspense, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { BackgroundFallback } from './BackgroundFallback';

const Galaxy = lazy(() => import('@/components/Galaxy'));

export function BackgroundScene() {
  const prefersReducedMotion = useReducedMotion();
  const capabilities = useDeviceCapabilities();

  const shouldRenderInteractive3D = useMemo(() => {
    if (prefersReducedMotion) return false;
    if (!capabilities.hasMounted) return false;
    return capabilities.canHandle3D;
  }, [capabilities.canHandle3D, capabilities.hasMounted, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <BackgroundFallback />
      {shouldRenderInteractive3D ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0 pointer-events-auto">
            <Galaxy
              mouseInteraction={capabilities.hasDiscreteGPU}
              mouseRepulsion={capabilities.hasDiscreteGPU}
              density={capabilities.hasDiscreteGPU ? 0.82 : 0.58}
              glowIntensity={capabilities.hasDiscreteGPU ? 0.25 : 0.18}
              saturation={0.42}
              hueShift={210}
              twinkleIntensity={capabilities.hasDiscreteGPU ? 0.55 : 0.3}
              rotationSpeed={0.004}
              repulsionStrength={1.1}
              autoCenterRepulsion={0}
              starSpeed={0.12}
              speed={0.35}
            />
          </div>
        </Suspense>
      ) : null}
    </div>
  );
}
