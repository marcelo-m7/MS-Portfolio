-- Seed thoughts and tags
-- Source: public/data/cv.json

-- ============================================
-- Thoughts
-- ============================================
INSERT INTO portfolio.thoughts (slug, title, excerpt, body, date, display_order)
VALUES (
  'design-tecnologia-inclusiva',
  'Design e Tecnologia Inclusiva',
  'A tecnologia é mais humana quando é feita para todas as pessoas — não apenas para quem tem acesso fácil a ela.',
  'Sempre acreditei que design e acessibilidade não são pontos opostos num espectro, mas duas linguagens que, quando dialogam, traduzem o verdadeiro sentido da inovação. A estética só é completa quando é compreensível. O belo só é belo quando é acessível.\n\nNa Monynha Softwares, cada interface nasce de um princípio simples: **empatia como arquitetura**. Criar não é só desenhar pixels; é entender contextos, reconhecer diferenças e garantir que ninguém fique de fora da experiência digital.\n\nImplementamos contrastes adequados, hierarquias visuais claras e navegação por teclado desde o primeiro protótipo. Evitamos animações que possam causar desconforto a pessoas sensíveis ao movimento, respeitando o `prefers-reduced-motion`. Cada componente é pensado para ser útil, não apenas bonito.\n\nMais do que cumprir normas da WCAG, tratamos acessibilidade como expressão de respeito. Cada *alt-text* é um convite à inclusão; cada *aria-label* é um gesto de empatia codificado.\n\nO design inclusivo não é um diferencial competitivo — é um ato político e ético. Porque se a tecnologia é feita por pessoas, para pessoas, então ela deve abraçar todas as formas de existir. 💜',
  DATE '2025-01-17',
  0
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  date = EXCLUDED.date,
  updated_at = NOW();

INSERT INTO portfolio.thoughts (slug, title, excerpt, body, date, display_order)
VALUES (
  'por-tras-da-monynha',
  'Por trás da Monynha',
  'Mais do que software — um movimento de orgulho, diversidade e resistência digital.',
  'A **Monynha Softwares** nasceu de um sonho coletivo: provar que tecnologia e afeto podem coexistir. Que inovação também vem da margem. Que a web pode ser um espaço de acolhimento, criação e resistência.\n\nO nome carrega essa essência. *"Mona"*, palavra de resistência do Pajubá, e o sufixo *"-nynha"*, expressão carinhosa e periférica, simbolizam a mistura de ternura, humor e coragem que definem quem somos. Criamos com amor, mas também com propósito — cada projeto é uma forma de dizer: **estamos aqui e não vamos voltar pro armário da tecnologia.** 🏳️‍🌈\n\nNosso manifesto é simples: **democratizar o digital, celebrar a diferença e hackear o sistema com orgulho.** Através de software livre, design acessível e comunidades diversas, buscamos transformar o que antes era privilégio em possibilidade.\n\nDe apps e plataformas open source a iniciativas culturais e educacionais, cada linha de código escrita pela Monynha é um gesto de resistência criativa. Nossos produtos — como o BotecoPro, o FACODI e a AssisTina — não são apenas soluções tecnológicas; são manifestações vivas de empatia, inclusão e representatividade.\n\nSer Monynha é entender que tecnologia é linguagem, e linguagem é poder. Que cada pessoa que se vê num produto é mais do que usuária — é protagonista. E é por isso que seguimos criando, dia após dia, com a certeza de que **diversidade também é performance.** 💅✨',
  DATE '2025-02-02',
  1
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  date = EXCLUDED.date,
  updated_at = NOW();

-- ============================================
-- Thought tags (ensure presence; duplicates avoided by unique constraint)
-- ============================================
WITH t AS (
  SELECT id FROM portfolio.thoughts WHERE slug = 'design-tecnologia-inclusiva'
)
INSERT INTO portfolio.thought_tags (thought_id, tag)
SELECT t.id, x.tag
FROM t
CROSS JOIN (
  VALUES
    ('Acessibilidade'),
    ('Design'),
    ('Experiência do Utilizador'),
    ('Inclusão'),
    ('UX/UI')
) AS x(tag)
ON CONFLICT (thought_id, tag) DO NOTHING;

WITH t AS (
  SELECT id FROM portfolio.thoughts WHERE slug = 'por-tras-da-monynha'
)
INSERT INTO portfolio.thought_tags (thought_id, tag)
SELECT t.id, x.tag
FROM t
CROSS JOIN (
  VALUES
    ('Cultura'),
    ('Comunidade'),
    ('Empreendedorismo'),
    ('Orgulho'),
    ('Diversidade')
) AS x(tag)
ON CONFLICT (thought_id, tag) DO NOTHING;
