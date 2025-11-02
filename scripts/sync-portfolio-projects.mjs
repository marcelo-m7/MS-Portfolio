#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadConfig() {
  const configPath = path.join(__dirname, 'portfolio-projects.json');
  const content = await readFile(configPath, 'utf8');
  return JSON.parse(content);
}

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-sync-script',
  };

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHubRepo(repoFullName) {
  const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const message = `GitHub request failed for ${repoFullName}: ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      console.warn(message);
      return null;
    }
    throw new Error(message);
  }

  return response.json();
}

function mergeProject(config, repoData) {
  const topics = Array.isArray(repoData?.topics) ? repoData.topics : [];
  const technologies = Array.isArray(config.technologies) ? config.technologies : [];

  return {
    slug: config.slug,
    title: config.title ?? repoData?.name ?? config.slug,
    summary: config.summary ?? repoData?.description ?? '',
    description: config.description ?? repoData?.description ?? '',
    github_url: repoData?.html_url ?? `https://github.com/${config.githubRepo}`,
    github_repo_id: repoData?.id ?? null,
    github_repo_name: repoData?.name ?? null,
    github_repo_full_name: repoData?.full_name ?? config.githubRepo,
    github_topics: topics,
    github_stars: repoData?.stargazers_count ?? 0,
    github_forks: repoData?.forks_count ?? 0,
    github_open_issues: repoData?.open_issues_count ?? 0,
    github_watchers: repoData?.subscribers_count ?? 0,
    github_last_push: repoData?.pushed_at ?? null,
    github_created_at: repoData?.created_at ?? null,
    github_updated_at: repoData?.updated_at ?? null,
    live_demo_url: config.liveDemoUrl ?? null,
    technologies,
    thumbnail: config.thumbnail ?? null,
    category: config.category ?? null,
    status: config.status ?? null,
    visibility: config.visibility ?? null,
    domain: config.domain ?? null,
    year: config.year ?? null,
    cached_at: new Date().toISOString(),
  };
}

async function main() {
  const projects = await loadConfig();
  if (!Array.isArray(projects) || projects.length === 0) {
    console.error('No portfolio projects found in configuration.');
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const schema = process.env.SUPABASE_SCHEMA || process.env.VITE_SUPABASE_SCHEMA || 'portfolio';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const payload = [];
  for (const project of projects) {
    if (!project.githubRepo) {
      console.warn(`Skipping ${project.slug} because githubRepo is not defined.`);
      continue;
    }

    try {
      const repoData = await fetchGitHubRepo(project.githubRepo);
      payload.push(mergeProject(project, repoData));
    } catch (error) {
      console.error(`Failed to sync ${project.slug}:`, error);
    }
  }

  if (payload.length === 0) {
    console.error('No projects ready to upsert. Exiting.');
    process.exit(1);
  }

  const { error } = await client.schema(schema).from('portfolio_projects').upsert(payload, {
    onConflict: 'slug',
  });

  if (error) {
    console.error('Supabase upsert failed:', error);
    process.exit(1);
  }

  console.log(`Successfully synced ${payload.length} projects to Supabase schema "${schema}".`);
}

main().catch((error) => {
  console.error('Unexpected sync failure:', error);
  process.exit(1);
});
