import { Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageMetadata } from './LanguageMetadata';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { StaticBackdrop } from '@/components/background/StaticBackdrop';

const Galaxy = lazy(() => import('./Galaxy'));

export default function Layout() {
  useScrollToTop();
  const capabilities = useDeviceCapabilities();

  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <LanguageMetadata />
      <div className="fixed inset-0 -z-20 h-full w-full">
        {capabilities.shouldUseStaticExperience ? (
          <StaticBackdrop />
        ) : (
          <Suspense fallback={<StaticBackdrop />}>
            <Galaxy
              mouseInteraction={!capabilities.prefersReducedMotion}
              mouseRepulsion={!capabilities.prefersReducedMotion}
              density={capabilities.hasDiscreteGPU ? 1 : 0.72}
              glowIntensity={capabilities.hasDiscreteGPU ? 0.28 : 0.18}
              saturation={0.45}
              hueShift={200}
              twinkleIntensity={capabilities.hasDiscreteGPU ? 0.55 : 0.32}
              rotationSpeed={capabilities.hasDiscreteGPU ? 0.01 : 0.004}
              repulsionStrength={capabilities.hasDiscreteGPU ? 1.6 : 1}
              autoCenterRepulsion={0}
              starSpeed={capabilities.hasDiscreteGPU ? 0.22 : 0.16}
              speed={capabilities.hasDiscreteGPU ? 0.75 : 0.55}
            />
          </Suspense>
        )}
      </div>
      <Navbar />
      <main className="relative z-0 flex-grow pb-16 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
