import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, useCallback, memo } from 'react';
import { useProjects, useArtworks, useSeries } from '@/hooks/usePortfolioData';
import type { Tables as DBTables } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import ArtworkCard from '@/components/ArtworkCard';
import SeriesCard from '@/components/SeriesCard';
import { LoadingPortfolioGrid } from '@/components/LoadingStates';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';
import { useSeoMetadata } from '@/hooks/useSeoMetadata';

const FilterButton = memo(({ category, isActive, onClick }: { category: string; isActive: boolean; onClick: () => void }) => (
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

  useSeoMetadata({
    title: 'Portfólio · Marcelo Santos / Monynha Softwares',
    description: 'Projetos, arte digital, infraestrutura e produtos do ecossistema Monynha apresentados com foco em performance e escalabilidade.',
    path: '/portfolio',
  });

  type DBProject = DBTables<'projects'> & { technologies?: Array<{ name: string | null; category: string | null }> };
  const projects = useMemo<CVProject[]>(() => {
    return (dbProjects as DBProject[] | undefined ?? []).map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.summary,
      stack: (p.technologies ?? []).map((item) => item?.name).filter(Boolean) as string[],
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


  const categories = useMemo(() => {
    const base = [t.portfolio.filterAll, ...projects.map((p) => p.category), t.portfolio.filterDigitalArt, t.portfolio.filterCreativeSeries];
    return Array.from(new Set(base));
  }, [projects, t]);

  const handleFilterChange = useCallback((category: string) => setFilter(category), []);

  const filteredItems = useMemo<PortfolioEntry[]>(() => {
    let items: Array<CVProject | CVArtwork | CVSeries> = [];
    if (filter === t.portfolio.filterAll) items = [...projects, ...artworks, ...seriesEntries];
    else if (filter === t.portfolio.filterDigitalArt) items = artworks;
    else if (filter === t.portfolio.filterCreativeSeries) items = seriesEntries;
    else items = projects.filter((p) => p.category === filter);

    return items.map((item) => {
      if ('materials' in item) return { ...item, type: 'artwork' } as PortfolioEntry;
      if ('works' in item) return { ...item, type: 'series' } as PortfolioEntry;
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
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Marcelo Santos / Monynha Softwares</p>
          <h1 className="mt-4 text-5xl font-bold md:text-6xl">Portfolio</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{pageSubtitle}</p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => (
            <FilterButton key={category} category={category} isActive={filter === category} onClick={() => handleFilterChange(category)} />
          ))}
        </motion.div>

        {loadingProjects || loadingArtworks || loadingSeries ? (
          <LoadingPortfolioGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-8 items-stretch md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              if (item.type === 'project') return <ProjectCard key={`project-${item.slug}`} project={item} index={index} />;
              if (item.type === 'artwork') return <ArtworkCard key={`artwork-${item.slug}`} artwork={item} index={index} />;
              if (item.type === 'series') return <SeriesCard key={`series-${item.slug}`} series={item} index={index} />;
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
