import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageMetadata } from './LanguageMetadata';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { BackgroundScene } from '@/components/background/BackgroundScene';

export default function Layout() {
  useScrollToTop();

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <LanguageMetadata />
      <BackgroundScene />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/35 via-background/80 to-background" aria-hidden />
      <Navbar />
      <main className="relative z-0 flex-grow pt-24 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
