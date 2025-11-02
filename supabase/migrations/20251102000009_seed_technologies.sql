-- Migration: Seed technologies table
-- Created: 2025-11-02
-- Description: Populate normalized technologies from project stack arrays in cv.json

-- ============================================
-- Insert Technologies
-- ============================================
-- Extracted from all project stack arrays in cv.json
-- Using ON CONFLICT to ensure idempotency

INSERT INTO portfolio.technologies (name, category) VALUES
  ('Supabase', 'Backend'),
  ('Flutter', 'Mobile'),
  ('React', 'Frontend'),
  ('TypeScript', 'Language'),
  ('Vite', 'Build Tool'),
  ('Tailwind CSS', 'Styling'),
  ('i18next', 'Internationalization'),
  ('Playwright', 'Testing'),
  ('Next.js', 'Framework'),
  ('Payload CMS', 'CMS'),
  ('shadcn/ui', 'UI Library'),
  ('React Three Fiber', '3D/WebGL'),
  ('LLMs', 'AI/ML'),
  ('WhatsApp API', 'Integration'),
  ('Dashboards', 'Visualization'),
  ('Markdown', 'Content'),
  ('Design System', 'Design'),
  ('Coolify', 'DevOps'),
  ('Docker', 'DevOps'),
  ('Observability', 'Monitoring'),
  ('Open WebUI', 'AI Tool'),
  ('Python', 'Language'),
  ('LangChain', 'AI Framework'),
  ('OpenAI', 'AI Service'),
  ('Containers', 'DevOps'),
  ('Static Site', 'Architecture')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Verification Query
-- ============================================
-- After migration, verify count:
-- SELECT COUNT(*) FROM portfolio.technologies;
-- Expected: 26 technologies
