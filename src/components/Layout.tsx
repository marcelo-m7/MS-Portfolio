import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LiquidEther from './LiquidEther'; // Import LiquidEther

export default function Layout() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 w-full h-full -z-20">
        <LiquidEther
          colors={[ '#7C3AED', '#0EA5E9', '#EC4899' ]} // Using your theme's primary, secondary, accent colors
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
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
      <main className="flex-grow pt-24 pb-16 relative z-0"> {/* Added padding for Navbar and Footer */}
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <Footer />
    </div>
  );
}