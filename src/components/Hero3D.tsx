import { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const HeroCanvas = lazy(() => import('./HeroCanvas'));
const FaultyTerminalBackground = lazy(() => import('./FaultyTerminal'));
const GridDistortionBackground = lazy(() => import('./GridDistortion'));

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
          <stop offset="0%" stopColor="hsl(var(--glow-purple) / 0.55)" />
          <stop offset="50%" stopColor="hsl(var(--glow-blue) / 0.35)" />
          <stop offset="100%" stopColor="hsl(var(--glow-pink) / 0.45)" />
        </linearGradient>
      </defs>
      <path
        d="M60 180C60 90 160 20 240 20s180 70 180 160-80 120-160 100S60 270 60 180Z"
        fill="url(#heroGradient)"
        opacity="0.65"
      />
      <circle cx="120" cy="110" r="40" fill="hsl(var(--glow-blue) / 0.4)" />
      <circle cx="340" cy="220" r="60" fill="hsl(var(--glow-pink) / 0.35)" />
      <circle
        cx="250"
        cy="160"
        r="90"
        stroke="hsl(var(--glow-purple) / 0.45)"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  </div>
);

export default function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const heroBackground = import.meta.env.VITE_HERO_BACKGROUND?.toLowerCase();
  const isHero3DEnabled =
    import.meta.env.VITE_ENABLE_HERO_3D?.toLowerCase() === 'true' || heroBackground === '3d';
  const shouldUseGridDistortion =
    heroBackground === 'grid-distortion' || (!heroBackground && !isHero3DEnabled);
  const shouldUseFaultyTerminal = heroBackground === 'faulty-terminal';

  if (prefersReducedMotion || heroBackground === 'static') {
    return <StaticIllustration />;
  }

  if (shouldUseGridDistortion) {
    return (
      <Suspense fallback={<StaticIllustration />}>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <GridDistortionBackground
            grid={18}
            mouse={0.12}
            strength={0.18}
            relaxation={0.88}
            imageSrc="/images/artleo-hero.svg"
          />
        </div>
      </Suspense>
    );
  }

  if (shouldUseFaultyTerminal) {
    return (
      <Suspense fallback={<StaticIllustration />}>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <FaultyTerminalBackground
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={0.9}
            noiseAmp={1}
            chromaticAberration={0.0015}
            dither={0.6}
            curvature={0.08}
            tint="#a5f3fc"
            mouseStrength={0.25}
            pageLoadAnimation
            brightness={1.05}
          />
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<StaticIllustration />}>
      <HeroCanvas />
    </Suspense>
  );
}
