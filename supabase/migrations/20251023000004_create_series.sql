-- Migration: Create series tables
-- Created: 2025-10-23
-- Description: Series with relationships to projects/artworks via slugs

-- ============================================
-- Series Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.series IS 'Collections/series grouping related works';
COMMENT ON COLUMN portfolio.series.slug IS 'URL-safe unique identifier';

-- ============================================
-- Series Works Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.series_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES portfolio.series(id) ON DELETE CASCADE,
  work_slug TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('project', 'artwork')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, work_slug)
);

COMMENT ON TABLE portfolio.series_works IS 'Works included in a series (references projects/artworks by slug)';
COMMENT ON COLUMN portfolio.series_works.work_slug IS 'Slug reference to project or artwork';
COMMENT ON COLUMN portfolio.series_works.work_type IS 'Type of work: project or artwork';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_series_slug ON portfolio.series(slug);
CREATE INDEX IF NOT EXISTS idx_series_year ON portfolio.series(year);
CREATE INDEX IF NOT EXISTS idx_series_display_order ON portfolio.series(display_order);

CREATE INDEX IF NOT EXISTS idx_series_works_series_id ON portfolio.series_works(series_id);
CREATE INDEX IF NOT EXISTS idx_series_works_slug ON portfolio.series_works(work_slug);
CREATE INDEX IF NOT EXISTS idx_series_works_order ON portfolio.series_works(series_id, display_order);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================
ALTER TABLE portfolio.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.series_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for series"
  ON portfolio.series FOR SELECT
  USING (true);

CREATE POLICY "Public read access for series_works"
  ON portfolio.series_works FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger
-- ============================================
CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON portfolio.series
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
