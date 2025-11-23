-- Migration: Create experience and skills tables
-- Created: 2025-10-23
-- Description: Work experience with highlights and skills inventory

-- ============================================
-- Experience Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  org TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  location TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.experience IS 'Work experience and education history';
COMMENT ON COLUMN portfolio.experience.end_date IS 'NULL indicates current/ongoing position';

-- ============================================
-- Experience Highlights Table (Ordered List)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.experience_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES portfolio.experience(id) ON DELETE CASCADE,
  highlight TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.experience_highlights IS 'Key achievements and responsibilities for each experience entry';

-- ============================================
-- Skills Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.skills IS 'Technical and soft skills inventory';
COMMENT ON COLUMN portfolio.skills.category IS 'Skill category (e.g., Frontend, Backend, DevOps)';
COMMENT ON COLUMN portfolio.skills.level IS 'Proficiency level';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON portfolio.experience(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_start_date ON portfolio.experience(start_date DESC);

CREATE INDEX IF NOT EXISTS idx_experience_highlights_experience_id ON portfolio.experience_highlights(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_highlights_order ON portfolio.experience_highlights(experience_id, display_order);

CREATE INDEX IF NOT EXISTS idx_skills_category ON portfolio.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON portfolio.skills(display_order);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================
ALTER TABLE portfolio.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.experience_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for experience"
  ON portfolio.experience FOR SELECT
  USING (true);

CREATE POLICY "Public read access for experience_highlights"
  ON portfolio.experience_highlights FOR SELECT
  USING (true);

CREATE POLICY "Public read access for skills"
  ON portfolio.skills FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Triggers
-- ============================================
CREATE TRIGGER update_experience_updated_at
  BEFORE UPDATE ON portfolio.experience
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON portfolio.skills
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
