-- Migration: Seed contact singleton
-- Created: 2025-11-02
-- Description: Populate contact table with configuration from cv.json

-- ============================================
-- Insert Contact Configuration (Singleton)
-- ============================================
INSERT INTO portfolio.contact (email, availability, note, success_message, error_message)
SELECT 
  'marcelo@monynha.com',
  'Disponível para colaborações e oportunidades criativas.',
  'Entre em contato para projetos, parcerias ou ideias fora da caixa!',
  'Mensagem enviada com sucesso! Entrarei em contato em breve 🌈',
  'Ops! Algo deu errado. Tenta novamente mais tarde 💜'
WHERE NOT EXISTS (SELECT 1 FROM portfolio.contact);

-- ============================================
-- Verification Query
-- ============================================
-- After migration, verify:
-- SELECT * FROM portfolio.contact;
-- Expected: 1 row with contact configuration
