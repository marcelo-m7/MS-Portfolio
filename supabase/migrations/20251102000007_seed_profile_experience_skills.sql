-- Migration: Seed profile, experience (with highlights), and skills
-- Created: 2025-11-02
-- Description: Populate initial portfolio data based on Marcelo's CV

-- ============================================
-- Profile (singleton)
-- ============================================
INSERT INTO portfolio.profile (name, headline, location, bio, avatar, lang_default)
SELECT 'Marcelo Santos',
       'Software Engineer • AI & Automation • Founder @ Monynha Softwares',
       'Faro, Portugal',
       'Engenheiro de software com background em gestão e experiência prática em desenvolvimento. Atuo em produtos digitais, IA aplicada (assistentes virtuais, RAG), automação e web. Já desenvolvi soluções full‑stack com Python, TypeScript/Node.js, React/Vite e integrações com Supabase. Paixão por acessibilidade, design inclusivo e impacto real por meio de tecnologia aberta.',
       '/avatar.jpg',
       'pt'
WHERE NOT EXISTS (SELECT 1 FROM portfolio.profile);

-- ============================================
-- Experience + Highlights
-- Uses (org, role, start_date) as natural key for idempotency
-- ============================================

-- Kobu Agency — Full-Stack Developer Intern (2024-02 to 2024-06)
INSERT INTO portfolio.experience (role, org, start_date, end_date, location, display_order)
SELECT 'Full-Stack Developer Intern', 'Kobu Agency', DATE '2024-02-01', DATE '2024-06-30', 'Faro, Portugal', 20
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience WHERE org='Kobu Agency' AND role='Full-Stack Developer Intern' AND start_date=DATE '2024-02-01'
);

WITH exp AS (
  SELECT id FROM portfolio.experience WHERE org='Kobu Agency' AND role='Full-Stack Developer Intern' AND start_date=DATE '2024-02-01'
)
INSERT INTO portfolio.experience_highlights (experience_id, highlight, display_order)
SELECT exp.id, h.highlight, h.display_order FROM exp, (VALUES
  ('Desenvolvi um assistente virtual para geração de leads usando Python (FAISS, LangChain, Flask, OpenAI, Pickle).', 1),
  ('Construí frontend responsivo com JavaScript, CSS/SCSS, PHP e Node.js.', 2),
  ('Melhorei a recuperação de dados e a interação com clientes orientada por IA.', 3)
) AS h(highlight, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience_highlights eh WHERE eh.experience_id = (SELECT id FROM exp) AND eh.highlight = h.highlight
);

-- Outlier.ai — LLM Evaluator (Freelancer) (2024-07 to 2024-12)
INSERT INTO portfolio.experience (role, org, start_date, end_date, location, display_order)
SELECT 'LLM Evaluator (Freelancer)', 'Outlier.ai', DATE '2024-07-01', DATE '2024-12-31', 'Remoto', 30
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience WHERE org='Outlier.ai' AND role='LLM Evaluator (Freelancer)' AND start_date=DATE '2024-07-01'
);

WITH exp AS (
  SELECT id FROM portfolio.experience WHERE org='Outlier.ai' AND role='LLM Evaluator (Freelancer)' AND start_date=DATE '2024-07-01'
)
INSERT INTO portfolio.experience_highlights (experience_id, highlight, display_order)
SELECT exp.id, h.highlight, h.display_order FROM exp, (VALUES
  ('Avaliei e classifiquei respostas geradas por IA para melhorar performance e alinhamento de LLMs.', 1),
  ('Contribuí para o fine-tuning de sistemas avançados de linguagem natural.', 2)
) AS h(highlight, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience_highlights eh WHERE eh.experience_id = (SELECT id FROM exp) AND eh.highlight = h.highlight
);

-- Worten — Commercial Assistant (2022-02 to 2022-10)
INSERT INTO portfolio.experience (role, org, start_date, end_date, location, display_order)
SELECT 'Commercial Assistant', 'Worten - Equipamentos para o Lar S.A.', DATE '2022-02-01', DATE '2022-10-31', 'Lisboa, Portugal', 40
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience WHERE org='Worten - Equipamentos para o Lar S.A.' AND role='Commercial Assistant' AND start_date=DATE '2022-02-01'
);

