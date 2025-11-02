-- Migration: Seed projects and project_stack tables
-- Created: 2025-11-02
-- Description: Populate all 11 projects from cv.json with technology relationships

-- ============================================
-- Insert Projects (11 total)
-- ============================================

-- 1. BotecoPro
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'botecopro',
  'BotecoPro',
  'Sistema de gestão para bares e restaurantes com IA integrada para otimizar operações e melhorar a eficiência do negócio.',
  'BotecoPro centraliza operações de bares e restaurantes com automação de pedidos, gestão de estoque e dashboards em tempo real. A camada de IA recomenda ações preventivas, reduz desperdícios e empodera equipas a oferecer experiências consistentes em cada serviço.',
  'https://app.boteco.pro',
  'app.boteco.pro',
  'https://github.com/Monynha-Softwares/BotecoPro',
  '/images/botecopro.svg',
  'Soluções Empresariais',
  'Desenvolvimento',
  'Interna',
  2025,
  10
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'botecopro');

-- 2. Boteco.pt
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'boteco-pt',
  'Boteco.pt',
  'Site institucional multilíngue (pt/en/es/fr) do BotecoPro com foco em performance, acessibilidade e experiência do usuário.',
  'Boteco.pt é a vitrine digital do BotecoPro, apresentando soluções de gestão para bares e restaurantes. O site combina design responsivo, lazy loading progressivo, testes visuais automatizados e suporte a 4 idiomas. A arquitetura prioriza Core Web Vitals, SEO e acessibilidade WCAG, com bundle otimizado (75% de redução) e sistema de design customizado com shadcn/ui.',
  'https://boteco.pt',
  'boteco.pt',
  'https://github.com/marcelo-m7/boteco.pt',
  '/images/boteco-pt.svg',
  'Institucional',
  'Produção',
  'Pública',
  2025,
  20
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'boteco-pt');

-- 3. FACODI
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'facodi',
  'FACODI',
  'Faculdade Comunitária Digital — plataforma de educação comunitária aberta e gratuita, com foco em inclusão social.',
  'FACODI democratiza o acesso a cursos superiores por meio de trilhas interativas, conteúdos revisados por especialistas e ferramentas de apoio comunitário. A plataforma prioriza acessibilidade, conectividade de baixa largura de banda e governança colaborativa.',
  'https://facodi.pt',
  'facodi.pt',
  'https://github.com/Monynha-Softwares/facodi.pt',
  '/images/facodi.svg',
  'Educação',
  'Produção',
  'Pública',
  2025,
  30
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'facodi');

-- 4. MonynhaTech
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'monynhatech',
  'MonynhaTech',
  'Blog técnico e centro de documentação multilíngue da empresa.',
  'MonynhaTech concentra notas técnicas, tutoriais e a visão de arquitetura dos produtos Monynha. A curadoria em múltiplos idiomas garante que equipas globais acompanhem decisões, padrões de design e integrações com a stack oficial.',
  'https://monynha.tech',
  'monynha.tech',
  'https://github.com/Monynha-Softwares/MonynhaTech',
  '/images/monynha-tech.svg',
  'Documentação',
  'MVP',
  'Interna',
  2025,
  40
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'monynhatech');

-- 5. Art Leo
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'artleo',
  'Art Leo',
  'Portfólio artístico e espaço de demonstrações criativas.',
  'Art Leo apresenta narrativas digitais, esculturas 3D e experiências interativas desenvolvidas com React Three Fiber. O projeto celebra artistas LGBTQIAP+ e mantém performance otimizada para dispositivos móveis e realidade aumentada.',
  'https://artleo.monynha.com',
  'artleo.monynha.com',
  'https://github.com/Monynha-Softwares/artleo-creative-spaces',
  '/images/artleo.svg',
  'Arte Digital',
  'Produção',
  'Pública',
  2025,
  50
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'artleo');

-- 6. AssisTina
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'assistina',
  'AssisTina',
  'Assistente virtual por IA para atendimento e automação de processos.',
  'AssisTina combina modelos de linguagem, fluxos de automação e integrações omnicanal para responder clientes com rapidez e empatia. A solução aprende com feedback humano e mantém trilhas auditáveis para governança responsável de IA.',
  NULL,
  NULL,
  'https://github.com/Monynha-Softwares/AssisTina',
  '/images/assistina.svg',
  'IA Conversacional',
  'Desenvolvimento',
  'Interna',
  2025,
  60
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'assistina');

