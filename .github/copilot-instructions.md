# AI Coding Agent Instructions````instructions

## Quick orientation for AI coding agents

## Quick Orientation

This is a Vite + React + TypeScript single-page portfolio app using Tailwind + shadcn-ui, React Router (v6), React Query and optional Supabase. Keep changes small and focused unless asked.

This is a **Vite + React + TypeScript** single-page portfolio app using **Tailwind + shadcn-ui**, React Router (v6), React Query, optional Supabase backend, and **Three.js/React-Three-Fiber** for 3D artwork previews. Keep changes small and focused unless asked.

Read first (fast path):

### Read First (Fast Path)- `src/App.tsx` — routing, lazy pages, Layout attachment.

- `src/App.tsx` — routing structure, lazy pages, `Layout` as parent route- `src/main.tsx` — app root, `ThemeProvider` and global providers.

- `src/components/Layout.tsx` — shared layout with `LiquidEther` background component (Three.js fluid simulation)- `public/data/cv.json` — canonical content (projects, artworks, series). Editing this drives the UI.

- `public/data/cv.json` — **single source of truth** for all content (projects, artworks, series, thoughts)- `src/lib/supabaseClient.ts` and `src/lib/contactLead.ts` — Supabase integration + graceful fallback when env vars are missing.

- `src/lib/language.ts` — language system broadcasting `monynha:languagechange` custom events- `src/components` — layout & UI primitives (`Layout.tsx`, `Navbar.tsx`, `ProjectCard.tsx`, `ArtworkCard.tsx`).

- `src/lib/supabaseClient.ts` + `src/lib/contactLead.ts` — Supabase integration with graceful undefined handling

Essential architecture notes (what matters):

## Architecture- Single-page app with nested routes. `Layout` is the parent route; pages are lazy-loaded in `App.tsx`.

- Content-first: frontend reads from `public/data/cv.json` and SVG thumbnails in `public/images/`. The DB migration (Supabase) is being added but the frontend still uses the JSON file.

### Routing & Pages- Supabase is optional: `supabaseClient.ts` may export undefined if env vars are absent. Call sites must handle this (see `submitContactLead`).

- **Parent route**: `Layout` wraps all pages with `Navbar`, `Footer`, and `LiquidEther` background- DB strategy: multi-schema approach — `public` for shared tables (e.g., `leads`), `portfolio` for project-specific tables. Migrations live in `supabase/migrations/` and use timestamp prefixes.

- **Lazy-loaded pages** in `src/pages/` (`Home`, `Portfolio`, `ProjectDetail`, `ArtDetail`, `SeriesDetail`, `Thoughts`, `ThoughtDetail`, `About`, `Contact`, `NotFound`)

- Nested routes: `/portfolio/:slug`, `/art/:slug`, `/series/:slug`, `/thoughts/:slug`Conventions & patterns to follow:

- Prefer existing UI primitives in `src/components/ui/` (shadcn patterns) over ad-hoc CSS.

### Data Flow- Add content (project/artwork/series) by updating `public/data/cv.json` and adding an SVG under `public/images/` (include a `<title>` tag for accessibility). Avoid adding raster images.

- **Content source**: `public/data/cv.json` (JSON file with projects, artworks, series)- Language: `src/lib/language.ts` handles detection and fires `monynha:languagechange`. Use `useCurrentLanguage` hook in `src/hooks` for components.

- **SVG thumbnails**: `public/images/` (must include `<title>` for accessibility)- Tests use Vitest. Look at `src/lib/contactLead.test.ts` for mocking style (Supabase is mocked; tests expect fallback behavior when env vars missing).

- **Database migration in progress**: Supabase tables exist (`supabase/migrations/`) but frontend still reads JSON

- **Future state**: migrate from JSON file to DB queriesDeveloper workflows (short commands — PowerShell):

