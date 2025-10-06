import { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const HeroCanvas = lazy(() => import('./HeroCanvas'));

const StaticIllustration = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
    <svg
      width="480"
      height="320"
      viewBox="0 0 480 320"
      className="max-w-[80vw] text-secondary/40"
      role="img"
      aria-labelledby="hero-visual-title"
    >
      <title id="hero-visual-title">Forma abstrata representando criatividade digital</title>
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.55)" />
          <stop offset="50%" stopColor="rgba(14,165,233,0.35)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0.45)" />
        </linearGradient>
      </defs>
      <path
        d="M60 180C60 90 160 20 240 20s180 70 180 160-80 120-160 100S60 270 60 180Z"
        fill="url(#heroGradient)"
        opacity="0.65"
      />
      <circle cx="120" cy="110" r="40" fill="rgba(14,165,233,0.4)" />
      <circle cx="340" cy="220" r="60" fill="rgba(236,72,153,0.35)" />
      <circle cx="250" cy="160" r="90" stroke="rgba(124,58,237,0.45)" strokeWidth="6" fill="none" />
    </svg>
  </div>
);

export default function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const isHero3DEnabled =
    import.meta.env.VITE_ENABLE_HERO_3D?.toLowerCase() === 'true';

  if (prefersReducedMotion || !isHero3DEnabled) {
    return <StaticIllustration />;
  }

  return (
    <Suspense fallback={<StaticIllustration />}>
      <HeroCanvas />
    </Suspense>
  );
}
