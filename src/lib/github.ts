/**
 * GitHub API Service
 * Fetches repository information from GitHub API
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubOrg {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  description: string | null;
  public_repos: number;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch user repositories from GitHub
 */
export async function fetchUserRepositories(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&direction=desc&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    return [];
  }
}

/**
 * Fetch organization repositories from GitHub
 */
export async function fetchOrgRepositories(org: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${org}/repos?sort=updated&direction=desc&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching org repositories:', error);
    return [];
  }
}

/**
 * Fetch organization info from GitHub
 */
export async function fetchOrgInfo(org: string): Promise<GitHubOrg | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${org}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching org info:', error);
    return null;
  }
}

/**
 * Fetch a specific repository from GitHub
 */
export async function fetchRepository(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repository:', error);
    return null;
  }
}
