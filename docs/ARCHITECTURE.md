# Architecture Overview

This document summarizes the application structure, routing, data flow, and key systems.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router v6 (SPA)
- TanStack Query (data fetching/cache)
- Three.js / React-Three-Fiber (optional visuals)
- Optional Supabase backend (graceful fallback to JSON)

## Routing & Layout

- Root: `src/App.tsx` defines routes and lazy-loading.
- Layout: `src/components/Layout.tsx` wraps all pages with `Navbar`, `Footer`, and desktop-only `Galaxy` background.
- Pages (lazy): `src/pages/`
  - `Home`, `Portfolio`, `ProjectDetail`, `ArtDetail`, `SeriesDetail`, `Thoughts`, `ThoughtDetail`, `About`, `Contact`, `NotFound`
- Nested routes:
  - `/portfolio/:slug`, `/art/:slug`, `/series/:slug`, `/thoughts/:slug`
- Error boundaries: lazy routes are wrapped for graceful failures.

## Data Flow

- Content source: `public/data/cv.json` (projects, artworks, series, thoughts)
- Images: `public/images/` (SVG only, include `<title>`)
- Hooks: `src/hooks/usePortfolioData.ts` provides `useProjects()`, `useArtwork()`, `useSeries()`, `useThoughts()`
  - Stale time: 15 min; Cache time: 30 min (configured in `src/lib/queryClient.tsx`)
  - Deduplicated fetch for `cv.json`
- Future: migrate read paths from JSON to Supabase queries progressively.

## Language & Translations

- Language state: `src/lib/language.ts`
  - Detects initial language (localStorage → browser → `pt` fallback)
  - `setLanguage()` fires `monynha:languagechange` CustomEvent
- Hooks:
  - `useCurrentLanguage` re-renders on language change
  - `useTranslations` for static UI strings in `src/lib/translations.ts`
  - `useTranslatedContent` for dynamic content (invokes translation service)
- Translation service: `src/lib/translateService.ts`
  - Uses free Google Translate web endpoint (no API key)
  - localStorage cache (`monynha-translate-cache`, v2.0) + request dedupe

## Supabase Strategy (Optional)

- Client: `src/lib/supabaseClient.ts` returns `undefined` if env vars are missing.
- Schemas:
  - `public` (shared) — `leads` table for contact submissions
  - `portfolio` (project-specific) — content tables
- Contact flow: `src/lib/contactService.ts`
  1) Try insert into `public.leads`
  2) On error, call Edge Function `send-contact-email` fallback
- Migrations: `supabase/migrations/` (timestamp prefix)

## Performance

- Heavy visuals are lazy and desktop-only (`Galaxy`)
- SVG optimization (SVGO) and DNS prefetch/preconnect
- Web Vitals tracked via `src/lib/webVitals.ts`
- Component memoization (`React.memo`) for cards and list items
- Centralized `QueryClient` with optimized caching strategies.

## Testing

- Vitest with happy-dom; tests in `tests/lib/`
- Global test setup at `tests/setup.ts` (silences expected console noise unless `VERBOSE_TEST_LOGS=true`)
- CI runs `npm run test:coverage` and uploads artifacts

## Conventions

- Prefer existing UI primitives in `src/components/ui/`
- No raster images — SVG only
- Keep changes small and focused; open concise PRs