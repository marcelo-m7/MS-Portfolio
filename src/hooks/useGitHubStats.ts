/**
 * React Query hooks for GitHub repository statistics
 */

import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepoStats, fetchMultipleRepoStats, type GitHubRepoStats } from '@/lib/githubApi';

// Cache GitHub stats for 30 minutes (GitHub API has rate limits)
const GITHUB_STALE_TIME = 30 * 60 * 1000;
const GITHUB_CACHE_TIME = 60 * 60 * 1000; // 1 hour

/**
 * Hook to fetch GitHub repository statistics for a single repo
 * @param repoUrl - Full GitHub repository URL
 * @param enabled - Whether to enable the query (default: true)
 */
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
    retry: 1, // Only retry once for GitHub API
  });
}

/**
 * Hook to fetch GitHub statistics for multiple repositories
 * @param repoUrls - Array of GitHub repository URLs
 * @param enabled - Whether to enable the query (default: true)
 */
export function useMultipleGitHubRepoStats(repoUrls: string[], enabled = true) {
  return useQuery({
    queryKey: ['github-multi-stats', repoUrls.sort().join(',')],
    queryFn: () => fetchMultipleRepoStats(repoUrls),
    enabled: enabled && repoUrls.length > 0,
    staleTime: GITHUB_STALE_TIME,
    gcTime: GITHUB_CACHE_TIME,
    retry: 1,
  });
}
