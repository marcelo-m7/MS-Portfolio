# AGENTS.md

## Objetivo
Evoluir o MS-Portfolio como um produto técnico real: rápido, acessível, modular, alinhado à marca Monynha Softwares e ainda claramente pessoal de Marcelo Santos. Toda mudança deve facilitar manutenção futura por agentes e developers humanos.

## Stack
- Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- OGL / Three.js / React Three Fiber
- React Query
- i18n local
- Supabase opcional
- Vitest

## Setup
- Instalação: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Testes: `npm run test`
- Preview local: `npm run preview`

## Estrutura relevante
- `src/components/` → componentes UI e blocos reutilizáveis.
- `src/components/background/` → camadas de background e fallbacks visuais.
- `src/components/sections/` → secções maiores, lazy-loadables.
- `src/hooks/` → hooks de dados, device capabilities, i18n, etc.
- `src/lib/` → utilitários transversais.
- `src/services/` → acesso a fallback/data loaders e futuras integrações externas.
- `src/config/` → configuração centralizada de site e APIs.
- `public/data/cv.json` → fallback local obrigatório.
- `TODO.md` → estado do projeto; mantenha atualizado após mudanças relevantes.

## Performance e 3D
- Não quebrar performance com 3D. Toda experiência 3D deve ter fallback estático ou versão degradada.
- Sempre respeitar `prefers-reduced-motion`.
- Componentes 3D e secções pesadas devem ser lazy loaded.
- Reduza DPR, geometria, luzes, shaders ou interação quando o hardware for limitado.
- Não force renderização 3D em mobile/dispositivos fracos só por estética.
- Antes de adicionar animações, pergunte: isso melhora produto ou só custa FPS?

## Dados dinâmicos
- Evitar dependência total de dados estáticos.
- Preferir GitHub GraphQL quando houver token; usar REST/fallback local quando não houver.
- Nunca hardcodar URLs de API, tokens ou usernames fora de `src/config/` e `ImportMetaEnv`.
- Para Supabase, sempre tratar cliente indefinido e manter fallback em `cv.json`.
- Se uma API externa falhar, a UI precisa continuar útil e legível.

## Branding e UX
- Respeitar o equilíbrio entre portfólio pessoal e branding Monynha.
- A assinatura recomendada é: `Marcelo Santos / Monynha Softwares`.
- Use linguagem visual premium, clara e técnica; evite exageros visuais que prejudiquem leitura.
- Mobile first, spacing consistente e loading states claros.
- Se fizer mudança perceptível de interface e houver ferramenta disponível, capture screenshot.

## Regras de qualidade
- Não usar soluções improvisadas que dificultem extração futura para `@monynha/ui`.
- Preferir componentes reutilizáveis e config centralizada.
- Não reintroduzir providers duplicados ou lógica espalhada de metadata/SEO.
- Documente decisões, limitações e pendências em `TODO.md`.
- Mantenha testes, lint e build funcionando sempre que possível.
- Não alterar estrutura de `src/App.tsx`, `Layout.tsx` ou `vite.config.ts` sem necessidade clara; quando alterar, documente o motivo.

## O que não fazer
- Não adicionar 3D pesado sem fallback.
- Não deixar dados críticos totalmente estáticos se houver integração dinâmica viável.
- Não hardcodar envs/tokens/endpoints em componentes.
- Não misturar branding Monynha de forma agressiva a ponto de apagar a identidade pessoal.
- Não encerrar a tarefa sem atualizar `TODO.md` quando houver mudanças significativas.

## Checklist final
- [ ] Build, lint e testes executados ou limitações explicitadas.
- [ ] Fallbacks implementados para animações/3D/API.
- [ ] Metadata/SEO revisados se a página foi afetada.
- [ ] Nenhum hardcode novo de API/token.
- [ ] `TODO.md` atualizado.
- [ ] Resumo final com decisões técnicas, pendências e arquivos alterados.
