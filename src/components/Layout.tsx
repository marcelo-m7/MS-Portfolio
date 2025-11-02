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
                mouseRepulsion
                mouseInteraction
                density={1.5}
                glowIntensity={0.5}
                saturation={0.8}
                hueShift={240}
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