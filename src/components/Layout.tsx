import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LiquidEther from './LiquidEther';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useThemePalette } from '@/hooks/useThemePalette';

export default function Layout() {
  useScrollToTop();
  const themeColors = useThemePalette();

  return (
    <div className="relative flex flex-col min-h-[100dvh]">
      {/* LiquidEther Background */}
      <div className="hidden md:block">
        <div className="fixed inset-0 w-full h-full -z-20">
          <LiquidEther
            // Removed key={location.pathname} to prevent remounting and state reset on route changes
            colors={themeColors}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            dt={0.014}
            BFECC={true}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
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