## Quick orientation for AI coding agents

This repository is a Vite + React + TypeScript single-page portfolio site that uses shadcn-ui, Tailwind, React Router (v6), React Query, Supabase (optional), and Three/React-Three for artwork previews. Keep instructions concise and make minimal changes unless asked.

Key places to read first:
- `src/App.tsx` — app composition, route layout and lazy pages.
- `src/main.tsx` — app root and `ThemeProvider` usage.
- `src/lib` — small utilities and integration points (language handling, content helpers, `supabaseClient.ts`, `contactLead.ts`).
- `public/data/cv.json` — single source of truth for projects, artworks and series. Changes here drive pages and cards.
- `src/components` — UI primitives and shared layout (`Layout.tsx`, `Navbar.tsx`, `ProjectCard.tsx`, `ArtworkCard.tsx`).

Architecture & conventions (practical, discoverable):
- Single-page app with nested routes: `Layout` is the parent route (see `App.tsx`). Pages are lazy-loaded.
- Data: content is driven from `public/data/cv.json` and static SVG thumbnails in `public/images/`. Avoid adding raster images to the repo.
  - **Migration in progress**: Portfolio schema tables created in Supabase (see `supabase/migrations/`). Frontend still reads from cv.json. Future: migrate to DB queries.
- Language: `src/lib/language.ts` controls language selection and broadcasts `monynha:languagechange` events. Add languages by updating `SUPPORTED_LANGUAGES` and `public/data` translations.
- Forms & persistence: `src/lib/supabaseClient.ts` reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, and `VITE_SUPABASE_SCHEMA`. If missing, the code gracefully disables persistence and tests expect fallback behavior (see `contactLead.ts` and `contactLead.test.ts`).
- Database schema strategy: **Multi-project database** with two schemas:
  - `public` schema: shared tables across all Monynha projects (e.g., `leads` table with `project_source` column to identify origin)
  - `portfolio` schema: project-specific tables for MS-Portfolio content (15 tables: projects, artworks, series, thoughts, experience, skills, etc.)
  - All migrations in `supabase/migrations/` with timestamp prefix (e.g., `20251023000001_create_core_tables.sql`)
  - When adding tables, decide if shared (→ `public`) or project-specific (→ `portfolio`). All `leads` submissions automatically include `project_source='portfolio'`.
- Styling: Tailwind + shadcn components. Prefer existing UI primitives in `src/components/ui/` instead of creating new styles from scratch.

Package management:
- **Primary package manager**: npm (enforced via `.npmrc` with `engine-strict=true`)
- **Lock file**: `package-lock.json` (committed to git)
- **Not used**: pnpm, yarn, bun (lock files are gitignored)
- Always use `npm install` to add dependencies (never `pnpm`, `yarn`, or `bun`)
- Vite handles all bundling and dev server (port 8080)

Build / dev / test commands (use project scripts in `package.json`):
- Start dev server: `npm run dev` (Vite on port 8080 per `vite.config.ts`).
- Build: `npm run build` (or `npm run build:dev` for dev-mode build).
- Preview built site: `npm run preview`.
- Lint: `npm run lint`.
- Run tests: `npm run test` (Vitest). Look at `src/lib/*.test.ts` for examples.

Implementation patterns and examples:
- Add a new project/artwork/series: update `public/data/cv.json` and add an SVG thumbnail in `public/images/` (include `<title>` for accessibility). Then run `npm run build` to check bundle size.
- Language-aware components: subscribe to `monynha:languagechange` or use `useCurrentLanguage` hook in `src/hooks` to react to changes.
- Supabase-safe code: check `supabase` export in `src/lib/supabaseClient.ts` for undefined — call sites must handle missing client and fall back (see `submitContactLead`).
- Tests: use Vitest with mocks (see `contactLead.test.ts`) — follow that mocking style for external clients.

What NOT to change without asking:
- Global routing structure in `src/App.tsx` and `Layout.tsx` — changes here affect many pages.
- `public/data/cv.json` schema shape (projects array and fields) — maintain field names unless updating all consumers.
- Tailwind config and design tokens unless adding a clearly scoped style.

Helpful code pointers (examples to cite in PRs):
- Language: `src/lib/language.ts` (detectInitialLanguage, setLanguage, event name `monynha:languagechange`).
- Contact persistence: `src/lib/contactLead.ts` and `src/lib/supabaseClient.ts` (handles absent env vars).
- Lazy routes & layout: `src/App.tsx` and `src/components/Layout.tsx`.
- Data source: `public/data/cv.json` and `src/pages/*` pages that consume it (e.g., `ProjectDetail.tsx`).

If you need to run the app locally (Windows PowerShell):
```powershell
# install
npm install

# dev server
npm run dev

# run tests
npm run test
```

When creating PRs or edits:
- Keep changes small and focused. Reference the exact files you edited and the reason.
- For data changes (JSON/SVG), include a sample preview (screenshot or local build) and confirm accessibility (`<title>` on SVGs).
- For changes touching persistence, include environment variable instructions and ensure fallback behavior remains intact.

Database / Supabase:
- Complete setup and usage instructions: see `SUPABASE.md` in the repo root.
- Quick reference: multi-schema strategy (`public` for shared tables like `leads`, `portfolio` for project-specific tables).
- All contact submissions auto-include `project_source='portfolio'` field.
- Always check if `supabase` client exists before using (can be undefined if credentials missing).

If anything in this file is unclear or you want more examples (e.g., test harness, adding a new page), tell me which area to expand.
