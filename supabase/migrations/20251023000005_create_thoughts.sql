-- Migration: Create thoughts/blog tables
-- Created: 2025-10-23
-- Description: Blog posts (thoughts) with tags

-- ============================================
-- Thoughts Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  date DATE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.thoughts IS 'Blog posts and reflections';
COMMENT ON COLUMN portfolio.thoughts.slug IS 'URL-safe unique identifier';
COMMENT ON COLUMN portfolio.thoughts.date IS 'Publication date';

-- ============================================
-- Thought Tags Table (Many-to-Many via array)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.thought_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thought_id UUID NOT NULL REFERENCES portfolio.thoughts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thought_id, tag)
);

COMMENT ON TABLE portfolio.thought_tags IS 'Tags for categorizing thoughts/blog posts';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_thoughts_slug ON portfolio.thoughts(slug);
CREATE INDEX IF NOT EXISTS idx_thoughts_date ON portfolio.thoughts(date DESC);
CREATE INDEX IF NOT EXISTS idx_thoughts_display_order ON portfolio.thoughts(display_order);

CREATE INDEX IF NOT EXISTS idx_thought_tags_thought_id ON portfolio.thought_tags(thought_id);
CREATE INDEX IF NOT EXISTS idx_thought_tags_tag ON portfolio.thought_tags(tag);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================
ALTER TABLE portfolio.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.thought_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for thoughts"
  ON portfolio.thoughts FOR SELECT
  USING (true);

CREATE POLICY "Public read access for thought_tags"
  ON portfolio.thought_tags FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger
-- ============================================
CREATE TRIGGER update_thoughts_updated_at
  BEFORE UPDATE ON portfolio.thoughts
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
