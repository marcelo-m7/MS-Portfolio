-- Migration: Create artworks tables
-- Created: 2025-10-23
-- Description: Artworks with media and materials arrays

-- ============================================
-- Artworks Table
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  url_3d TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.artworks IS 'Digital artworks and 3D experiences';
COMMENT ON COLUMN portfolio.artworks.slug IS 'URL-safe unique identifier';
COMMENT ON COLUMN portfolio.artworks.url_3d IS 'URL to 3D preview/experience';

-- ============================================
-- Artwork Media Table (Ordered List)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.artwork_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES portfolio.artworks(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.artwork_media IS 'Media URLs for artworks (images, videos) in display order';

-- ============================================
-- Artwork Materials Table (Ordered List)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio.artwork_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES portfolio.artworks(id) ON DELETE CASCADE,
  material TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE portfolio.artwork_materials IS 'Materials/techniques used in artwork creation';

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON portfolio.artworks(slug);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON portfolio.artworks(year);
CREATE INDEX IF NOT EXISTS idx_artworks_display_order ON portfolio.artworks(display_order);

CREATE INDEX IF NOT EXISTS idx_artwork_media_artwork_id ON portfolio.artwork_media(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_media_order ON portfolio.artwork_media(artwork_id, display_order);

CREATE INDEX IF NOT EXISTS idx_artwork_materials_artwork_id ON portfolio.artwork_materials(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_materials_order ON portfolio.artwork_materials(artwork_id, display_order);

-- ============================================
-- RLS Policies (Public Read Access)
-- ============================================
ALTER TABLE portfolio.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.artwork_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.artwork_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for artworks"
  ON portfolio.artworks FOR SELECT
  USING (true);

CREATE POLICY "Public read access for artwork_media"
  ON portfolio.artwork_media FOR SELECT
  USING (true);

CREATE POLICY "Public read access for artwork_materials"
  ON portfolio.artwork_materials FOR SELECT
  USING (true);

-- ============================================
-- Updated_at Trigger
-- ============================================
CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON portfolio.artworks
  FOR EACH ROW
  EXECUTE FUNCTION portfolio.update_updated_at_column();
