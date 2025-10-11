import { Link, useParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, Tag } from 'lucide-react';
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

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const thought = cvData.thoughts.find((item) => item.slug === slug);

  if (!thought) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Conteúdo não encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Não encontramos esta reflexão. Volte para a coleção de pensamentos e explore outras ideias.
          </p>
          <AnimatedLink as={Link} to="/thoughts" className="mt-8 rounded-full">
            Ver todos os pensamentos
          </AnimatedLink>
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
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-3xl">
        <MotionDiv
          delay={0}
          duration={0.6}
          yOffset={24}
          className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-8 shadow-[0_45px_85px_-70px_rgba(var(--primary-hsl)/0.3)] backdrop-blur-xl"
        >
          <AnimatedLink
            as={Link}
            to="/thoughts"
            variant="ghost"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
            hoverScale={1}
            tapScale={0.98}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar para os Pensamentos
          </AnimatedLink>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground uppercase tracking-wide">
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

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {thought.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{thought.excerpt}</p>

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

          <article className="mt-8 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground">
            <ReactMarkdown>{thought.body}</ReactMarkdown>
          </article>

          <footer className="mt-12 rounded-[var(--radius)] border border-border/60 bg-background/60 p-6">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Escrito por</p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={cvData.profile.avatar}
                alt={cvData.profile.name}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-base font-semibold text-foreground">{cvData.profile.name}</p>
                <p className="text-sm text-muted-foreground">{cvData.profile.headline}</p>
              </div>
            </div>
          </footer>
        </MotionDiv>
      </div>
    </div>
  );
}