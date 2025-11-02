/**
 * GitHub API integration for fetching repository statistics
 * Uses GitHub REST API v3 (no authentication required for public repos)
 */
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

/**
 * Extract owner and repo name from a GitHub URL
 * @example extractRepoInfo('https://github.com/owner/repo') // { owner: 'owner', repo: 'repo' }
 */
function extractRepoInfo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== 'github.com') {
      return null;
    }
    
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    
    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch {
    return null;
  }
}

/**
 * Fetch repository statistics from GitHub API
 * Uses public API (no auth required) with rate limiting considerations
 */
export async function fetchGitHubRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
  const repoInfo = extractRepoInfo(repoUrl);
  if (!repoInfo) {
    return null;
  }

  const { owner, repo } = repoInfo;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Optional: Add GitHub token via env var for higher rate limits
        ...(import.meta.env.VITE_GITHUB_TOKEN
          ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` }
          : {}),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        logger.warn(`GitHub repository not found: ${repoUrl}`, { component: 'githubApi' });
      } else if (response.status === 403) {
        logger.warn('GitHub API rate limit exceeded. Consider adding VITE_GITHUB_TOKEN.', {
          component: 'githubApi',
        });
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

/**
 * Fetch multiple repository stats in parallel
 * Useful for portfolio pages with multiple projects
 */
export async function fetchMultipleRepoStats(
  repoUrls: string[]
): Promise<Map<string, GitHubRepoStats>> {
  const results = await Promise.allSettled(
    repoUrls.map(async (url) => ({
      url,
      stats: await fetchGitHubRepoStats(url),
    }))
  );

  const statsMap = new Map<string, GitHubRepoStats>();
  
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.stats) {
      statsMap.set(result.value.url, result.value.stats);
    }
  });

  return statsMap;
}

/**
 * Format star count for display (e.g., 1500 -> "1.5k", 1500000 -> "1.5M")
 */
export function formatStarCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Format relative time (e.g., "2 days ago", "3 months ago")
 */
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
