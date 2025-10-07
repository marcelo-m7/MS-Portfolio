import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { calculateReadingTime } from '@/lib/content';

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const thought = cvData.thoughts.find((item) => item.slug === slug);

  if (!thought) {
    return (
      <div className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Conteúdo não encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Não encontramos esta reflexão. Volta para a coleção de pensamentos e explora outras ideias.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/thoughts">Ver todos os pensamentos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(thought.date));
  const readingTime = calculateReadingTime(thought.body);

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-[0_45px_85px_-70px_hsl(var(--primary)/0.85)] backdrop-blur-xl"
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <Link to="/thoughts">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar para os pensamentos
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              <Calendar className="h-3 w-3" aria-hidden />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
              <BookOpen className="h-3 w-3" aria-hidden />
              {readingTime} min
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {thought.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{thought.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Etiquetas desta reflexão">
            {thought.tags.map((tag) => (
              <span
                key={`${thought.slug}-${tag}`}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <Tag className="h-3 w-3" aria-hidden />
                {tag}
              </span>
            ))}
          </div>

          <article className="mt-8 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground">
            <ReactMarkdown>{thought.body}</ReactMarkdown>
          </article>

          <footer className="mt-12 rounded-2xl border border-border/60 bg-background/60 p-6">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Escrito por</p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={cvData.profile.avatar}
                alt={cvData.profile.name}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-base font-semibold text-foreground">{cvData.profile.name}</p>
                <p className="text-sm text-muted-foreground">{cvData.profile.headline}</p>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