```powershell

### Language System# install deps (npm only)

- **Detection**: `detectInitialLanguage()` checks localStorage → browser language → falls back to `pt`npm install

- **Broadcast**: `setLanguage()` fires `monynha:languagechange` CustomEvent

- **Hook**: `useCurrentLanguage` in `src/hooks` listens to events and re-renders components# dev server (Vite, port 8080)

- **Supported**: `['pt', 'en']` (expandable in `src/lib/language.ts`)npm run dev



### Supabase Strategy# build / preview

- **Optional**: `supabaseClient.ts` exports `undefined` if env vars missing (`VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`)npm run build

- **Multi-schema DB**:npm run preview

  - `public` schema: shared tables across Monynha projects (`leads` table with `project_source` column)

  - `portfolio` schema: project-specific tables (15 tables for MS-Portfolio)# tests (Vitest)

- **Graceful degradation**: always check `if (!supabase) { /* fallback */ }` (see `contactLead.ts`)npm run test

- **Migrations**: timestamp-prefixed SQL files in `supabase/migrations/` (e.g., `20251023000001_*.sql`)

# lint

### 3D Graphics & Animationnpm run lint

- **LiquidEther**: custom Three.js fluid simulation background (`src/components/LiquidEther.tsx`, 1492 lines)```

  - Uses WebGL shaders, velocity/divergence fields, and Poisson solver

  - Configured with theme colors from `useThemePalette` hookFiles and places to NOT change without checking first:

  - Runs only on desktop (`hidden md:block` in `Layout.tsx`)- Global routing and page composition: `src/App.tsx` and `src/components/Layout.tsx`.

- **Art3DPreview**: React-Three-Fiber component for artwork previews- `public/data/cv.json` schema shape — many components depend on its field names.

  - Uses `<OrbitControls>`, `<MeshDistortMaterial>` from `@react-three/drei`- Tailwind config and design tokens unless the change is narrowly scoped.

  - Implements visibility detection to pause animation when tab hidden

  - Example: animated torus knot sculpture with distortion materialSupabase & migrations (practical):

- Migrations: add SQL files to `supabase/migrations/` with the existing timestamp prefix format (e.g., `20251023000007_add_x.sql`).

## Developer Workflows- When writing code that uses `supabase`, always guard for undefined: `if (!supabase) { /* fallback */ }`.

- See `SUPABASE.md` for onboarding the DB locally / secrets.

### Commands (PowerShell)

```powershellSmall examples to cite in PRs:

npm install          # install deps (npm only - enforced)- Language event: `src/lib/language.ts` (functions: `detectInitialLanguage`, `setLanguage`, event name `monynha:languagechange`).

npm run dev          # dev server on port 8080- Contact persistence: `src/lib/contactLead.ts` and `src/lib/supabaseClient.ts` (handles absent env vars and includes `project_source='portfolio'`).

npm run build        # production build- Data-driven page: `src/pages/ProjectDetail.tsx` reads entries from `public/data/cv.json`.

npm run build:dev    # dev mode build

npm run preview      # preview built siteQuality gates to validate locally:

npm run test         # run Vitest tests- Build: `npm run build` (check for bundling errors and large SVGs).

npm run lint         # ESLint check- Tests: `npm run test` (unit tests with Vitest; Supabase must be mocked in tests).

```- Lint/typecheck: `npm run lint` (project scripts wired in `package.json`).



### Package ManagementWhen editing or adding files:

- **Primary**: npm (locked via `package.json` engines field: `>=20.19.0` for Node, `>=9.0.0` for npm)- Keep changes small and include file-level rationale in PR descriptions.

- **Lock file**: `package-lock.json` committed to git- For data + image changes include a quick local preview and mention accessibility (`<title>` in SVGs).

- **NOT used**: pnpm, yarn, bun (lock files gitignored)

If anything here is unclear or you want more examples (tests, adding pages, or migration examples), say which area to expand.

## Conventions & Patterns

````## Quick orientation for AI coding agents

### Adding Content

