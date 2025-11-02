# MS‑Portfolio — Marcelo Santos

[![CI](https://github.com/marcelo-m7/MS-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/marcelo-m7/MS-Portfolio/actions/workflows/ci.yml)
[![Production](https://img.shields.io/badge/Production-Live-success)](https://marcelo.monynha.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)

> Portfólio moderno, rápido e acessível — feito com Vite + React + TypeScript, animações 3D e suporte multilíngue. Um laboratório vivo de UX, performance e boas práticas.

Live: [marcelo.monynha.com](https://marcelo.monynha.com)  
Autor: [@marcelo-m7](https://github.com/marcelo-m7) — Founder @ Monynha Softwares

---

## ✨ Destaques

- ⚡ Performance first: Vite, split de bundles e otimizações de SVG
- 🧩 UI consistente: Tailwind + shadcn/ui
- 🌐 Multilíngue: PT, EN, ES, FR (dinâmico via `cv.json` + cache de traduções)
- 🧠 Resiliente: integra com Supabase e faz fallback automático para JSON
- 🎨 3D & Motion: React Three Fiber + Framer Motion (respeita `prefers-reduced-motion`)
- 🧪 Qualidade: CI com lint, testes (Vitest) e build a cada PR

---

## 🚀 Comece rápido

Pré-requisitos:

- Node.js >= 20.19
- npm >= 9

Instale dependências:

```powershell
npm install
```

Ambiente (opcional, Supabase): crie `.env` (veja "Banco de dados")

Dev server (porta 8080):

```powershell
npm run dev
```

Build de produção:

```powershell
npm run build
```

Preview do build:

```powershell
npm run preview
```

Testes e lint:

```powershell
npm run test
npm run lint
```

---

## 🧰 Scripts úteis

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — serve o build localmente
- `npm run test` — Vitest (use `--coverage` para cobertura)
- `npm run lint` — ESLint + typecheck

---

## 🏗️ Arquitetura em 1 minuto

- Frontend: React 18 + TypeScript + Vite 7
- Estilos: Tailwind + shadcn/ui
- Estado/Async: TanStack Query
- 3D: Three.js / React Three Fiber
- Animações: Framer Motion
- Router: React Router v6
- Testes: Vitest (+ happy-dom)
- CI/CD: GitHub Actions

Estrutura:

```text
MS-Portfolio/
├── src/
│   ├── components/     # UI (shadcn + custom)
│   ├── pages/          # Rotas (lazy-loaded)
│   ├── lib/            # Utils, client Supabase, traduções
│   ├── hooks/          # Hooks React
│   └── types/          # Tipos TS
├── public/
│   ├── data/           # cv.json (fonte de conteúdo)
│   └── images/         # SVGs acessíveis (com <title>)
└── supabase/
    └── migrations/     # Schema & seeds
```

---

## 🌍 Conteúdo & Idiomas

- Fonte única de conteúdo: `public/data/cv.json` (projetos, séries, artes, pensamentos)
- Idiomas e eventos: `src/lib/language.ts` (evento `monynha:languagechange`)
- Traduções dinâmicas: `src/lib/translateService.ts` (endpoint web do Google Translate com cache em `localStorage`)

Adicionar conteúdo:

1) Edite `public/data/cv.json`  
2) Adicione uma miniatura SVG em `public/images/` com `<title>`  
3) Referencie no JSON (ex.: `"thumbnail": "/images/meu-projeto.svg"`)  
4) Rode `npm run build` para verificar orçamento de bundle

---

## 🗄️ Banco de dados (opcional)

Integra com **Supabase** e faz graceful fallback para `cv.json` quando indisponível.

1) Crie `.env` com:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-anon-key
VITE_SUPABASE_SCHEMA=portfolio
```

2) (Opcional) E-mail de fallback do formulário de contato:

- Deploy da Edge Function `send-contact-email` (veja `EDGE_FUNCTION_SETUP.md`)
- Configure o segredo `RESEND_API_KEY` no Supabase

Documentação completa: [SUPABASE.md](./SUPABASE.md) • [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md)

Schema (15 tabelas): `profile`, `contact`, `projects` (+ stack), `artworks` (+ media/materials), `series` (+ works), `thoughts` (+ tags), `experience` (+ highlights), `skills`.

---

## 🧪 Qualidade

- Testes: `npm run test` (Vitest)
- Lint/Typecheck: `npm run lint`
- CI: build + lint + tests a cada push/PR

---

## 🤝 Contribuindo

PRs e issues são bem-vindos. Leia o [CONTRIBUTING.md](./CONTRIBUTING.md) para convenções de commit e setup local.

Se este projeto te ajudou, deixa uma ⭐ para apoiar!

---

## 📬 Conecte-se

- 🌐 Site (Live): [marcelo.monynha.com](https://marcelo.monynha.com)
- � LinkedIn: [linkedin.com/in/marcelo-m7](https://www.linkedin.com/in/marcelo-m7)
- 🐙 GitHub: [github.com/marcelo-m7](https://github.com/marcelo-m7)
- ✉️ E-mail: <mailto:marcelo@monynha.com>

Feito com ❤️ em Faro, Portugal — por Marcelo M7 (Monynha Softwares).

---

## 📄 Licença

MIT — © Marcelo Santos. Veja detalhes neste arquivo.