-- 7. MonaDocs
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'monadocs',
  'MonaDocs',
  'Template de documentação técnica para portais e produtos Monynha.',
  'MonaDocs oferece uma base estática elegante para portais de documentação com suporte a Markdown avançado, componentes shadcn/ui e integração contínua com o design system Monynha.',
  'https://docs.monynha.com',
  'docs.monynha.com',
  'https://github.com/Monynha-Softwares/MonaDocs',
  '/images/monadocs.svg',
  'Documentação',
  'Produção',
  'Pública',
  2024,
  70
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'monadocs');

-- 8. Monynha.com
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'monynha-com',
  'Monynha.com (Institucional)',
  'Site institucional da Monynha Softwares com branding e informações corporativas.',
  'O site institucional consolida manifesto, propostas de valor e canais de contacto da Monynha Softwares. A arquitetura prioriza performance, acessibilidade AA e narrativa alinhada ao dossiê institucional.',
  'https://monynha.com',
  'monynha.com',
  'https://github.com/Monynha-Softwares/Monynha-com',
  '/images/monynha-com.svg',
  'Institucional',
  'Produção',
  'Pública',
  2024,
  80
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'monynha-com');

-- 9. Monynha Online (Infra Hub)
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'infra-hub',
  'Monynha Online',
  'Hub central da infraestrutura Monynha, baseado em Coolify.',
  'Monynha Online orquestra pipelines, monitorização e deploys automatizados com Coolify e contêineres isolados. A camada de observabilidade garante estabilidade para experiências públicas e privadas do ecossistema Monynha.',
  'https://monynha.online',
  'monynha.online',
  'https://github.com/Monynha-Softwares/MonynhaOnline-Default-Page',
  '/images/infra-hub.svg',
  'Infraestrutura',
  'MVP',
  'Interna',
  2024,
  90
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'infra-hub');

-- 10. Open WebUI
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'open-webui',
  'Open WebUI',
  'Instância Open WebUI para IA local e web.',
  'A instância Open WebUI da Monynha facilita experimentação segura com modelos locais e serviços hospedados. O ambiente é integrado ao Monynha Online e segue políticas de privacidade para treino e teste de agentes.',
  'https://ai.monynha.com',
  'ai.monynha.com',
  'https://github.com/open-webui/open-webui',
  '/images/open-webui.svg',
  'IA',
  'Desenvolvimento',
  'Pública',
  2025,
  100
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'open-webui');

-- 11. Marcelo Portfolio
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'marcelo-portfolio',
  'Marcelo Portfolio',
  'Portfólio pessoal e site profissional de Marcelo M7.',
  'O portfólio de Marcelo apresenta projetos, manifestos e estudos autorais dentro da linguagem visual Monynha. É construído como laboratório vivo para novas interações, acessibilidade avançada e componentes do design system interno.',
  'https://marcelo.monynha.com',
  'marcelo.monynha.com',
  'https://github.com/Monynha-Softwares/MS-Portfolio',
  '/images/marcelo-portfolio.svg',
  'Portfólio',
  'Produção',
  'Pública',
  2025,
  110
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'marcelo-portfolio');

-- 12. MonAgent
INSERT INTO portfolio.projects (slug, name, summary, full_description, url, domain, repo_url, thumbnail, category, status, visibility, year, display_order)
SELECT 
  'monagent',
  'MonAgent',
  'Sistema de agentes AI para automação e processamento inteligente de tarefas.',
  'MonAgent é uma plataforma experimental de agentes autônomos baseada em LLMs. O sistema permite orquestração de múltiplos agentes especializados, processamento paralelo de contextos e integração com ferramentas externas através de Model Context Protocol (MCP).',
  NULL,
  NULL,
  'https://github.com/Monynha-Softwares/MonAgent',
  '/images/monagent.svg',
  'IA',
  'Desenvolvimento',
  'Interna',
  2024,
  120
WHERE NOT EXISTS (SELECT 1 FROM portfolio.projects WHERE slug = 'monagent');

-- ============================================
-- Insert Project-Technology Relationships
-- ============================================

