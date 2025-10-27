import { useQuery } from '@tanstack/react-query';
import { fetchUserRepositories, fetchOrgRepositories, GitHubRepo } from '@/lib/github';

/**
 * Hook to fetch GitHub repositories for a user
 */
export function useGitHubUserRepos(username: string, enabled = true) {
  return useQuery({
    queryKey: ['github-repos', 'user', username],
    queryFn: () => fetchUserRepositories(username),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch GitHub repositories for an organization
 */
export function useGitHubOrgRepos(org: string, enabled = true) {
  return useQuery({
    queryKey: ['github-repos', 'org', org],
    queryFn: () => fetchOrgRepositories(org),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to combine and merge repositories from user and org
 */
export function useGitHubRepos(username: string, org: string) {
  const { data: userRepos = [], isLoading: userLoading } = useGitHubUserRepos(username);
  const { data: orgRepos = [], isLoading: orgLoading } = useGitHubOrgRepos(org);

  const allRepos: GitHubRepo[] = [...userRepos, ...orgRepos];
  const uniqueRepos = allRepos.filter(
    (repo, index, self) => index === self.findIndex((r) => r.id === repo.id)
  );

  // Sort by updated date
  const sortedRepos = uniqueRepos.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return {
    repos: sortedRepos,
    isLoading: userLoading || orgLoading,
  };
}
