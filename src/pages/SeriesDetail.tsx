import { Link, useParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, Layers, ExternalLink } from 'lucide-react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import {
  languageToLocale,
  useCurrentLanguage,
} from '@/hooks/useCurrentLanguage';
import { slugify } from '@/lib/utils';
import { MotionDiv } from '@/components/MotionDiv'; // Import MotionDiv
import { AnimatedLink } from '@/components/AnimatedLink'; // Import AnimatedLink

type WorkCard = {
  slug: string;
  title: string;
  description: string;
  href?: string;
  isInternal: boolean;
  thumbnail?: string;
  badge: string;
};

const buildWorkCards = (): Record<string, WorkCard> => {
  const artworkMap = cvData.artworks.reduce<Record<string, WorkCard>>(
    (acc, artwork) => {
      acc[artwork.slug] = {
        slug: artwork.slug,
        title: artwork.title,
        description: artwork.description,
        href: `/art/${artwork.slug}`,
        isInternal: true,
        thumbnail: artwork.media?.[0],
        badge: 'Arte Digital',
      };
      return acc;
    },
    {},
  );

  const projectMap = cvData.projects.reduce<Record<string, WorkCard>>(
    (acc, project) => {
      const key = project.slug || slugify(project.name);
      acc[key] = {
        slug: key,
        title: project.name,
        description: project.summary,
        href: project.url,
        isInternal: false,
        thumbnail: project.thumbnail,
        badge: project.category,
      };
      return acc;
    },
    {},
  );

  return { ...projectMap, ...artworkMap };
};

const WORK_CARDS = buildWorkCards();

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const locale = languageToLocale(language);
  const series = cvData.series.find((entry) => entry.slug === slug);

  if (!series) {
    return (
      <div className="py-0 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-display font-bold text-primary">Série não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            A coleção que procuras não está disponível. Volte ao portfolio e explore outras experiências criativas.
          </p>
          <AnimatedLink as={Link} to="/portfolio" className="mt-8 rounded-full">
            Ver Portfolio
          </AnimatedLink>
        </div>
      </div>
    );
  }

  const works: WorkCard[] = series.works
    .map((workSlug) => WORK_CARDS[workSlug] || WORK_CARDS[slugify(workSlug)])
    .filter((card): card is WorkCard => Boolean(card));

  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-5xl">
        <MotionDiv
          delay={0}
          duration={0.6}
          yOffset={24}
          className="rounded-[var(--radius)] border border-border/60 bg-card/70 p-10 shadow-[0_45px_85px_-70px_rgba(var(--primary-hsl)/0.3)] backdrop-blur-xl"
        >
          <AnimatedLink
            as={Link}
            to="/portfolio"
            variant="ghost"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm text-muted-foreground transition hover:text-primary"
            hoverScale={1}
            tapScale={0.98}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao Portfolio
          </AnimatedLink>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <MotionDiv
              as="span"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHoverScale={1.05}
              whileTapScale={0.95}
              initial={false}
              animate={{}}
            >
              <Layers className="h-4 w-4" aria-hidden />
              Série Criativa
            </MotionDiv>
            <MotionDiv
              as="span"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1"
              whileHoverScale={1.05}
              whileTapScale={0.95}
              initial={false}
              animate={{}}
            >
              {new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
                new Date(`${series.year}-01-01`),
              )}
            </MotionDiv>
          </div>

          <h1 className="mt-6 text-4xl font-display font-semibold text-foreground">
            {series.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground/90">{series.description}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {works.map((work, index) => {
              const card = (
                <MotionDiv
                  className="flex h-full flex-col rounded-[var(--radius)] border border-border/70 bg-card/70 p-6 shadow-[0_35px_70px_-55px_rgba(var(--secondary-hsl)/0.3)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_55px_-35px_rgba(var(--primary-hsl)/0.3)]"
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  initial={false}
                  animate={{}}
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
                        className="h-40 w-full object-cover"
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
                </MotionDiv>
              );

              const commonClassName =
                'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

              return (
                <MotionDiv
                  key={work.slug}
                  delay={index * 0.08}
                  duration={0.5}
                  yOffset={20}
                >
                  {work.isInternal ? (
                    <AnimatedLink to={work.href ?? '#'} role="link" className={commonClassName} hoverScale={1} tapScale={0.99}>
                      {card}
                    </AnimatedLink>
                  ) : (
                    <AnimatedLink
                      as="a"
                      href={work.href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={commonClassName}
                      hoverScale={1}
                      tapScale={0.99}
                    >
                      {card}
                    </AnimatedLink>
                  )}
                </MotionDiv>
              );
            })}
            {works.length === 0 && (
              <div className="col-span-full rounded-[var(--radius)] border border-border/60 bg-background/60 p-8 text-center text-sm text-muted-foreground">
                Novas obras para esta série serão adicionadas em breve.
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}