-- BotecoPro (Supabase, Flutter, React)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'botecopro'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Supabase', 'Flutter', 'React')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Supabase' THEN 1
         WHEN 'Flutter' THEN 2
         WHEN 'React' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Boteco.pt (React, TypeScript, Vite, Tailwind CSS, i18next, Playwright)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'boteco-pt'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('React', 'TypeScript', 'Vite', 'Tailwind CSS', 'i18next', 'Playwright')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'React' THEN 1
         WHEN 'TypeScript' THEN 2
         WHEN 'Vite' THEN 3
         WHEN 'Tailwind CSS' THEN 4
         WHEN 'i18next' THEN 5
         WHEN 'Playwright' THEN 6
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- FACODI (Next.js, Supabase, Payload CMS)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'facodi'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Next.js', 'Supabase', 'Payload CMS')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Next.js' THEN 1
         WHEN 'Supabase' THEN 2
         WHEN 'Payload CMS' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- MonynhaTech (Next.js, Payload CMS, Internacionalização - use i18next as proxy)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'monynhatech'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Next.js', 'Payload CMS', 'i18next')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Next.js' THEN 1
         WHEN 'Payload CMS' THEN 2
         WHEN 'i18next' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Art Leo (Next.js, React Three Fiber, Supabase)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'artleo'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Next.js', 'React Three Fiber', 'Supabase')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Next.js' THEN 1
         WHEN 'React Three Fiber' THEN 2
         WHEN 'Supabase' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- AssisTina (LLMs, WhatsApp API, Dashboards)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'assistina'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('LLMs', 'WhatsApp API', 'Dashboards')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'LLMs' THEN 1
         WHEN 'WhatsApp API' THEN 2
         WHEN 'Dashboards' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- MonaDocs (Static Site, Markdown, Design System)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'monadocs'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Static Site', 'Markdown', 'Design System')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Static Site' THEN 1
         WHEN 'Markdown' THEN 2
         WHEN 'Design System' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Monynha.com (Next.js, Tailwind CSS, Design System)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'monynha-com'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Next.js', 'Tailwind CSS', 'Design System')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Next.js' THEN 1
         WHEN 'Tailwind CSS' THEN 2
         WHEN 'Design System' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Monynha Online (Coolify, Containers, Observability)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'infra-hub'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Coolify', 'Containers', 'Observability')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Coolify' THEN 1
         WHEN 'Containers' THEN 2
         WHEN 'Observability' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Open WebUI (Open WebUI, LLMs, Docker)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'open-webui'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Open WebUI', 'LLMs', 'Docker')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Open WebUI' THEN 1
         WHEN 'LLMs' THEN 2
         WHEN 'Docker' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- Marcelo Portfolio (Vite, React, shadcn/ui)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'marcelo-portfolio'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Vite', 'React', 'shadcn/ui')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Vite' THEN 1
         WHEN 'React' THEN 2
         WHEN 'shadcn/ui' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- MonAgent (Python, LangChain, OpenAI)
WITH proj AS (SELECT id FROM portfolio.projects WHERE slug = 'monagent'),
     techs AS (
       SELECT id, name FROM portfolio.technologies 
       WHERE name IN ('Python', 'LangChain', 'OpenAI')
     )
INSERT INTO portfolio.project_stack (project_id, technology_id, display_order)
SELECT proj.id, techs.id, 
       CASE techs.name 
         WHEN 'Python' THEN 1
         WHEN 'LangChain' THEN 2
         WHEN 'OpenAI' THEN 3
       END
FROM proj, techs
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio.project_stack ps 
  WHERE ps.project_id = proj.id AND ps.technology_id = techs.id
);

-- ============================================
-- Verification Queries
-- ============================================
-- After migration, verify counts:
-- SELECT COUNT(*) FROM portfolio.projects; -- Expected: 12
-- SELECT COUNT(*) FROM portfolio.project_stack; -- Expected: 40
-- 
-- Verify project-technology relationships:
-- SELECT 
--   p.name as project,
--   array_agg(t.name ORDER BY ps.display_order) as technologies
-- FROM portfolio.projects p
-- LEFT JOIN portfolio.project_stack ps ON p.id = ps.project_id
-- LEFT JOIN portfolio.technologies t ON ps.technology_id = t.id
-- GROUP BY p.name
-- ORDER BY p.display_order;
