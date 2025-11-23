-- Seed artworks, artwork media/materials, and series + series_works
-- Source: public/data/cv.json

-- ============================================
-- Artworks
-- ============================================
INSERT INTO portfolio.artworks (slug, title, year, description, url_3d, display_order)
VALUES (
  'artleo',
  'Art Leo Creative Spaces',
  2025,
  'Experiência imersiva criada em Next.js e React Three Fiber para o artista Leonardo Silva, destacando arte interativa e ambiente 3D.',
  'https://artleo.monynha.com',
  0
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  year = EXCLUDED.year,
  description = EXCLUDED.description,
  url_3d = EXCLUDED.url_3d,
  updated_at = NOW();

-- Media for 'artleo' (reset then insert ordered)
WITH a AS (
  SELECT id FROM portfolio.artworks WHERE slug = 'artleo'
)
DELETE FROM portfolio.artwork_media WHERE artwork_id IN (SELECT id FROM a);

WITH a AS (
  SELECT id FROM portfolio.artworks WHERE slug = 'artleo'
)
INSERT INTO portfolio.artwork_media (artwork_id, media_url, display_order)
SELECT a.id, m.media_url, m.display_order
FROM a
CROSS JOIN (
  VALUES
    ('/images/artleo-hero.svg', 0),
    ('/images/artleo-3d.svg',   1)
) AS m(media_url, display_order);

-- Materials for 'artleo' (reset then insert ordered)
WITH a AS (
  SELECT id FROM portfolio.artworks WHERE slug = 'artleo'
)
DELETE FROM portfolio.artwork_materials WHERE artwork_id IN (SELECT id FROM a);

WITH a AS (
  SELECT id FROM portfolio.artworks WHERE slug = 'artleo'
)
INSERT INTO portfolio.artwork_materials (artwork_id, material, display_order)
SELECT a.id, m.material, m.display_order
FROM a
CROSS JOIN (
  VALUES
    ('WebGL',           0),
    ('3D Animation',    1),
    ('Digital Sculpture', 2)
) AS m(material, display_order);

-- ============================================
-- Series and Series Works
-- ============================================
INSERT INTO portfolio.series (slug, title, description, year, display_order)
VALUES (
  'creative-systems',
  'Creative Systems',
  'Coleção de projetos experimentais que exploram a intersecção entre arte generativa, UX e automação inteligente.',
  2024,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  year = EXCLUDED.year,
  updated_at = NOW();

-- Upsert works for the series in defined order
WITH s AS (
  SELECT id FROM portfolio.series WHERE slug = 'creative-systems'
)
INSERT INTO portfolio.series_works (series_id, work_slug, work_type, display_order)
SELECT s.id, w.work_slug, w.work_type, w.display_order
FROM s
CROSS JOIN (
  VALUES
    ('artleo',   'artwork', 0),
    ('monagent', 'project', 1)
) AS w(work_slug, work_type, display_order)
ON CONFLICT (series_id, work_slug) DO UPDATE SET
  work_type = EXCLUDED.work_type,
  display_order = EXCLUDED.display_order;
