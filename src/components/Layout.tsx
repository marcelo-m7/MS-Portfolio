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
      <div className="block">
        {/* Set z-index to -10 so it sits behind the main content layers */}
        <div className="fixed inset-0 w-full h-full -z-10"> 
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
      {/* Main content wrapper: Set z-index higher than background, but allow mouse events to pass through */}
      <main className="flex-grow pt-24 pb-16 relative z-10 pointer-events-none">
        {/* Outlet content: Re-enable pointer events for interactive elements */}
        <div className="pointer-events-auto">
          <Outlet />
        </div>
      </main>
      {/* Footer: Apply the same pointer-events logic */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}