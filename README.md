# MS-Portfolio — Marcelo Santos

[![CI](https://github.com/marcelo-m7/MS-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/marcelo-m7/MS-Portfolio/actions/workflows/ci.yml)
[![Production](https://img.shields.io/badge/Production-Live-success)](https://marcelo.monynha.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)

Portfolio pessoal e site profissional de Marcelo M7, fundador da Monynha Softwares. Este repositório é um laboratório vivo para interações modernas, acessibilidade, 3D e boas práticas de front-end.

## Table of Contents

- [MS-Portfolio — Marcelo Santos](#ms-portfolio--marcelo-santos)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Setup](#setup)
  - [Development](#development)
  - [Testing](#testing)
  - [Build](#build)
  - [Deployment](#deployment)
  - [Architecture \& Stack](#architecture--stack)
  - [Database](#database)
    - [Quick Setup](#quick-setup)
    - [Database Schema (15 Tables)](#database-schema-15-tables)
  - [Language handling](#language-handling)
  - [Adding new projects to `cv.json`](#adding-new-projects-to-cvjson)
  - [Contributing](#contributing)
  - [License / Contact](#license--contact)

## Overview

SPA built with Vite + React + TypeScript, styled with Tailwind and shadcn/ui, data-driven via a `cv.json` source with optional Supabase backend. CI runs lint, tests, and build on every push/PR.

## Setup

Prerequisites:

- Node.js >= 20.19
- npm >= 9

Install dependencies:

```bash
npm install
```

Optional: create `.env` for Supabase (see [Database](#database)).

## Development

Start the dev server (port 8080):

```bash
npm run dev
```

## Testing

Run unit tests (Vitest):

```bash
npm run test
```

With coverage:

```bash
npm run test -- --coverage
```

## Build

Create a production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Deployment

This is a static site. Deploy the `dist/` output to your hosting provider (e.g., Vercel, Netlify, Cloudflare Pages, Coolify). For PRs and non-main branches, CI includes a deployment preview validation step for configuration presence.

```text
MS-Portfolio/
├── src/
│   ├── components/     # UI components (shadcn + custom)
│   ├── pages/          # Route pages (lazy-loaded)
│   ├── lib/            # Utilities & Supabase client
│   ├── types/          # TypeScript type definitions
│   └── hooks/          # Custom React hooks
├── public/
│   ├── data/           # cv.json (fallback data source)
│   └── images/         # Static SVG assets
└── supabase/
    └── migrations/     # Database schema & seed data
```

## Architecture & Stack

- Frontend: React 18 + TypeScript + Vite 7
- Styling: Tailwind CSS + shadcn/ui
- State/Async: TanStack Query (React Query)
- 3D Graphics: Three.js / React Three Fiber
- Animations: Framer Motion
- Routing: React Router v6
- Testing: Vitest + happy-dom
- Linting: ESLint 9
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`)

## Database

This project uses **Supabase** for backend persistence with **graceful degradation**:

- ✅ When Supabase is configured: Data fetched from database, contact form saves to DB + email fallback
- 📦 When Supabase is unavailable: Falls back to `cv.json` file, contact form uses email-only

### Quick Setup

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   VITE_SUPABASE_SCHEMA=portfolio
   ```

3. (Optional) Configure email fallback for contact form:
   - Deploy the `send-contact-email` Edge Function (see `EDGE_FUNCTION_SETUP.md`)
   - Add `RESEND_API_KEY` secret in Supabase Dashboard
4. Restart the dev server

**📖 For complete database setup, schema details, and migration guide, see [SUPABASE.md](./SUPABASE.md)**  
**📧 For Edge Function deployment and email configuration, see [EDGE_FUNCTION_SETUP.md](./EDGE_FUNCTION_SETUP.md)**

### Database Schema (15 Tables)

- `profile` - Portfolio owner profile (singleton)
- `contact` - Contact form configuration (singleton)
- `projects` + `project_stack` + `technologies` - Project portfolio with tech stack
- `artworks` + `artwork_media` + `artwork_materials` - Art portfolio with media files
- `series` + `series_works` - Collections of related projects/artworks
- `thoughts` + `thought_tags` - Blog posts/articles with tags
- `experience` + `experience_highlights` - Work history with achievements
- `skills` - Technical skills with proficiency levels

All contact form submissions automatically include `project_source='portfolio'` to identify their origin.

## Language handling

The portfolio content is authored in Portuguese. The helper located at `src/lib/language.ts` keeps the `<html lang>` attribute in sync with the visitor preference stored in `localStorage` (`monynha-lang`) and broadcasts updates through the `monynha:languagechange` custom event. The `useCurrentLanguage` hook consumes that event so pages can reactively adjust locale-sensitive elements such as date formatting.

When introducing new locales, extend the `SUPPORTED_LANGUAGES` tuple inside `src/lib/language.ts` and provide translated copy for the pages and JSON datasets under `public/data/`.

To change the language programmatically you can call:

```ts
import { setLanguage } from '@/lib/language';

setLanguage('pt');
```

## Adding new projects to `cv.json`

Project cards, portfolio thumbnails and extra pages consume the single source of truth located at `public/data/cv.json`.

1. Duplicate an existing entry inside the `projects` array and adjust the fields (`name`, `summary`, `stack`, `url`, `category`, `year`).
2. Create a **vector** thumbnail (SVG only) under `public/images/`. Make sure to include a descriptive `<title>` element for accessibility and keep the canvas 16:9 (640x360 works well).
3. Reference the SVG through the `thumbnail` property (e.g. `"thumbnail": "/images/novo-projeto.svg"`).
4. Run `npm run build` to ensure the bundle stays under budget.

Thoughts, artworks or series follow the same approach: update the JSON and link SVG assets—no raster formats should be added to the repository.

## Contributing

Issues and PRs are welcome. Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, commit conventions, and local setup.

## License / Contact

MIT. © Marcelo Santos — [marcelo.monynha.com](https://marcelo.monynha.com)

For opportunities or questions, reach me at: <mailto:marcelo@monynha.com>
