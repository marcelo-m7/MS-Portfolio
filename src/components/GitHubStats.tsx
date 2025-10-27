/**
 * Component to display GitHub repository statistics
 * Shows stars, forks, and last updated time
 */

import { Star, GitFork, Clock } from 'lucide-react';
import { useGitHubRepoStats } from '@/hooks/useGitHubStats';
import { formatStarCount, formatRelativeTime } from '@/lib/githubApi';
import { Skeleton } from '@/components/ui/skeleton';

interface GitHubStatsProps {
  repoUrl: string | null | undefined;
  compact?: boolean;
}

export function GitHubStats({ repoUrl, compact = false }: GitHubStatsProps) {
  const { data: stats, isLoading, isError } = useGitHubRepoStats(repoUrl);

  if (!repoUrl) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  // Silently fail on errors (GitHub API rate limits or network issues)
  if (isError || !stats) {
    return null;
  }

  const items = [
    {
      icon: Star,
      value: stats.stars,
      label: 'stars',
      show: true,
    },
    {
      icon: GitFork,
      value: stats.forks,
      label: 'forks',
      show: !compact || stats.forks > 0,
    },
    {
      icon: Clock,
      value: formatRelativeTime(stats.lastUpdated),
      label: 'updated',
      show: !compact,
    },
  ];

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      {items
        .filter((item) => item.show)
        .map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <item.icon size={12} />
            <span>
              {typeof item.value === 'number' ? formatStarCount(item.value) : item.value}
            </span>
          </div>
        ))}
    </div>
  );
}
