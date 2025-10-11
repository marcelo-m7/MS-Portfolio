import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './Navbar';
import Footer from './Footer';
import LiquidEther from './LiquidEther';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function Layout() {
  useScrollToTop();
  const location = useLocation(); // Get the current location

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 w-full h-full -z-20">
        <LiquidEther
          key={location.pathname} {/* Add key prop based on pathname */}
          colors={[ '#7C3AED', '#0EA5E9', '#EC4899' ]} // Using your theme's primary, secondary, accent colors
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
      
      <Navbar />
      <main className="flex-grow pt-24 pb-16 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}