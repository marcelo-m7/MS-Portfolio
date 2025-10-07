import { lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const FaultyTerminal = lazy(() => import('./visuals/FaultyTerminal'));

const StaticBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
    <div className="h-64 w-64 rounded-full bg-gradient-to-r from-secondary/40 via-primary/40 to-accent/40 blur-3xl" />
  </div>
);

export function FaultyTerminalBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <StaticBackdrop />;
  }

  return (
    <Suspense fallback={<StaticBackdrop />}>
      <FaultyTerminal className="pointer-events-none absolute inset-0 -z-10" />
    </Suspense>
  );
}

export default FaultyTerminalBackground;
