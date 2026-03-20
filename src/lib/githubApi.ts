/**
 * GitHub API integration for fetching repository statistics and dynamic portfolio highlights.
 * Prefers GitHub GraphQL when a token is available, with REST and local fallbacks for resilience.
 */
import { siteConfig } from '@/config/site';
import { logger } from './logger';

export interface GitHubRepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  lastUpdated: string;
  language: string | null;
  topics: string[];
  description: string | null;
}

export interface GitHubHighlightedRepo {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updatedAt: string;
  language: string | null;
}

interface GitHubGraphQlRepoNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  primaryLanguage: { name: string } | null;
}

function getGitHubHeaders(useGraphQl = false): HeadersInit {
  return {
    Accept: useGraphQl ? 'application/vnd.github+json' : 'application/vnd.github.v3+json',
    ...(siteConfig.github.token ? { Authorization: `Bearer ${siteConfig.github.token}` } : {}),
  };
}

function mapRepoNode(node: GitHubGraphQlRepoNode): GitHubHighlightedRepo {
  return {
    id: node.id,
    name: node.name,
    description: node.description ?? 'Repositório estratégico do ecossistema Monynha.',
    url: node.url,
    stars: node.stargazerCount,
    forks: node.forkCount,
    updatedAt: node.updatedAt,
    language: node.primaryLanguage?.name ?? null,
  };
}

function extractRepoInfo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

async function fetchGraphQlHighlightedRepos(): Promise<GitHubHighlightedRepo[] | null> {
  if (!siteConfig.github.token) return null;

  const query = `
    query PortfolioHighlights($login: String!, $fallback: String!, $limit: Int!) {
      organization(login: $login) {
        repositories(first: $limit, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC, isFork: false) {
          nodes { id name description url stargazerCount forkCount updatedAt primaryLanguage { name } }
        }
      }
      user(login: $fallback) {
        repositories(first: $limit, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC, isFork: false) {
          nodes { id name description url stargazerCount forkCount updatedAt primaryLanguage { name } }
        }
      }
    }
  `;

  try {
    const response = await fetch(siteConfig.github.graphQlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getGitHubHeaders(true),
      },
      body: JSON.stringify({
        query,
        variables: {
          login: siteConfig.github.organization,
          fallback: siteConfig.github.username,
          limit: 6,
        },
      }),
    });

    if (!response.ok) {
      logger.warn('GitHub GraphQL request failed', { component: 'githubApi', status: response.status });
      return null;
    }

    const payload = await response.json();
    const orgNodes = payload?.data?.organization?.repositories?.nodes as GitHubGraphQlRepoNode[] | undefined;
    const userNodes = payload?.data?.user?.repositories?.nodes as GitHubGraphQlRepoNode[] | undefined;
    const repos = [...(orgNodes ?? []), ...(userNodes ?? [])].filter(Boolean).slice(0, 6).map(mapRepoNode);
    return repos.length > 0 ? repos : null;
  } catch (error) {
    logger.error('Error fetching GraphQL GitHub highlights', { component: 'githubApi' }, error);
    return null;
  }
}

async function fetchRestHighlightedRepos(): Promise<GitHubHighlightedRepo[] | null> {
  const candidates = [siteConfig.github.organization, siteConfig.github.username];

  for (const account of candidates) {
    try {
      const response = await fetch(`${siteConfig.github.restEndpoint}/users/${account}/repos?sort=pushed&per_page=6&type=owner`, {
        headers: getGitHubHeaders(),
      });

      if (!response.ok) continue;
      const data = await response.json();
      const repos = (Array.isArray(data) ? data : [])
        .filter((repo) => !repo.fork)
        .slice(0, 6)
        .map((repo) => ({
          id: String(repo.id),
          name: repo.name,
          description: repo.description ?? 'Repositório estratégico do ecossistema Monynha.',
          url: repo.html_url,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          updatedAt: repo.updated_at ?? repo.pushed_at ?? '',
          language: repo.language ?? null,
        }));

      if (repos.length > 0) return repos;
    } catch (error) {
      logger.error('Error fetching REST GitHub highlights', { component: 'githubApi', account }, error);
    }
  }

  return null;
}

export async function fetchHighlightedRepos(): Promise<{ items: GitHubHighlightedRepo[]; isFallback: boolean }> {
  const graphQlRepos = await fetchGraphQlHighlightedRepos();
  if (graphQlRepos) return { items: graphQlRepos, isFallback: false };

  const restRepos = await fetchRestHighlightedRepos();
  if (restRepos) return { items: restRepos, isFallback: false };

  const fallbackItems = siteConfig.github.featuredFallback.map((name, index) => ({
    id: `fallback-${name}-${index}`,
    name,
    description: 'Fallback local para preservar estabilidade visual enquanto a integração dinâmica estiver indisponível.',
    url: `https://github.com/${siteConfig.github.organization}/${name}`,
    stars: 0,
    forks: 0,
    updatedAt: '',
    language: null,
  }));

  return { items: fallbackItems, isFallback: true };
}

export async function fetchGitHubRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
  const repoInfo = extractRepoInfo(repoUrl);
  if (!repoInfo) return null;

  const { owner, repo } = repoInfo;
  const apiUrl = `${siteConfig.github.restEndpoint}/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl, { headers: getGitHubHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        logger.warn(`GitHub repository not found: ${repoUrl}`, { component: 'githubApi' });
      } else if (response.status === 403) {
        logger.warn('GitHub API rate limit exceeded. Consider adding VITE_GITHUB_TOKEN.', { component: 'githubApi' });
      }
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      watchers: data.watchers_count ?? 0,
      lastUpdated: data.updated_at ?? data.pushed_at ?? '',
      language: data.language ?? null,
      topics: data.topics ?? [],
      description: data.description ?? null,
    };
  } catch (error) {
    logger.error(`Error fetching GitHub stats for ${repoUrl}`, { component: 'githubApi' }, error);
    return null;
  }
}

export async function fetchMultipleRepoStats(repoUrls: string[]): Promise<Map<string, GitHubRepoStats>> {
  const results = await Promise.allSettled(repoUrls.map(async (url) => ({ url, stats: await fetchGitHubRepoStats(url) })));
  const statsMap = new Map<string, GitHubRepoStats>();
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.stats) statsMap.set(result.value.url, result.value.stats);
  });
  return statsMap;
}

export function formatStarCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
