import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { calculateReadingTime } from '@/lib/content';
import { MotionDiv } from '@/components/MotionDiv'; // Import MotionDiv
import { AnimatedLink } from '@/components/AnimatedLink'; // Import AnimatedLink
import { AnimatedButton } from '@/components/AnimatedButton'; // Import AnimatedButton

export default function Thoughts() {
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-5xl">
        <MotionDiv
          delay={0}
          duration={0.6}
          yOffset={20}
        >
          <AnimatedLink
            as={Link}
            to="/"
            variant="ghost"
            className="mb-8 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
            hoverScale={1}
            tapScale={0.98}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Voltar para o Início
          </AnimatedLink>

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
                <MotionDiv
                  key={thought.slug}
                  delay={index * 0.1}
                  duration={0.45}
                  yOffset={30}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  className="group flex h-full flex-col rounded-[var(--radius)] border border-border/70 bg-card/70 p-8 shadow-[0_35px_65px_-55px_rgba(var(--primary-hsl)/0.3)] backdrop-blur-xl"
                >
                  <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <MotionDiv
                      as="span"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
                      whileHoverScale={1.05}
                      whileTapScale={0.95}
                      initial={false}
                      animate={{}}
                    >
                      <Calendar className="h-3 w-3" aria-hidden />
                      {formattedDate}
                    </MotionDiv>
                    <MotionDiv
                      as="span"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
                      whileHoverScale={1.05}
                      whileTapScale={0.95}
                      initial={false}
                      animate={{}}
                    >
                      <BookOpen className="h-3 w-3" aria-hidden />
                      {readingTime} min
                    </MotionDiv>
                  </div>

                  <h2 className="text-3xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    {thought.title}
                  </h2>

                  <p className="mt-4 text-base text-muted-foreground/90">
                    {thought.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2" aria-label="Etiquetas desta reflexão">
                    {thought.tags.map((tag) => (
                      <MotionDiv
                        key={`${thought.slug}-${tag}`}
                        as="span"
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                        whileHoverScale={1.05}
                        whileTapScale={0.95}
                        initial={false}
                        animate={{}}
                      >
                        <Tag className="h-3 w-3" aria-hidden />
                        {tag}
                      </MotionDiv>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <AnimatedLink
                      as={Link}
                      to={`/thoughts/${thought.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/70 hover:text-primary"
                      hoverScale={1.02}
                      tapScale={0.98}
                    >
                      Ler Reflexão Completa
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </AnimatedLink>
                  </div>
                </MotionDiv>
              );
            })}
          </div>

          <MotionDiv
            delay={0}
            duration={0.6}
            yOffset={20}
            className="mt-16 flex flex-col items-center gap-4 rounded-[var(--radius)] border border-border/60 bg-background/40 p-8 text-center shadow-[0_35px_70px_-60px_rgba(var(--secondary-hsl)/0.3)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Monynha Softwares Journal</p>
            <p className="text-2xl font-display font-semibold text-foreground">
              Ideias, processos criativos e bastidores das experiências imersivas.
            </p>
            <AnimatedButton asChild className="rounded-full bg-gradient-to-r from-secondary/70 to-primary/70 px-6 py-2 text-sm">
              <Link to="/contact">Partilhar um pensamento comigo</Link>
            </AnimatedButton>
          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  );
}