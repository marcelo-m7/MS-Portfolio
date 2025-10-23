-- Migration: Create projects tables
-- Created: 2025-10-23
-- Description: Projects table with many-to-many relationship to technologies

-- ============================================
-- Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description TEXT NOT NULL,
  url TEXT,
  domain TEXT,
  repo_url TEXT,
  thumbnail TEXT,
  category TEXT NOT NULL,
  status TEXT,
  visibility TEXT,
  year INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.projects IS 'Portfolio projects with metadata';
COMMENT ON COLUMN portfolio.projects.slug IS 'URL-safe unique identifier';
COMMENT ON COLUMN portfolio.projects.status IS 'Project status (e.g., Active, In Development, Archived)';
COMMENT ON COLUMN portfolio.projects.visibility IS 'Visibility level (e.g., Public, Private)';
COMMENT ON COLUMN portfolio.projects.display_order IS 'Order for sorting projects (lower = higher priority)';

-- ============================================
-- Project Stack Junction Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.project_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES portfolio.projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES portfolio.technologies(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, technology_id)
);

COMMENT ON TABLE portfolio.project_stack IS 'Many-to-many relationship between projects and technologies';
COMMENT ON COLUMN portfolio.project_stack.display_order IS 'Order for displaying technologies in project';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON portfolio.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON portfolio.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_year ON portfolio.projects(year);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON portfolio.projects(display_order);

CREATE INDEX IF NOT EXISTS idx_project_stack_project_id ON portfolio.project_stack(project_id);
CREATE INDEX IF NOT EXISTS idx_project_stack_technology_id ON portfolio.project_stack(technology_id);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================
ALTER TABLE portfolio.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.project_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for projects"
  ON portfolio.projects FOR SELECT
  USING (true);

CREATE POLICY "Public read access for project_stack"
  ON portfolio.project_stack FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger
-- ============================================
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON portfolio.projects
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
