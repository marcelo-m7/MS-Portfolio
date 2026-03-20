# AGENTS.md

## Objetivo
Transformar o MS-Portfolio em um produto técnico de alto nível para Marcelo Santos dentro do ecossistema Monynha Softwares, equilibrando identidade pessoal, branding institucional, performance, dados dinâmicos e arquitetura preparada para evolução contínua.

## Stack
- Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- OGL / experiências 3D e componentes Three.js relacionados
- TanStack Query
- i18n próprio
- Supabase opcional
- Vitest

## Setup
- Instalação: `npm install`
- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Testes: `npm run test`
- Variáveis principais: `.env.example`
- Configuração central de produto/brand/endpoints: `src/config/site.ts`

## Estrutura relevante
- `src/components/` → componentes visuais e blocos reutilizáveis
- `src/components/sections/` → seções de páginas prontas para code splitting
- `src/components/background/` → experiências de fundo e fallbacks leves
- `src/hooks/` → hooks de dados, SEO, capacidades do dispositivo e UX
- `src/lib/` → serviços, integrações externas, utilitários e loaders
- `src/config/` → branding, URLs, endpoints e feature config
- `public/data/cv.json` → fallback local de conteúdo
- `TODO.md` → estado atual, pendências e orientação para continuidade

## Performance e 3D
- Não quebrar performance com 3D: qualquer animação cara deve ser lazy-loaded.
- Sempre implementar fallback visual para:
  - dispositivos fracos
  - `prefers-reduced-motion`
  - falha de WebGL/WebGPU
- Não aumentar densidade, luzes, partículas ou geometrias sem validar impacto em build e runtime.
- Prefira backgrounds estáticos/degradados fora do caminho crítico inicial.
- Antes de manter uma animação nova, valide se ela respeita LCP e loading inicial.

## Dados dinâmicos
- Evitar conteúdo totalmente estático quando houver valor real em dados dinâmicos.
- GitHub deve preferir GraphQL quando houver token configurado; manter fallback REST/local.
- Supabase deve continuar opcional: sempre tratar cliente indefinido e usar fallback em `cv.json`.
- Não hardcodar APIs novas em componentes; centralizar em `src/config/site.ts` e `src/lib/`.
- Toda nova fonte de dados precisa de loading state, estado degradado e tratamento de erro silencioso quando apropriado.

## Branding e UX
- Respeitar o equilíbrio entre portfólio pessoal e Monynha Softwares.
- A assinatura visual desejada é: **Marcelo Santos / Monynha Softwares**.
- Priorizar clareza de leitura, espaçamento consistente, responsividade perfeita e hierarquia visual forte.
- Componentes reutilizáveis devem favorecer futura extração para `@monynha/ui`.
- Não introduzir linguagem corporativa excessiva que apague o caráter pessoal do portfólio.

## Regras de qualidade
- Manter tipagem forte e evitar soluções improvisadas.
- Documentar mudanças estruturais e pendências no `TODO.md`.
- Se alterar SEO, revisar title, description, canonical e OG/Twitter metadata.
- Se alterar UX perceptível, tentar registrar screenshot; se a ferramenta não estiver disponível, documentar isso no resumo final.
- Não alterar estrutura de `src/App.tsx`, `Layout.tsx` ou `vite.config.ts` sem necessidade real e justificada pela tarefa.
- Não deixar integrações externas sem fallback.

## O que não fazer
- Não reativar 3D pesado em mobile por padrão.
- Não depender exclusivamente de `cv.json` para recursos que podem ser dinâmicos.
- Não hardcodar tokens, URLs sensíveis ou regras de negócio em componentes.
- Não remover fallback estático/leve para animações, dados ou mídia.
- Não esquecer de atualizar o `TODO.md` após mudanças relevantes.

## Checklist final
- [ ] Build executado com sucesso
- [ ] Lint executado com sucesso
- [ ] Testes executados com sucesso
- [ ] Fallbacks preservados para 3D e dados
- [ ] Branding Marcelo + Monynha revisado
- [ ] SEO revisado se páginas principais foram tocadas
- [ ] `TODO.md` atualizado
- [ ] Mudanças prontas para continuidade por outro agente
