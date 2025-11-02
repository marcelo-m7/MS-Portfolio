import { Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageMetadata } from './LanguageMetadata';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

// Lazy load Galaxy background for better performance
const Galaxy = lazy(() => import('./Galaxy'));

export default function Layout() {
  useScrollToTop();
  const { canHandle3D } = useDeviceCapabilities();

  return (
    <div className="relative flex flex-col min-h-[100dvh]">
      <LanguageMetadata />
      {/* Galaxy Background - Optimized for performance */}
      {canHandle3D && (
        <div className="hidden md:block">
          <div className="fixed inset-0 w-full h-full -z-20">
            <Suspense fallback={null}>
              <Galaxy
                mouseInteraction={false}
                mouseRepulsion={false}
                density={2.1}
                glowIntensity={0.6}
                saturation={1}
                hueShift={200}
                twinkleIntensity={0.8}
                rotationSpeed={0}
                repulsionStrength={4.5}
                autoCenterRepulsion={0}
                starSpeed={0.3}
                speed={1}
              />
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