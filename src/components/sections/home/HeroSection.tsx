import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LINKS } from '@/lib/siteLinks';
import { siteConfig } from '@/config/site';

interface HeroSectionProps {
  loadingProfile: boolean;
  location?: string;
  name?: string;
  headline?: string;
  bio?: string;
  exploreLabel: string;
  contactLabel: string;
}

export const HeroSection = memo(function HeroSection({
  loadingProfile,
  location,
  name,
  headline,
  bio,
  exploreLabel,
  contactLabel,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }),
    [],
  );

  return (
    <section className="relative min-h-[calc(100dvh-8rem)] overflow-hidden py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--secondary)/0.14),_transparent_34%),radial-gradient(circle_at_80%_20%,_hsl(var(--accent)/0.12),_transparent_26%)]" />
      <div className="container relative z-10 mx-auto flex min-h-[calc(100dvh-8rem)] items-center px-6">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
          className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]"
        >
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              {loadingProfile ? <Skeleton className="h-4 w-24" /> : <span className="text-sm font-medium">{location}</span>}
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
              {siteConfig.brand.accentLabel}
            </motion.p>

            <motion.h1 variants={itemVariants} className="mt-4 text-balance text-5xl font-bold md:text-7xl">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {loadingProfile ? <span className="inline-block h-10 w-40 rounded-md bg-muted" aria-hidden /> : name}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 text-xl font-medium text-muted-foreground md:text-2xl">
              {loadingProfile ? <span className="inline-block h-6 w-72 rounded-md bg-muted" aria-hidden /> : headline}
            </motion.p>

            <motion.p variants={itemVariants} className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground/85 lg:max-w-2xl">
              {loadingProfile ? <span className="inline-block h-5 w-80 rounded-md bg-muted" aria-hidden /> : bio}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:justify-start justify-center">
              <Button asChild size="lg" className="px-8 shadow-lg shadow-secondary/20">
                <Link to="/portfolio"><Code2 className="mr-2 h-4 w-4" />{exploreLabel}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border/70 bg-card/60 px-8">
                <Link to="/contact">{contactLabel}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-8 shadow-lg shadow-accent/20">
                <a href={LINKS.monynhaSite} target="_blank" rel="noopener noreferrer"><Globe className="mr-2 h-4 w-4" />Monynha Softwares<ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </motion.div>
          </div>

          <motion.aside variants={itemVariants} className="rounded-3xl border border-border/60 bg-card/75 p-6 text-left shadow-[0_30px_80px_-60px_hsl(var(--primary)/0.45)] backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Assinatura</p>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">{siteConfig.signature}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Produto pessoal com arquitetura pensada para reaproveitamento no ecossistema Monynha, combinando branding institucional, experimentação criativa e foco rigoroso em performance.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Foco</p>
                <p className="mt-2 text-sm font-medium">Performance, dados dinâmicos e UX confiável</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Base</p>
                <p className="mt-2 text-sm font-medium">Vite + React + TypeScript + Tailwind + shadcn/ui</p>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
});
