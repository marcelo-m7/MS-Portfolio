# Marcelo Santos - Portfolio

[![Production](https://img.shields.io/badge/Production-Live-success)](https://marcelo.monynha.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)

Portfolio pessoal e site profissional de Marcelo M7, fundador da Monynha Softwares. Construído como laboratório vivo para novas interações, acessibilidade avançada e componentes do design system interno.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **3D Graphics**: React Three Fiber
- **Animations**: Framer Motion
- **Routing**: React Router v6

## 📁 Project Structure

```
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

## 🛠️ Development

### Prerequisites

- Node.js 20.19+ or 22.12+ (Vite 7 requirement)
- npm (primary package manager - enforced via .npmrc)

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd MS-Portfolio

# Step 3: Install dependencies
npm install

# Step 4: Start the development server (port 8080)
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

### Run Tests

```bash
# Run Vitest unit tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

## 📊 Database Architecture

This project uses **Supabase** (PostgreSQL) with a multi-schema approach:

- **`public` schema**: Shared tables across Monynha projects (e.g., `leads` table)
- **`portfolio` schema**: Project-specific tables (15 tables for portfolio content)

## Database & Backend

This project uses **Supabase** for optional backend persistence. The contact form will work with or without Supabase configured.

### Quick Setup

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   VITE_SUPABASE_SCHEMA=portfolio
   ```
3. Restart the dev server

**📖 For complete database setup, schema details, and migration guide, see [SUPABASE.md](./SUPABASE.md)**

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

## 🚀 Deployment

This project is configured for multiple deployment options:

- **Coolify / Nixpacks** (recommended) - Automatic deployment with `nixpacks.toml`
- **Static Hosting** (Vercel, Netlify, Cloudflare Pages, etc.) - Deploy the `dist/` folder

### Quick Start

```bash
# Build the project
npm run build
```

Output will be in the `dist/` folder ready for deployment.

**📖 For complete deployment instructions, including Coolify/Nixpacks setup, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

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
