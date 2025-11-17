import { Outlet } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageMetadata } from './LanguageMetadata';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

// Lazy load Galaxy background for better performance
const Galaxy = lazy(() => import('./Galaxy'));

export default function Layout() {
  useScrollToTop();
  const { canHandle3D, isMobile } = useDeviceCapabilities();
  const showGalaxy = canHandle3D;
  const galaxyProps = useMemo(
    () => ({
      mouseInteraction: !isMobile,
      mouseRepulsion: !isMobile,
      density: isMobile ? 1.4 : 2.1,
      glowIntensity: isMobile ? 0.45 : 0.6,
      saturation: 1,
      hueShift: 200,
      twinkleIntensity: isMobile ? 0.6 : 0.8,
      starSpeed: isMobile ? 0.2 : 0.3,
      speed: isMobile ? 0.8 : 1,
      repulsionStrength: isMobile ? 3 : 4.5,
      autoCenterRepulsion: isMobile ? 0.2 : 0,
      rotationSpeed: 0,
      transparent: true,
    }),
    [isMobile],
  );

  return (
    <div className="relative flex flex-col min-h-[100dvh]">
      <LanguageMetadata />
      {/* Galaxy Background - Optimized for performance */}
      {showGalaxy && (
        <div className="pointer-events-none" aria-hidden="true">
          <div className="fixed inset-0 w-full h-full -z-20">
            <Suspense fallback={null}>
              <Galaxy {...galaxyProps} />
            </Suspense>
          </div>
        </div>
      )}
      
      <Navbar />
      <main className="flex-grow pt-24 pb-16 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}