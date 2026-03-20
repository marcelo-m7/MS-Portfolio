/**
 * React Query hooks for GitHub statistics.
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchGitHubOverview,
  fetchGitHubRepoStats,
  fetchMultipleRepoStats,
  type GitHubOverview,
} from '@/lib/githubApi';
import { SITE_CONFIG } from '@/config/site';

const GITHUB_STALE_TIME = 30 * 60 * 1000;
const GITHUB_CACHE_TIME = 60 * 60 * 1000;

export function useGitHubRepoStats(repoUrl: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: ['github-repo-stats', repoUrl],
    queryFn: () => {
      if (!repoUrl) return null;
      return fetchGitHubRepoStats(repoUrl);
    },
    enabled: enabled && !!repoUrl,
    staleTime: GITHUB_STALE_TIME,
    gcTime: GITHUB_CACHE_TIME,
    retry: 1,
  });
}

export function useMultipleGitHubRepoStats(repoUrls: string[], enabled = true) {
  return useQuery({
    queryKey: ['github-multi-stats', repoUrls.slice().sort().join(',')],
    queryFn: () => fetchMultipleRepoStats(repoUrls),
    enabled: enabled && repoUrls.length > 0,
    staleTime: GITHUB_STALE_TIME,
    gcTime: GITHUB_CACHE_TIME,
    retry: 1,
  });
}

export function useGitHubOverview(username = SITE_CONFIG.githubUsername, enabled = true) {
  return useQuery<GitHubOverview>({
    queryKey: ['github-overview', username],
    queryFn: () => fetchGitHubOverview(username),
    enabled,
    staleTime: GITHUB_STALE_TIME,
    gcTime: GITHUB_CACHE_TIME,
    retry: 1,
  });
}
