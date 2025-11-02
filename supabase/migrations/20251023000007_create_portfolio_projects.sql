-- Migration: Create portfolio_projects table for GitHub synced portfolio entries
-- Created: 2025-10-23
-- Description: Stores GitHub metadata cached in Supabase for project detail pages

-- ============================================
-- Table Definition
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  github_url TEXT NOT NULL,
  github_repo_id BIGINT,
  github_repo_name TEXT,
  github_repo_full_name TEXT,
  github_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  github_open_issues INTEGER DEFAULT 0,
  github_watchers INTEGER DEFAULT 0,
  github_last_push TIMESTAMPTZ,
  github_created_at TIMESTAMPTZ,
  github_updated_at TIMESTAMPTZ,
  live_demo_url TEXT,
  technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  thumbnail TEXT,
  category TEXT,
  status TEXT,
  visibility TEXT,
  domain TEXT,
  year INTEGER,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.portfolio_projects IS 'Portfolio entries synchronised from GitHub and cached in Supabase.';
COMMENT ON COLUMN portfolio.portfolio_projects.slug IS 'URL-safe unique identifier for the project detail route.';
COMMENT ON COLUMN portfolio.portfolio_projects.github_topics IS 'Topics returned by the GitHub API.';
COMMENT ON COLUMN portfolio.portfolio_projects.cached_at IS 'Timestamp of the last successful GitHub sync.';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_slug ON portfolio.portfolio_projects(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_projects_repo_full_name ON portfolio.portfolio_projects(github_repo_full_name);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_repo_id ON portfolio.portfolio_projects(github_repo_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_year ON portfolio.portfolio_projects(year);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE portfolio.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for portfolio_projects"
  ON portfolio.portfolio_projects FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger
-- ============================================
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();

-- ============================================
-- Public View (schema compatibility with Supabase client)
-- ============================================
CREATE OR REPLACE VIEW public.portfolio_projects AS
  SELECT
    id,
    slug,
    title,
    summary,
    description,
    github_url,
    github_repo_id,
    github_repo_name,
    github_repo_full_name,
    github_topics,
    github_stars,
    github_forks,
    github_open_issues,
    github_watchers,
    github_last_push,
    github_created_at,
    github_updated_at,
    live_demo_url,
    technologies,
    thumbnail,
    category,
    status,
    visibility,
    domain,
    year,
    cached_at,
    created_at,
    updated_at
  FROM portfolio.portfolio_projects;

ALTER VIEW public.portfolio_projects SET (security_barrier = true);

GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT ON public.portfolio_projects TO authenticated;
