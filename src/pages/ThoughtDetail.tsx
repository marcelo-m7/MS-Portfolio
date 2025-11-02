import { useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, BookOpen, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LoadingThoughtDetail } from '@/components/LoadingStates';
import { useThought, useProfile } from '@/hooks/usePortfolioData';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { calculateReadingTime } from '@/lib/content';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import BackButton from '@/components/shared/BackButton';
import NotFoundState from '@/components/shared/NotFoundState';
import MetadataBadge from '@/components/shared/MetadataBadge';

export default function ThoughtDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const t = useTranslations();
  const { data: thought, isLoading: isLoadingThought } = useThought(slug ?? '');
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  
  // Translate content
  const notFoundMessage = useTranslatedText('Não encontramos esta reflexão. Volte para a coleção de pensamentos e explore outras ideias.');
  const translatedContent = useTranslatedText((thought?.body as string) ?? '');

  const isLoading = isLoadingThought || isLoadingProfile;

  if (isLoading) {
    return <LoadingThoughtDetail />;
  }

  if (!thought) {
    return (
      <NotFoundState
        message={notFoundMessage}
        backTo="/thoughts"
        backLabel={t.thoughts.backToThoughts}
      />
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
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-8 shadow-[0_45px_85px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl"
        >
          <BackButton to="/thoughts" label={t.thoughts.backToThoughts} />

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MetadataBadge icon={Calendar}>
              {formattedDate}
            </MetadataBadge>
            <MetadataBadge icon={BookOpen}>
              {readingTime} {t.thoughts.minutesRead}
            </MetadataBadge>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {thought.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{thought.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Etiquetas desta reflexão">
            {thought.tags.map((tag) => (
              <MetadataBadge key={`${thought.slug}-${tag}`} icon={Tag}>
                {tag}
              </MetadataBadge>
            ))}
          </div>

          <article className="mt-8 space-y-6 text-base leading-relaxed text-foreground/90 prose prose-invert prose-p:text-foreground/90 prose-strong:text-foreground">
            <ReactMarkdown>{translatedContent}</ReactMarkdown>
          </article>

          {profile && (
            <footer className="mt-12 rounded-[var(--radius)] border border-border/60 bg-background/60 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Escrito por</p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={profile.avatar ?? ''}
                  alt={profile.name}
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-base font-semibold text-foreground">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.headline}</p>
                </div>
              </div>
            </footer>
          )}
        </motion.div>
      </div>
    </div>
  );
}