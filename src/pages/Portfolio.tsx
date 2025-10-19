import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import cvData from '../../public/data/cv.json';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import ArtworkCard from '@/components/ArtworkCard';
import SeriesCard from '@/components/SeriesCard';

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
  const [filter, setFilter] = useState<string>('Todos');
  const prefersReducedMotion = useReducedMotion();
  const projects = cvData.projects as CVProject[];
  const artworks = cvData.artworks as CVArtwork[];
  const seriesEntries = cvData.series as CVSeries[];

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const previousTitle = document.title;
    document.title = 'Portfólio · Monynha Softwares';

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
      'Portfólio oficial da Monynha Softwares com produtos digitais, iniciativas de IA, infraestrutura e experiências criativas.',
    );

    return () => {
      document.title = previousTitle;
      if (createdMeta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, []);

  const categories = useMemo(
    () => [
      'Todos',
      ...new Set(projects.map((p) => p.category)),
      'Arte Digital',
      'Série Criativa',
    ],
    [projects],
  );

  const filteredItems = useMemo<PortfolioEntry[]>(() => {
    let items: Array<CVProject | CVArtwork | CVSeries> = [];
    if (filter === 'Todos') {
      items = [...projects, ...artworks, ...seriesEntries];
    } else if (filter === 'Arte Digital') {
      items = artworks;
    } else if (filter === 'Série Criativa') {
      items = seriesEntries;
    } else {
      items = projects.filter((p) => p.category === filter);
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
            Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Projetos, arte digital e séries criativas do ecossistema Monynha
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
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={`border-border/70 transition ${
                filter === category
                  ? 'bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground'
                  : 'hover:border-primary/60 hover:text-primary'
              }`}
            >
              {category}
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
              Nenhum item encontrado nesta categoria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}