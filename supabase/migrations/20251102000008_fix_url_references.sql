-- Migration: Fix URL references for BotecoPro and rename Infra Hub to Monynha Online
-- Created: 2025-11-02
-- Description: Correct BotecoPro URL to app.boteco.pro and rename "Infra Hub" to "Monynha Online"

-- Update BotecoPro project URLs (from monynha.com to app.boteco.pro)
UPDATE portfolio.projects
SET 
  url = 'https://app.boteco.pro',
  domain = 'app.boteco.pro',
  updated_at = NOW()
WHERE slug = 'botecopro';

-- Rename "Infra Hub (Monynha Online)" to just "Monynha Online"
UPDATE portfolio.projects
SET 
  name = 'Monynha Online',
  summary = 'Hub central da infraestrutura Monynha, baseado em Coolify.',
  full_description = 'Monynha Online orquestra pipelines, monitorização e deploys automatizados com Coolify e contêineres isolados. A camada de observabilidade garante estabilidade para experiências públicas e privadas do ecossistema Monynha.',
  updated_at = NOW()
WHERE slug = 'infra-hub';

-- Update Open WebUI description to reference "Monynha Online" instead of "Infra Hub"
UPDATE portfolio.projects
SET 
  full_description = 'A instância Open WebUI da Monynha facilita experimentação segura com modelos locais e serviços hospedados. O ambiente é integrado ao Monynha Online e segue políticas de privacidade para treino e teste de agentes.',
  updated_at = NOW()
WHERE slug = 'open-webui';
