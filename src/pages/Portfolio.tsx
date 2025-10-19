import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import ArtworkCard from '@/components/ArtworkCard';
import SeriesCard from '@/components/SeriesCard';
import { useTranslations } from '@/hooks/useTranslations';
import { useCvData } from '@/hooks/useCvData';

type CVProject = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  url?: string | null;
  domain?: string | null;
  repoUrl: string;
  thumbnail: string;
  category: string;
  status?: string;
  visibility?: string;
  year: number;
  fullDescription?: string;
};

type CVArtwork = {
  slug: string;
  title: string;
  description: string;
  media: string[];
  materials: string[];
  year: number;
};

type CVSeries = {
  slug: string;
  title: string;
  description: string;
  works: string[];
  year: number;
};

type PortfolioEntry =
  | (CVProject & { type: 'project' })
  | (CVArtwork & { type: 'artwork' })
  | (CVSeries & { type: 'series' });

export default function Portfolio() {
  const { t } = useTranslations();
  const cvData = useCvData();
  const [filter, setFilter] = useState<string>('all');
  const prefersReducedMotion = useReducedMotion();
  const projects = cvData.projects as CVProject[];
  const artworks = cvData.artworks as CVArtwork[];
  const seriesEntries = cvData.series as CVSeries[];

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const previousTitle = document.title;
    const pageTitle = `${t('Portfolio.title')} · Monynha Softwares`;
    document.title = pageTitle;

    const descriptionSelector = 'meta[name="description"]';
    const existingMeta = document.querySelector<HTMLMetaElement>(
      descriptionSelector,
    );
    const createdMeta = !existingMeta;
    const meta = existingMeta ?? document.createElement('meta');
    const previousDescription = meta.getAttribute('content') ?? '';

    if (!existingMeta) {
      meta.name = 'description';
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      'content',
      t('Portfolio.metaDescription'),
    );

    return () => {
      document.title = previousTitle;
      if (createdMeta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [t]);

  const dynamicCategories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).map((category) => ({
      key: `category:${category}`,
      label: category,
    })),
    [projects],
  );

  const categories = useMemo(
    () => [
      { key: 'all', label: t('Portfolio.filters.all') },
      ...dynamicCategories,
      { key: 'artwork', label: t('Portfolio.filters.digitalArt') },
      { key: 'series', label: t('Portfolio.filters.creativeSeries') },
    ],
    [dynamicCategories, t],
  );

  const filteredItems = useMemo<PortfolioEntry[]>(() => {
    let items: Array<CVProject | CVArtwork | CVSeries> = [];
    if (filter === 'all') {
      items = [...projects, ...artworks, ...seriesEntries];
    } else if (filter === 'artwork') {
      items = artworks;
    } else if (filter === 'series') {
      items = seriesEntries;
    } else if (filter.startsWith('category:')) {
      const category = filter.replace('category:', '');
      items = projects.filter((p) => p.category === category);
    }

    return items.map((item) => {
      if ('materials' in item) return { ...item, type: 'artwork' } as PortfolioEntry;
      if ('works' in item) return { ...item, type: 'series' } as PortfolioEntry;
      return { ...item, type: 'project' } as PortfolioEntry;
    });
  }, [artworks, filter, projects, seriesEntries]);

  return (
    <div className="px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            {t('Portfolio.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('Portfolio.subtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={filter === category.key ? 'default' : 'outline'}
              onClick={() => setFilter(category.key)}
              className={`rounded-full border-border/70 transition ${
                filter === category.key
                  ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white'
                  : 'hover:border-primary/60 hover:text-primary'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Dynamic Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            if (item.type === 'project') {
              return <ProjectCard key={item.slug} project={item} index={index} />;
            }
            if (item.type === 'artwork') {
              return <ArtworkCard key={item.slug} artwork={item} index={index} />;
            }
            if (item.type === 'series') {
              return <SeriesCard key={item.slug} series={item} index={index} />;
            }
            return null;
          })}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              {t('Portfolio.empty')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}