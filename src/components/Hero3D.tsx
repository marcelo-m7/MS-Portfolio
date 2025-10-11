import { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import Prism from './Prism';

const isHero3DFlagEnabled =
  import.meta.env.VITE_ENABLE_HERO_3D?.toLowerCase() === 'true';
const isPrismBackgroundEnabled =
  import.meta.env.VITE_ENABLE_PRISM_BACKGROUND?.toLowerCase() === 'true';

const HeroCanvas = isHero3DFlagEnabled ? lazy(() => import('./HeroCanvas')) : null;

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
          <stop offset="0%" stopColor="hsla(350, 70%, 40%, 0.55)" />
          <stop offset="50%" stopColor="hsla(350, 60%, 50%, 0.35)" />
          <stop offset="100%" stopColor="hsla(350, 50%, 30%, 0.45)" />
        </linearGradient>
      </defs>
      <path
        d="M60 180C60 90 160 20 240 20s180 70 180 160-80 120-160 100S60 270 60 180Z"
        fill="url(#heroGradient)"
        opacity="0.65"
      />
      <circle cx="120" cy="110" r="40" fill="hsla(350, 60%, 50%, 0.4)" />
      <circle cx="340" cy="220" r="60" fill="hsla(350, 50%, 30%, 0.35)" />
      <circle cx="250" cy="160" r="90" stroke="hsla(350, 70%, 40%, 0.45)" strokeWidth="6" fill="none" />
    </svg>
  </div>
);

export default function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <StaticIllustration />;
  }

  if (isPrismBackgroundEnabled) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Prism
          animationType={prefersReducedMotion ? '3drotate' : 'hover'}
          timeScale={prefersReducedMotion ? 0.2 : 0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1.5}
          noise={0.6}
          glow={1.5}
          bloom={1.5}
          hoverStrength={prefersReducedMotion ? 0 : 2.5}
          inertia={0.08}
        />
      </div>
    );
  }

  if (isHero3DFlagEnabled) {
    const Canvas = HeroCanvas;
    return (
      <Suspense fallback={<StaticIllustration />}>
        <Canvas />
      </Suspense>
    );
  }

  return <StaticIllustration />;
}