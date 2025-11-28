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
  // NOTE: We call the hook but ignore the result to force the background to render
  // on all devices, overriding the performance optimization for low-end hardware.
  useDeviceCapabilities(); 

  return (
    <div className="relative flex flex-col min-h-[100dvh]">
      <LanguageMetadata />
      {/* Galaxy Background - Forced visibility on all devices */}
      <div className="block"> {/* Removed hidden md:block */}
        <div className="fixed inset-0 w-full h-full -z-20"> {/* Changed z-index from z-10 back to -z-20 */}
          <Suspense fallback={null}>
            <Galaxy
              mouseInteraction={true}
              mouseRepulsion={true}
              density={1}
              glowIntensity={0.3}
              saturation={0.5}
              hueShift={200}
              twinkleIntensity={0.8}
              rotationSpeed={0.01}
              repulsionStrength={2}
              autoCenterRepulsion={0}
              starSpeed={0.3}
              speed={1}
            />
          </Suspense>
        </div>
      </div>
      
      <Navbar />
      <main className="flex-grow pt-24 pb-16 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}