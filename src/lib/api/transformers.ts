import type { Tables } from '@/types/database.types';

export type PortfolioProjectRow = Tables<'portfolio_projects'>;

export interface PortfolioProject {
  id: string | null;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  technologies: string[];
  githubTopics: string[];
  githubStars: number;
  githubForks: number;
  githubOpenIssues: number;
  githubWatchers: number;
  githubLastPush: string | null;
  githubCreatedAt: string | null;
  githubUpdatedAt: string | null;
  thumbnail: string | null;
  category: string | null;
  status: string | null;
  visibility: string | null;
  domain: string | null;
  year: number | null;
  cachedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

function ensureArray(input: string[] | null | undefined): string[] {
  return Array.isArray(input) ? input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

export function normalizePortfolioProject(row: PortfolioProjectRow | null | undefined): PortfolioProject | null {
  if (!row) return null;

  const slug = row.slug ?? '';
  if (!slug) return null;

  const title = row.title ?? slug;
  const summary = row.summary ?? '';

  return {
    id: row.id ?? null,
    slug,
    title,
    summary,
    description: row.description ?? null,
    githubUrl: row.github_url ?? null,
    liveDemoUrl: row.live_demo_url ?? null,
    technologies: ensureArray(row.technologies),
    githubTopics: ensureArray(row.github_topics),
    githubStars: row.github_stars ?? 0,
    githubForks: row.github_forks ?? 0,
    githubOpenIssues: row.github_open_issues ?? 0,
    githubWatchers: row.github_watchers ?? 0,
    githubLastPush: row.github_last_push ?? null,
    githubCreatedAt: row.github_created_at ?? null,
    githubUpdatedAt: row.github_updated_at ?? null,
    thumbnail: row.thumbnail ?? null,
    category: row.category ?? null,
    status: row.status ?? null,
    visibility: row.visibility ?? null,
    domain: row.domain ?? null,
    year: row.year ?? null,
    cachedAt: row.cached_at ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

export function normalizePortfolioProjects(rows: PortfolioProjectRow[] | null | undefined): PortfolioProject[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => normalizePortfolioProject(row))
    .filter((row): row is PortfolioProject => row !== null)
    .sort((a, b) => {
      const yearA = a.year ?? 0;
      const yearB = b.year ?? 0;
      if (yearA === yearB) {
        return a.title.localeCompare(b.title);
      }
      return yearB - yearA;
    });
}

export interface CvProjectLike {
  slug: string;
  name?: string;
  title?: string;
  summary?: string;
  fullDescription?: string;
  description?: string;
  repoUrl?: string;
  url?: string | null;
  domain?: string | null;
  stack?: string[];
  technologies?: string[];
  thumbnail?: string;
  category?: string;
  status?: string;
  visibility?: string;
  year?: number;
}

export function mapCvProjectToPortfolioProject(project: CvProjectLike): PortfolioProject {
  const title = project.title ?? project.name ?? project.slug;
  return {
    id: null,
    slug: project.slug,
    title,
    summary: project.summary ?? '',
    description: project.fullDescription ?? project.description ?? null,
    githubUrl: project.repoUrl ?? null,
    liveDemoUrl: project.url ?? null,
    technologies: ensureArray(project.stack ?? project.technologies),
    githubTopics: [],
    githubStars: 0,
    githubForks: 0,
    githubOpenIssues: 0,
    githubWatchers: 0,
    githubLastPush: null,
    githubCreatedAt: null,
    githubUpdatedAt: null,
    thumbnail: project.thumbnail ?? null,
    category: project.category ?? null,
    status: project.status ?? null,
    visibility: project.visibility ?? null,
    domain: project.domain ?? null,
    year: project.year ?? null,
    cachedAt: null,
    createdAt: null,
    updatedAt: null,
  };
}
