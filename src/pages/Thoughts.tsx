import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cvData from '../../public/data/cv.json';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { calculateReadingTime } from '@/lib/content';

export default function Thoughts() {
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-8 border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Voltar para o Início
            </Link>
          </Button>

          <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Pensamentos
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reflexões curtas sobre tecnologia, acessibilidade e arte digital direto do laboratório Monynha.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {cvData.thoughts.map((thought, index) => {
              const formattedDate = new Intl.DateTimeFormat(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date(thought.date));
              const readingTime = calculateReadingTime(thought.body);

              return (
                <motion.article
                  key={thought.slug}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.45 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4, boxShadow: '0 16px 32px -24px rgba(16,24,40,0.35)' }}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/90 p-8 shadow-md backdrop-blur"
                >
                  <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {formattedDate}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1">
                      <BookOpen className="h-3 w-3" aria-hidden />
                      {readingTime} min
                    </span>
                  </div>

                  <h2 className="text-3xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    {thought.title}
                  </h2>

                  <p className="mt-4 text-base text-muted-foreground/90">
                    {thought.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2" aria-label="Etiquetas desta reflexão">
                    {thought.tags.map((tag) => (
                      <span
                        key={`${thought.slug}-${tag}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        <Tag className="h-3 w-3" aria-hidden />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      to={`/thoughts/${thought.slug}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Ler Reflexão Completa
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-8 text-center shadow-md">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Monynha Softwares Journal</p>
            <p className="text-2xl font-display font-semibold text-foreground">
              Ideias, processos criativos e bastidores das experiências imersivas.
            </p>
            <Button asChild className="bg-gradient-to-r from-secondary/75 to-primary/75 px-6 py-2 text-sm">
              <Link to="/contact">Partilhar um pensamento comigo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}