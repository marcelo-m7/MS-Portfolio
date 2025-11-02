import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { useProjects, useArtworks, useSeries } from '@/hooks/usePortfolioData';
import type { Tables as DBTables } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import ArtworkCard from '@/components/ArtworkCard';
import SeriesCard from '@/components/SeriesCard';
import { LoadingPortfolioGrid } from '@/components/LoadingStates';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';

// Memoized filter button component to prevent re-renders
const FilterButton = memo(({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <Button
    variant={isActive ? 'default' : 'outline'}
    onClick={onClick}
    className={`border-border/70 transition ${
      isActive
        ? 'bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground'
        : 'hover:border-primary/60 hover:text-primary'
    }`}
  >
    {category}
  </Button>
));

FilterButton.displayName = 'FilterButton';

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
  media: string[] | Array<{ media_url?: string | null }>;
  materials: string[] | Array<{ material?: string | null }>;
  year: number;
  url3d?: string;
};

type CVSeries = {
  slug: string;
  title: string;
  description: string;
  works: string[] | Array<{ work_slug?: string | null }>;
  year: number;
};

type PortfolioEntry =
  | (CVProject & { type: 'project' })
  | (CVArtwork & { type: 'artwork' })
  | (CVSeries & { type: 'series' });

export default function Portfolio() {
  const t = useTranslations();
  const [filter, setFilter] = useState<string>(t.portfolio.filterAll);
  const prefersReducedMotion = useReducedMotion();
  const pageSubtitle = useTranslatedText('Projetos, arte digital e séries criativas do ecossistema Monynha');
  const { data: dbProjects, isLoading: loadingProjects } = useProjects();
  const { data: dbArtworks, isLoading: loadingArtworks } = useArtworks();
  const { data: dbSeries, isLoading: loadingSeries } = useSeries();

  // Map DB-shaped data to the UI shapes expected by the existing cards
  type DBProject = DBTables<'projects'> & {
    technologies?: Array<{ name: string | null; category: string | null }>;
  };
  const projects = useMemo<CVProject[]>(() => {
    return (dbProjects as DBProject[] | undefined ?? []).map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.summary,
      stack: (p.technologies ?? []).map((t) => t?.name).filter(Boolean) as string[],
      url: p.url ?? null,
      domain: p.domain ?? null,
      repoUrl: p.repo_url ?? '',
      thumbnail: p.thumbnail ?? '',
      category: p.category ?? 'Projeto',
      status: p.status ?? undefined,
      visibility: p.visibility ?? undefined,
      year: p.year ?? 0,
      fullDescription: p.full_description ?? undefined,
    }));
  }, [dbProjects]);

  type DBArtwork = DBTables<'artworks'> & {
    media?: Array<{ media_url: string | null; display_order: number | null }>;
    materials?: Array<{ material: string | null; display_order: number | null }>;
    url_3d?: string | null;
  };
  const artworks = useMemo<CVArtwork[]>(() => {
    return (dbArtworks as DBArtwork[] | undefined ?? []).map((a) => ({
      slug: a.slug!,
      title: a.title!,
      description: a.description ?? '',
      media: a.media ?? [],
      materials: a.materials ?? [],
      year: a.year ?? 0,
      url3d: a.url_3d ?? undefined,
    }));
  }, [dbArtworks]);

  type DBSeries = DBTables<'series'> & {
    works?: Array<{ work_slug: string | null; work_type: string | null; display_order: number | null }>;
  };
  const seriesEntries = useMemo<CVSeries[]>(() => {
    return (dbSeries as DBSeries[] | undefined ?? []).map((s) => ({
      slug: s.slug!,
      title: s.title!,
      description: s.description ?? '',
      works: s.works ?? [],
      year: s.year ?? 0,
    }));
  }, [dbSeries]);

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

  const categories = useMemo(() => {
    const base = [
      t.portfolio.filterAll,
      ...projects.map((p) => p.category),
      t.portfolio.filterDigitalArt,
      t.portfolio.filterCreativeSeries,
    ];
    return Array.from(new Set(base));
  }, [projects, t]);

  // Memoize filter change handler to prevent unnecessary re-renders
  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const filteredItems = useMemo<PortfolioEntry[]>(() => {
    let items: Array<CVProject | CVArtwork | CVSeries> = [];
    if (filter === t.portfolio.filterAll) {
      items = [...projects, ...artworks, ...seriesEntries];
    } else if (filter === t.portfolio.filterDigitalArt) {
      items = artworks;
    } else if (filter === t.portfolio.filterCreativeSeries) {
      items = seriesEntries;
    } else {
      items = projects.filter((p) => p.category === filter);
    }

    return items.map((item) => {
      // Check for materials property (unique to artwork)
      if ('materials' in item) return { ...item, type: 'artwork' } as PortfolioEntry;
      // Check for works property (unique to series)
      if ('works' in item) return { ...item, type: 'series' } as PortfolioEntry;
      // Otherwise it's a project
      return { ...item, type: 'project' } as PortfolioEntry;
    });
  }, [artworks, filter, projects, seriesEntries, t]);

  return (
    <div className="px-6 py-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          {categories.map((category) => (
            <FilterButton
              key={category}
              category={category}
              isActive={filter === category}
              onClick={() => handleFilterChange(category)}
            />
          ))}
        </motion.div>

        {/* Dynamic Content Grid */}
        {(loadingProjects || loadingArtworks || loadingSeries) ? (
          <LoadingPortfolioGrid count={6} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredItems.map((item, index) => {
                if (item.type === 'project') {
                  return <ProjectCard key={`project-${item.slug}`} project={item} index={index} />;
                }
                if (item.type === 'artwork') {
                  return <ArtworkCard key={`artwork-${item.slug}`} artwork={item} index={index} />;
                }
                if (item.type === 'series') {
                  return <SeriesCard key={`series-${item.slug}`} series={item} index={index} />;
                }
                return null;
              })}
            </div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">
                  Nenhum item encontrado nesta categoria.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}