WITH exp AS (
  SELECT id FROM portfolio.experience WHERE org='Worten - Equipamentos para o Lar S.A.' AND role='Commercial Assistant' AND start_date=DATE '2022-02-01'
)
INSERT INTO portfolio.experience_highlights (experience_id, highlight, display_order)
SELECT exp.id, h.highlight, h.display_order FROM exp, (VALUES
  ('Gestão de parcerias comerciais e de marketing, catálogo de produtos e relacionamento com fornecedores.', 1),
  ('Suporte às operações de loja e atendimento de tickets e reclamações.', 2)
) AS h(highlight, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience_highlights eh WHERE eh.experience_id = (SELECT id FROM exp) AND eh.highlight = h.highlight
);

-- Bar do Jonas e Comida Caseira — Business Manager (2019-05 to 2020-10)
INSERT INTO portfolio.experience (role, org, start_date, end_date, location, display_order)
SELECT 'Business Manager', 'Bar do Jonas e Comida Caseira', DATE '2019-05-01', DATE '2020-10-31', 'Vitória, Brasil', 50
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience WHERE org='Bar do Jonas e Comida Caseira' AND role='Business Manager' AND start_date=DATE '2019-05-01'
);

WITH exp AS (
  SELECT id FROM portfolio.experience WHERE org='Bar do Jonas e Comida Caseira' AND role='Business Manager' AND start_date=DATE '2019-05-01'
)
INSERT INTO portfolio.experience_highlights (experience_id, highlight, display_order)
SELECT exp.id, h.highlight, h.display_order FROM exp, (VALUES
  ('Gestão de operações, fornecedores, controlo de inventário e processos administrativos.', 1),
  ('Continuidade remota como Gestor Administrativo após mudança para Portugal.', 2)
) AS h(highlight, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience_highlights eh WHERE eh.experience_id = (SELECT id FROM exp) AND eh.highlight = h.highlight
);

-- Monynha Softwares — Founder & Software Engineer (ongoing)
INSERT INTO portfolio.experience (role, org, start_date, end_date, location, display_order)
SELECT 'Founder & Software Engineer', 'Monynha Softwares', DATE '2022-01-01', NULL, 'Faro, Portugal', 10
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience WHERE org='Monynha Softwares' AND role='Founder & Software Engineer' AND start_date=DATE '2022-01-01'
);

WITH exp AS (
  SELECT id FROM portfolio.experience WHERE org='Monynha Softwares' AND role='Founder & Software Engineer' AND start_date=DATE '2022-01-01'
)
INSERT INTO portfolio.experience_highlights (experience_id, highlight, display_order)
SELECT exp.id, h.highlight, h.display_order FROM exp, (VALUES
  ('Criação e manutenção do ecossistema Monynha (sites, apps e automações).', 1),
  ('Desenvolvimento full-stack com Next.js, Supabase, Flutter e Payload CMS.', 2),
  ('Gestão de pipelines CI/CD (Coolify, GitHub Actions) e infraestrutura Docker.', 3),
  ('Integração entre arte, tecnologia e IA aplicada a produtos digitais.', 4)
) AS h(highlight, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.experience_highlights eh WHERE eh.experience_id = (SELECT id FROM exp) AND eh.highlight = h.highlight
);

-- ============================================
-- Skills (levels: Beginner | Intermediate | Advanced | Expert)
-- ============================================

-- Helper: upsert-like insert for skills
-- Each INSERT guarded by WHERE NOT EXISTS on (name)

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'Python', 'Backend / IA', 'Advanced', 10
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='Python');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'LangChain', 'IA / LLMs', 'Intermediate', 20
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='LangChain');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'FAISS', 'IA / Vector DB', 'Intermediate', 30
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='FAISS');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'Flask / FastAPI', 'Backend', 'Intermediate', 40
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='Flask / FastAPI');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'SQL Server', 'Base de Dados', 'Intermediate', 50
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='SQL Server');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'Node.js / TypeScript', 'Backend', 'Advanced', 60
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='Node.js / TypeScript');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'React / Vite / Tailwind', 'Frontend', 'Advanced', 70
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='React / Vite / Tailwind');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'GitHub Actions', 'DevOps', 'Intermediate', 80
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='GitHub Actions');

INSERT INTO portfolio.skills (name, category, level, display_order)
SELECT 'Docker', 'DevOps', 'Advanced', 90
WHERE NOT EXISTS (SELECT 1 FROM portfolio.skills WHERE name='Docker');
