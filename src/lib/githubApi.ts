/**
 * GitHub API integration for repository statistics and recent activity.
 * Prefers GraphQL when a token is available and falls back to REST/public data.
 */
import { logger } from './logger';
import { API_CONFIG, SITE_CONFIG } from '@/config/site';
import { loadCvData } from '@/services/cvData';

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

export interface GitHubRepositorySummary {
  id: string;
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  primaryLanguage: string | null;
  updatedAt: string;
  owner: string;
}

export interface GitHubOverview {
  username: string;
  profileUrl: string;
  followers: number;
  totalPublicRepos: number;
  contributionCount?: number;
  totalStars: number;
  recentRepositories: GitHubRepositorySummary[];
  source: 'graphql' | 'rest' | 'fallback';
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

function getGitHubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    ...(import.meta.env.VITE_GITHUB_TOKEN
      ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` }
      : {}),
  };
}

async function graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  if (!import.meta.env.VITE_GITHUB_TOKEN) return null;

  try {
    const response = await fetch(API_CONFIG.githubGraphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getGitHubHeaders(),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      logger.warn('GitHub GraphQL request failed', { component: 'githubApi', metadata: { status: response.status } });
      return null;
    }

    const payload = await response.json();
    if (payload.errors?.length) {
      logger.warn('GitHub GraphQL returned errors', { component: 'githubApi', metadata: { errors: payload.errors } });
      return null;
    }

    return payload.data as T;
  } catch (error) {
    logger.error('GitHub GraphQL request failed unexpectedly', { component: 'githubApi' }, error);
    return null;
  }
}

export async function fetchGitHubRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
  const repoInfo = extractRepoInfo(repoUrl);
  if (!repoInfo) return null;

  const { owner, repo } = repoInfo;

  try {
    const query = `
      query RepoStats($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          stargazerCount
          forkCount
          issues(states: OPEN) { totalCount }
          watchers { totalCount }
          updatedAt
          description
          repositoryTopics(first: 8) { nodes { topic { name } } }
          primaryLanguage { name }
        }
      }
    `;

    const graphData = await graphqlRequest<{
      repository: {
        stargazerCount: number;
        forkCount: number;
        issues: { totalCount: number };
        watchers: { totalCount: number };
        updatedAt: string;
        description: string | null;
        repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
        primaryLanguage: { name: string } | null;
      } | null;
    }>(query, { owner, repo });

    if (graphData?.repository) {
      return {
        stars: graphData.repository.stargazerCount ?? 0,
        forks: graphData.repository.forkCount ?? 0,
        openIssues: graphData.repository.issues?.totalCount ?? 0,
        watchers: graphData.repository.watchers?.totalCount ?? 0,
        lastUpdated: graphData.repository.updatedAt ?? '',
        language: graphData.repository.primaryLanguage?.name ?? null,
        topics: graphData.repository.repositoryTopics?.nodes?.map((node) => node.topic.name) ?? [],
        description: graphData.repository.description ?? null,
      };
    }

    const response = await fetch(`${API_CONFIG.githubRestUrl}/repos/${owner}/${repo}`, {
      headers: getGitHubHeaders(),
    });

    if (!response.ok) return null;
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
  const results = await Promise.allSettled(
    repoUrls.map(async (url) => ({ url, stats: await fetchGitHubRepoStats(url) })),
  );

  const statsMap = new Map<string, GitHubRepoStats>();
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.stats) {
      statsMap.set(result.value.url, result.value.stats);
    }
  });
  return statsMap;
}

async function fetchFallbackRepositories(): Promise<GitHubRepositorySummary[]> {
  const cv = await loadCvData();
  const projects = ((cv.projects as Array<Record<string, unknown>> | undefined) ?? [])
    .filter((project) => typeof project.repoUrl === 'string')
    .slice(0, 4);

  return projects.map((project, index) => {
    const repoUrl = String(project.repoUrl);
    const repoInfo = extractRepoInfo(repoUrl);
    return {
      id: `${project.slug ?? index}`,
      name: String(project.name ?? repoInfo?.repo ?? 'Repository'),
      url: repoUrl,
      description: typeof project.summary === 'string' ? project.summary : null,
      stars: 0,
      forks: 0,
      primaryLanguage: Array.isArray(project.stack) ? String(project.stack[0] ?? 'N/A') : null,
      updatedAt: '',
      owner: repoInfo?.owner ?? SITE_CONFIG.githubUsername,
    };
  });
}

export async function fetchGitHubOverview(username = SITE_CONFIG.githubUsername): Promise<GitHubOverview> {
  const graphQuery = `
    query GitHubOverview($login: String!) {
      user(login: $login) {
        login
        url
        followers { totalCount }
        repositories(first: 6, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            id
            name
            url
            description
            stargazerCount
            forkCount
            updatedAt
            owner { login }
            primaryLanguage { name }
          }
        }
        contributionsCollection {
          contributionCalendar { totalContributions }
        }
      }
    }
  `;

  const graphData = await graphqlRequest<{
    user: {
      login: string;
      url: string;
      followers: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: Array<{
          id: string;
          name: string;
          url: string;
          description: string | null;
          stargazerCount: number;
          forkCount: number;
          updatedAt: string;
          owner: { login: string };
          primaryLanguage: { name: string } | null;
        } | null>;
      };
      contributionsCollection?: { contributionCalendar?: { totalContributions?: number } };
    } | null;
  }>(graphQuery, { login: username });

  if (graphData?.user) {
    const recentRepositories = (graphData.user.repositories.nodes ?? [])
      .filter((repo): repo is NonNullable<typeof repo> => Boolean(repo))
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        url: repo.url,
        description: repo.description,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        primaryLanguage: repo.primaryLanguage?.name ?? null,
        updatedAt: repo.updatedAt,
        owner: repo.owner.login,
      }));

    return {
      username: graphData.user.login,
      profileUrl: graphData.user.url,
      followers: graphData.user.followers.totalCount,
      totalPublicRepos: graphData.user.repositories.totalCount,
      contributionCount: graphData.user.contributionsCollection?.contributionCalendar?.totalContributions,
      totalStars: recentRepositories.reduce((sum, repo) => sum + repo.stars, 0),
      recentRepositories,
      source: 'graphql',
    };
  }

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`${API_CONFIG.githubRestUrl}/users/${username}`, { headers: getGitHubHeaders() }),
      fetch(`${API_CONFIG.githubRestUrl}/users/${username}/repos?sort=pushed&per_page=6`, { headers: getGitHubHeaders() }),
    ]);

    if (profileResponse.ok && reposResponse.ok) {
      const profile = await profileResponse.json();
      const repos = await reposResponse.json();
      const recentRepositories: GitHubRepositorySummary[] = (repos ?? []).map((repo: Record<string, unknown>) => ({
        id: String(repo.id),
        name: String(repo.name),
        url: String(repo.html_url),
        description: typeof repo.description === 'string' ? repo.description : null,
        stars: Number(repo.stargazers_count ?? 0),
        forks: Number(repo.forks_count ?? 0),
        primaryLanguage: typeof repo.language === 'string' ? repo.language : null,
        updatedAt: String(repo.updated_at ?? ''),
        owner: String((repo.owner as { login?: string } | undefined)?.login ?? username),
      }));

      return {
        username: String(profile.login ?? username),
        profileUrl: String(profile.html_url ?? `https://github.com/${username}`),
        followers: Number(profile.followers ?? 0),
        totalPublicRepos: Number(profile.public_repos ?? recentRepositories.length),
        totalStars: recentRepositories.reduce((sum, repo) => sum + repo.stars, 0),
        recentRepositories,
        source: 'rest',
      };
    }
  } catch (error) {
    logger.error('Error fetching GitHub overview via REST', { component: 'githubApi' }, error);
  }

  const fallbackRepos = await fetchFallbackRepositories();
  return {
    username,
    profileUrl: `https://github.com/${username}`,
    followers: 0,
    totalPublicRepos: fallbackRepos.length,
    totalStars: 0,
    recentRepositories: fallbackRepos,
    source: 'fallback',
  };
}

export function formatStarCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Fallback local';
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
