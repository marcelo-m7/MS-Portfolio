import { describe, expect, it } from 'vitest';
import {
  mapCvProjectToPortfolioProject,
  normalizePortfolioProject,
  normalizePortfolioProjects,
  type PortfolioProjectRow,
} from './transformers';

describe('portfolio project transformers', () => {
  it('normalizes portfolio project rows with null-safe values', () => {
    const row: PortfolioProjectRow = {
      id: '123',
      slug: 'sample-project',
      title: 'Sample Project',
      summary: 'Summary',
      description: 'Detailed description',
      github_url: 'https://github.com/example/sample',
      github_repo_id: 1,
      github_repo_name: 'sample',
      github_repo_full_name: 'example/sample',
      github_topics: ['react', 'vite'],
      github_stars: 42,
      github_forks: 5,
      github_open_issues: 0,
      github_watchers: 10,
      github_last_push: '2024-10-01T00:00:00.000Z',
      github_created_at: '2024-01-01T00:00:00.000Z',
      github_updated_at: '2024-10-02T00:00:00.000Z',
      live_demo_url: 'https://demo.example.com',
      technologies: ['React', 'TypeScript'],
      thumbnail: '/thumb.png',
      category: 'Web',
      status: 'Ativo',
      visibility: 'Pública',
      domain: 'example.com',
      year: 2024,
      cached_at: '2024-10-03T12:00:00.000Z',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-10-03T12:00:00.000Z',
    };

    const result = normalizePortfolioProject(row);

    expect(result).toMatchObject({
      slug: 'sample-project',
      title: 'Sample Project',
      technologies: ['React', 'TypeScript'],
      githubTopics: ['react', 'vite'],
      githubStars: 42,
      githubForks: 5,
      githubWatchers: 10,
      liveDemoUrl: 'https://demo.example.com',
    });
  });

  it('filters invalid rows when normalizing collections and sorts by year descending', () => {
    const rows: PortfolioProjectRow[] = [
      {
        id: '1',
        slug: 'alpha',
        title: 'Alpha',
        summary: 'Alpha project',
        description: null,
        github_url: null,
        github_repo_id: null,
        github_repo_name: null,
        github_repo_full_name: null,
        github_topics: null,
        github_stars: 1,
        github_forks: 0,
        github_open_issues: 0,
        github_watchers: 0,
        github_last_push: null,
        github_created_at: null,
        github_updated_at: null,
        live_demo_url: null,
        technologies: ['React'],
        thumbnail: null,
        category: null,
        status: null,
        visibility: null,
        domain: null,
        year: 2022,
        cached_at: null,
        created_at: null,
        updated_at: null,
      },
      {
        id: '2',
        slug: null,
        title: null,
        summary: null,
        description: null,
        github_url: null,
        github_repo_id: null,
        github_repo_name: null,
        github_repo_full_name: null,
        github_topics: null,
        github_stars: null,
        github_forks: null,
        github_open_issues: null,
        github_watchers: null,
        github_last_push: null,
        github_created_at: null,
        github_updated_at: null,
        live_demo_url: null,
        technologies: null,
        thumbnail: null,
        category: null,
        status: null,
        visibility: null,
        domain: null,
        year: 2025,
        cached_at: null,
        created_at: null,
        updated_at: null,
      },
      {
        id: '3',
        slug: 'beta',
        title: 'Beta',
        summary: 'Beta project',
        description: null,
        github_url: null,
        github_repo_id: null,
        github_repo_name: null,
        github_repo_full_name: null,
        github_topics: null,
        github_stars: null,
        github_forks: null,
        github_open_issues: null,
        github_watchers: null,
        github_last_push: null,
        github_created_at: null,
        github_updated_at: null,
        live_demo_url: null,
        technologies: ['Supabase'],
        thumbnail: null,
        category: null,
        status: null,
        visibility: null,
        domain: null,
        year: 2024,
        cached_at: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const result = normalizePortfolioProjects(rows);

    expect(result.map((item) => item.slug)).toEqual(['beta', 'alpha']);
  });

  it('maps CV projects into normalized portfolio projects', () => {
    const cvProject = {
      slug: 'gamma',
      name: 'Gamma',
      summary: 'Gamma summary',
      fullDescription: 'Gamma description',
      repoUrl: 'https://github.com/example/gamma',
      url: 'https://gamma.example.com',
      stack: ['React', 'Vite'],
      thumbnail: '/gamma.png',
      category: 'Experimentos',
      status: 'Em andamento',
      visibility: 'Pública',
      domain: 'gamma.example.com',
      year: 2023,
    };

    const result = mapCvProjectToPortfolioProject(cvProject);

    expect(result).toMatchObject({
      slug: 'gamma',
      title: 'Gamma',
      githubUrl: 'https://github.com/example/gamma',
      liveDemoUrl: 'https://gamma.example.com',
      technologies: ['React', 'Vite'],
      category: 'Experimentos',
      status: 'Em andamento',
      visibility: 'Pública',
    });
  });
});
