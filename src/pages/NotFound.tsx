import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center px-6 py-0">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl rounded-[var(--radius)] border border-border/60 bg-card/70 p-10 text-center shadow-[0_45px_85px_-70px_rgba(56,189,248,0.3)] backdrop-blur-xl"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Error 404</p>
        <h1 className="mt-4 text-5xl font-display font-bold">Page Not Found</h1>
        <p className="mt-4 text-base text-muted-foreground">
          The path <span className="font-mono text-primary">{location.pathname}</span> does not exist. Return to the homepage to continue exploring the Monynha universe.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            asChild
            className="rounded-full"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;