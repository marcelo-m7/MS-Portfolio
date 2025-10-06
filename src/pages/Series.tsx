import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';

export default function Series() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-8 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Voltar ao portfolio
            </Link>
          </Button>

          <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Séries criativas
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Coleções que reúnem narrativas, experiências e tecnologias exploradas pelo laboratório Monynha.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {cvData.series.map((serie, index) => (
              <motion.article
                key={serie.slug}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card/70 p-8 shadow-[0_40px_75px_-60px_rgba(56,189,248,0.75)] backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                    <Calendar className="h-3 w-3" aria-hidden />
                    {serie.year}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                    {serie.works.length} obras
                  </span>
                </div>

                <h2 className="mt-6 text-3xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                  {serie.title}
                </h2>

                <p className="mt-4 text-base text-muted-foreground/90">
                  {serie.description}
                </p>

                <div className="mt-auto pt-6">
                  <Link
                    to={`/series/${serie.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Ver série completa
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