1. Edit `public/data/cv.json` (projects/artworks/series)This repository is a Vite + React + TypeScript single-page portfolio site that uses shadcn-ui, Tailwind, React Router (v6), React Query, Supabase (optional), and Three/React-Three for artwork previews. Keep instructions concise and make minimal changes unless asked.

2. Add SVG thumbnail to `public/images/` with `<title>` tag

3. Run `npm run build` to check bundle sizeKey places to read first:

4. Avoid raster images (PNG/JPG) — SVG only- `src/App.tsx` — app composition, route layout and lazy pages.

- `src/main.tsx` — app root and `ThemeProvider` usage.

### Language-Aware Components- `src/lib` — small utilities and integration points (language handling, content helpers, `supabaseClient.ts`, `contactLead.ts`).

```typescript- `public/data/cv.json` — single source of truth for projects, artworks and series. Changes here drive pages and cards.

import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';- `src/components` — UI primitives and shared layout (`Layout.tsx`, `Navbar.tsx`, `ProjectCard.tsx`, `ArtworkCard.tsx`).



function MyComponent() {Architecture & conventions (practical, discoverable):

  const lang = useCurrentLanguage(); // 'pt' | 'en'- Single-page app with nested routes: `Layout` is the parent route (see `App.tsx`). Pages are lazy-loaded.

  // re-renders on language change- Data: content is driven from `public/data/cv.json` and static SVG thumbnails in `public/images/`. Avoid adding raster images to the repo.

}  - **Migration in progress**: Portfolio schema tables created in Supabase (see `supabase/migrations/`). Frontend still reads from cv.json. Future: migrate to DB queries.

```- Language: `src/lib/language.ts` controls language selection and broadcasts `monynha:languagechange` events. Add languages by updating `SUPPORTED_LANGUAGES` and `public/data` translations.

- Forms & persistence: `src/lib/supabaseClient.ts` reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, and `VITE_SUPABASE_SCHEMA`. If missing, the code gracefully disables persistence and tests expect fallback behavior (see `contactLead.ts` and `contactLead.test.ts`).

### Supabase-Safe Code- Database schema strategy: **Multi-project database** with two schemas:

```typescript  - `public` schema: shared tables across all Monynha projects (e.g., `leads` table with `project_source` column to identify origin)

import { supabase } from '@/lib/supabaseClient';  - `portfolio` schema: project-specific tables for MS-Portfolio content (15 tables: projects, artworks, series, thoughts, experience, skills, etc.)

  - All migrations in `supabase/migrations/` with timestamp prefix (e.g., `20251023000001_create_core_tables.sql`)

async function saveData() {  - When adding tables, decide if shared (→ `public`) or project-specific (→ `portfolio`). All `leads` submissions automatically include `project_source='portfolio'`.

  if (!supabase) {- Styling: Tailwind + shadcn components. Prefer existing UI primitives in `src/components/ui/` instead of creating new styles from scratch.

    // fallback: email, console.warn, etc.

    return;Package management:

  }- **Primary package manager**: npm (enforced via `.npmrc` with `engine-strict=true`)

  const { data, error } = await supabase.from('leads').insert({ ... });- **Lock file**: `package-lock.json` (committed to git)

}- **Not used**: pnpm, yarn, bun (lock files are gitignored)

```- Always use `npm install` to add dependencies (never `pnpm`, `yarn`, or `bun`)

- Vite handles all bundling and dev server (port 8080)

### Testing Pattern

- **Framework**: Vitest with mocksBuild / dev / test commands (use project scripts in `package.json`):

- **Example**: `src/lib/contactLead.test.ts` (mocks Supabase, expects fallback behavior)- Start dev server: `npm run dev` (Vite on port 8080 per `vite.config.ts`).

- **Rule**: always mock external clients (Supabase, APIs)- Build: `npm run build` (or `npm run build:dev` for dev-mode build).

- Preview built site: `npm run preview`.

## Files to NOT Change Without Asking- Lint: `npm run lint`.

- Run tests: `npm run test` (Vitest). Look at `src/lib/*.test.ts` for examples.

