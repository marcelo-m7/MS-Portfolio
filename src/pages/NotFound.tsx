import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionDiv } from '@/components/MotionDiv'; // Import MotionDiv
import { AnimatedLink } from '@/components/AnimatedLink'; // Import AnimatedLink

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
      <MotionDiv
        delay={0}
        duration={0.6}
        yOffset={20}
        className="w-full max-w-xl rounded-[var(--radius)] border border-border/60 bg-card/70 p-10 text-center shadow-[0_45px_85px_-70px_rgba(var(--secondary-hsl)/0.3)] backdrop-blur-xl"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Erro 404</p>
        <h1 className="mt-4 text-5xl font-display font-bold">Página não encontrada</h1>
        <p className="mt-4 text-base text-muted-foreground">
          O caminho <span className="font-mono text-primary">{location.pathname}</span> não existe. Volte à página inicial para continuar a explorar o universo Monynha.
        </p>
        <div className="mt-8 flex justify-center">
          <AnimatedLink
            as={Link}
            to="/"
            className="rounded-full"
            hoverScale={1.02}
            tapScale={0.98}
          >
            Voltar para o Início
          </AnimatedLink>
        </div>
      </MotionDiv>
    </div>
  );
};

export default NotFound;