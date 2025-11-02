import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSeriesDetail } from '@/components/LoadingStates';
import { useSeriesDetail, useArtworks, useProjects } from '@/hooks/usePortfolioData';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';

const MotionButton = motion(Button);

type WorkCard = {
  slug: string;
  title: string;
  description: string;
  href?: string;
  isInternal: boolean;
  thumbnail?: string;
  badge: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const { data: series, isLoading: isLoadingSeries } = useSeriesDetail(slug);
  const { data: artworks = [], isLoading: isLoadingArtworks } = useArtworks();
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();

  const isLoading = isLoadingSeries || isLoadingArtworks || isLoadingProjects;

  // Build work cards map from hooks data
  const workCardsMap = React.useMemo(() => {
    const artworkMap = artworks.reduce<Record<string, WorkCard>>((acc, artwork) => {
      acc[artwork.slug] = {
        slug: artwork.slug,
        title: artwork.title,
        description: artwork.description,
        href: `/art/${artwork.slug}`,
        isInternal: true,
        thumbnail: artwork.media?.[0]?.media_url,
        badge: 'Arte Digital',
      };
      return acc;
    }, {});

    const projectMap = projects.reduce<Record<string, WorkCard>>((acc, project) => {
      acc[project.slug] = {
        slug: project.slug,
        title: project.name,
        description: project.summary,
        href: project.url ?? project.repo_url,
        isInternal: false,
        thumbnail: project.thumbnail,
        badge: project.category,
      };
      return acc;
    }, {});

    return { ...projectMap, ...artworkMap };
  }, [artworks, projects]);

  if (isLoading) {
    return <LoadingSeriesDetail />;
  }

  if (!series) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Série não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            A coleção que procuras não está disponível. Volte ao portfolio e explore outras experiências criativas.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/portfolio">Ver Portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Extract work slugs from series.works array
  const workSlugs = series.works?.map(w => w.work_slug) ?? [];
  const works: WorkCard[] = workSlugs
    .map((workSlug) => workCardsMap[workSlug] || workCardsMap[slugify(workSlug)])
    .filter((card): card is WorkCard => Boolean(card));

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[var(--radius)] border border-border/60 bg-card/80 p-10 shadow-[0_45px_85px_-70px_hsl(var(--primary)/0.3)] backdrop-blur-xl"
        >
          <MotionButton
            asChild
            variant="ghost"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
            whileHover={prefersReducedMotion ? undefined : { x: -5 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to="/portfolio">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar ao Portfolio
            </Link>
          </MotionButton>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Layers className="h-4 w-4" aria-hidden />
              Série Criativa
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
                new Date(`${series.year}-01-01`),
              )}
            </motion.span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {series.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{series.description}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {works.map((work, index) => {
              const card = (
                <motion.div
                  className="flex h-full flex-col rounded-[var(--radius)] border border-border/70 bg-card/80 p-6 shadow-[0_35px_70px_-55px_hsl(var(--secondary)/0.3)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_55px_-35px_hsl(var(--primary)/0.3)]"
                  whileHover={prefersReducedMotion ? undefined : { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                >
                  {work.thumbnail && (
                    <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                      <img
                        src={work.thumbnail}
                        alt={`Arte ${work.title}`}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {work.badge}
                    </span>
                    {work.href && !work.isInternal && (
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" aria-hidden />
                    )}
                  </div>
                  <h2 className="mt-4 text-2xl font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                    {work.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground/90">{work.description}</p>
                </motion.div>
              );

              const commonClassName =
                'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

              return (
                <motion.div
                  key={work.slug}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  {work.isInternal ? (
                    <Link to={work.href ?? '#'} role="link" className={commonClassName}>
                      {card}
                    </Link>
                  ) : (
                    <a
                      href={work.href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={commonClassName}
                    >
                      {card}
                    </a>
                  )}
                </motion.div>
              );
            })}
            {works.length === 0 && (
              <div className="col-span-full rounded-[var(--radius)] border border-border/60 bg-background/60 p-8 text-center text-sm text-muted-foreground">
                Novas obras para esta série serão adicionadas em breve.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}