- `src/App.tsx` and `src/components/Layout.tsx` — routing & layout affect all pages

- `public/data/cv.json` schema shape — many components depend on field namesImplementation patterns and examples:

- Tailwind config and design tokens — unless narrowly scoped- Add a new project/artwork/series: update `public/data/cv.json` and add an SVG thumbnail in `public/images/` (include `<title>` for accessibility). Then run `npm run build` to check bundle size.

- `src/components/LiquidEther.tsx` — complex shader/Three.js code (1492 lines)- Language-aware components: subscribe to `monynha:languagechange` or use `useCurrentLanguage` hook in `src/hooks` to react to changes.

- Supabase-safe code: check `supabase` export in `src/lib/supabaseClient.ts` for undefined — call sites must handle missing client and fall back (see `submitContactLead`).

## Quality Gates- Tests: use Vitest with mocks (see `contactLead.test.ts`) — follow that mocking style for external clients.



```powershellWhat NOT to change without asking:

npm run build        # check for bundling errors, large SVGs- Global routing structure in `src/App.tsx` and `Layout.tsx` — changes here affect many pages.

npm run test         # unit tests (Supabase must be mocked)- `public/data/cv.json` schema shape (projects array and fields) — maintain field names unless updating all consumers.

npm run lint         # typecheck + ESLint- Tailwind config and design tokens unless adding a clearly scoped style.

```

Helpful code pointers (examples to cite in PRs):

## Helpful Code Pointers- Language: `src/lib/language.ts` (detectInitialLanguage, setLanguage, event name `monynha:languagechange`).

- Contact persistence: `src/lib/contactLead.ts` and `src/lib/supabaseClient.ts` (handles absent env vars).

| Pattern | Location | Notes |- Lazy routes & layout: `src/App.tsx` and `src/components/Layout.tsx`.

|---------|----------|-------|- Data source: `public/data/cv.json` and `src/pages/*` pages that consume it (e.g., `ProjectDetail.tsx`).

| Language system | `src/lib/language.ts` | `detectInitialLanguage`, `setLanguage`, event name |

| Contact persistence | `src/lib/contactLead.ts` | Handles absent env vars, includes `project_source='portfolio'` |If you need to run the app locally (Windows PowerShell):

| 3D preview | `src/components/Art3DPreview.tsx` | React-Three-Fiber with visibility control |```powershell

| Fluid background | `src/components/LiquidEther.tsx` | Custom Three.js fluid sim (desktop only) |# install

| Data-driven page | `src/pages/ProjectDetail.tsx` | Reads from `cv.json` |npm install



## Database Details# dev server

npm run dev

- **Full docs**: see `SUPABASE.md` in repo root

- **Schema strategy**: `public` for shared, `portfolio` for project-specific# run tests

- **All migrations**: `supabase/migrations/` with timestamp prefixnpm run test

- **Contact leads**: auto-include `project_source='portfolio'` field```



## PR GuidelinesWhen creating PRs or edits:

- Keep changes small and focused. Reference the exact files you edited and the reason.

- Keep changes small with file-level rationale- For data changes (JSON/SVG), include a sample preview (screenshot or local build) and confirm accessibility (`<title>` on SVGs).

- For data/SVG changes: include preview + confirm accessibility (`<title>`)- For changes touching persistence, include environment variable instructions and ensure fallback behavior remains intact.

- For persistence changes: document env vars and fallback behavior

Database / Supabase:

---- Complete setup and usage instructions: see `SUPABASE.md` in the repo root.

- Quick reference: multi-schema strategy (`public` for shared tables like `leads`, `portfolio` for project-specific tables).

**Need examples?** Ask for: test harness, adding pages, migration examples, or 3D component patterns.- All contact submissions auto-include `project_source='portfolio'` field.

- Always check if `supabase` client exists before using (can be undefined if credentials missing).

If anything in this file is unclear or you want more examples (e.g., test harness, adding a new page), tell me which area to expand.
