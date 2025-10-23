-- Migration: Create core tables (profile, contact, technologies)
-- Created: 2025-10-23
-- Description: Singleton tables for profile/contact info and normalized technologies table

-- ============================================
-- Profile Table (Singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT,
  lang_default TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.profile IS 'Singleton table for profile information';
COMMENT ON COLUMN portfolio.profile.lang_default IS 'Default language code (e.g., pt, en)';

-- ============================================
-- Contact Table (Singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  availability TEXT NOT NULL,
  note TEXT,
  success_message TEXT NOT NULL,
  error_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.contact IS 'Singleton table for contact page configuration';

-- ============================================
-- Technologies Table (Normalized)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.technologies IS 'Normalized technology/stack names used across projects';
COMMENT ON COLUMN portfolio.technologies.category IS 'Optional grouping (e.g., frontend, backend, devops)';

CREATE INDEX IF NOT EXISTS idx_technologies_name ON portfolio.technologies(name);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================

-- Enable RLS
ALTER TABLE portfolio.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.technologies ENABLE ROW LEVEL SECURITY;

-- Public read access for all core tables
CREATE POLICY "Public read access for profile"
  ON portfolio.profile FOR SELECT
  USING (true);

CREATE POLICY "Public read access for contact"
  ON portfolio.contact FOR SELECT
  USING (true);

CREATE POLICY "Public read access for technologies"
  ON portfolio.technologies FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION portfolio.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON portfolio.profile
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER update_contact_updated_at
  BEFORE UPDATE ON portfolio.contact
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
