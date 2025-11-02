# Copilot Instructions for MS-Portfolio

Vite + React + TypeScript portfolio site with Tailwind, shadcn/ui, React Router v6, React Query, Three.js/React-Three-Fiber, and optional Supabase. Keep changes small and focused unless asked otherwise.

## Quick Start (Read First)

**Key files to understand architecture:**
- `src/App.tsx` — routing structure with `Layout` as parent route, lazy-loaded pages
- `src/components/Layout.tsx` — shared layout wrapping all pages with `Navbar`, `Footer`, and `LiquidEther` background (Three.js fluid simulation)
- `public/data/cv.json` — **single source of truth** for all content (projects, artworks, series, thoughts)
- `src/lib/language.ts` — language system broadcasting `monynha:languagechange` custom events
- `src/lib/translations.ts` — static UI translations (nav, buttons, labels) for 4 languages
- `src/lib/translateService.ts` — **Free Google Translate web endpoint** integration (no API key required)
- `src/lib/supabaseClient.ts` + `src/lib/contactLead.ts` — Supabase integration with graceful undefined handling
- `src/lib/logger.ts` — structured logging (suppresses log/info in production, preserves warn/error)

## Architecture

### Routing & Pages
- **Parent route**: `Layout` wraps all pages (defined in `App.tsx`)
- **Lazy-loaded pages** in `src/pages/`: `Home`, `Portfolio`, `ProjectDetail`, `ArtDetail`, `SeriesDetail`, `Thoughts`, `ThoughtDetail`, `About`, `Contact`, `NotFound`
- **Nested routes**: `/portfolio/:slug`, `/art/:slug`, `/series/:slug`, `/thoughts/:slug`

### Data Flow
- **Content source**: `public/data/cv.json` (projects, artworks, series, thoughts)
- **SVG thumbnails**: `public/images/` (must include `<title>` tag for accessibility)
- **Database migration in progress**: Supabase tables exist (`supabase/migrations/`) but frontend still reads from JSON file
- **Future state**: migrate from JSON file to DB queries
- **React Query hooks**: `src/hooks/usePortfolioData.ts` exports hooks like `useProjects()`, `useArtwork()`, `useSeries()`, `useThoughts()` with 5-min stale time, 10-min cache
- **Fallback pattern**: All hooks attempt DB query first, fall back to `cv.json` if Supabase unavailable or returns null
- **Error boundaries**: Wrap lazy-loaded routes in `ErrorBoundary` component for graceful failure handling

### Language System
- **Detection**: `detectInitialLanguage()` in `src/lib/language.ts` checks localStorage → browser language → falls back to `pt`
- **Broadcast**: `setLanguage()` fires `monynha:languagechange` CustomEvent
- **Hook**: `useCurrentLanguage` in `src/hooks/useCurrentLanguage.ts` listens to events and re-renders components
- **Supported**: `['pt', 'en', 'es', 'fr']` (Portuguese, English, Spanish, French)
- **Two-layer translation**:
  1. **Static UI** (`src/lib/translations.ts`): Pre-translated nav/buttons/labels via `useTranslations()` hook
  2. **Dynamic content** (`src/lib/translateService.ts`): Auto-translates `cv.json` content via **Google Translate's free web endpoint** (no API key required)
- **Caching**: Translations stored in localStorage (`monynha-translate-cache`) with version `2.0`
- **Request deduplication**: Multiple components requesting same text → single request

Example usage:
```typescript
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';

function MyComponent({ profile }) {
  const lang = useCurrentLanguage(); // 'pt' | 'en' | 'es' | 'fr'
  const t = useTranslations(); // Static UI translations
  const translatedBio = useTranslatedText(profile.bio); // Dynamic content
  
  return (
    <div>
      <button>{t.nav.home}</button>
      <p>{translatedBio}</p> {/* Shows PT first, updates when translation completes */}
    </div>
  );
}
```

### Supabase Strategy
- **Optional**: `supabaseClient.ts` exports `undefined` if env vars missing (`VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`)
- **Multi-schema DB**:
  - `public` schema: shared tables across Monynha projects (`leads` table with `project_source` column)
  - `portfolio` schema: project-specific tables (15 tables for MS-Portfolio)
- **Graceful degradation**: 
  - Queries check `if (!supabase) { /* fallback */ }`
  - Frontend hooks (useProjects, useProfile, etc.) fall back to `cv.json` when Supabase returns null
  - Contact form uses email-only when DB unavailable (via `send-contact-email` Edge Function)
- **Migrations**: timestamp-prefixed SQL files in `supabase/migrations/` (e.g., `20251023000001_*.sql`)

Example pattern:
```typescript
import { supabase } from '@/lib/supabaseClient';

async function saveData() {
  if (!supabase) {
    // fallback: use cv.json, email, console.warn, etc.
    return;
  }
  const { data, error } = await supabase.from('leads').insert({ ... });
}
```

**Contact Form Flow**:
1. Try to insert into `public.leads` table
2. On failure, invoke `send-contact-email` Edge Function (requires `RESEND_API_KEY` secret in Supabase)
3. Return `'saved'` (DB) or `'emailed'` (fallback) status

### 3D Graphics & Animation
- **LiquidEther**: custom Three.js fluid simulation background (`src/components/LiquidEther.tsx`, 1492 lines)
  - Uses WebGL shaders, velocity/divergence fields, and Poisson solver
  - Configured with theme colors from `useThemePalette` hook
  - Runs only on desktop (`hidden md:block` in `Layout.tsx`)
- **Art3DPreview**: React-Three-Fiber component for artwork previews
  - Uses `<OrbitControls>`, `<MeshDistortMaterial>` from `@react-three/drei`
  - Implements visibility detection to pause animation when tab hidden

## Developer Workflows

### Commands (PowerShell)
```powershell
npm install          # install deps (npm only - enforced)
npm run dev          # dev server on port 8080
npm run build        # production build
npm run build:dev    # dev mode build
npm run preview      # preview built site
npm run test         # run Vitest tests
npm run lint         # ESLint check
```

### Package Management
- **Primary**: npm (locked via `package.json` engines field: `>=20.19.0` for Node, `>=9.0.0` for npm)
- **Lock file**: `package-lock.json` committed to git
- **NOT used**: pnpm, yarn, bun (lock files gitignored)

### Testing Pattern
- **Framework**: Vitest with mocks
- **Example**: `src/lib/contactLead.test.ts` (mocks Supabase, expects fallback behavior)
- **Rule**: always mock external clients (Supabase, APIs)

## Conventions & Patterns

### Adding Content
1. Edit `public/data/cv.json` (projects/artworks/series)
2. Add SVG thumbnail to `public/images/` with `<title>` tag
3. Run `npm run build` to check bundle size
4. Avoid raster images (PNG/JPG) — SVG only

### Styling
- Prefer existing UI primitives in `src/components/ui/` (shadcn patterns) over ad-hoc CSS
- Tailwind + shadcn components for all UI

## Files to NOT Change Without Asking
- `src/App.tsx` and `src/components/Layout.tsx` — routing & layout affect all pages
- `public/data/cv.json` schema shape — many components depend on field names
- `vite.config.ts` manual chunks — optimized for bundle splitting (already configured)
- Tailwind config and design tokens — unless narrowly scoped
- `src/components/LiquidEther.tsx` — complex shader/Three.js code (1492 lines)
- `tsconfig.json` strict flags — intentionally relaxed (`noImplicitAny: false`, `strictNullChecks: false`)

## Quality Gates
```powershell
npm run build        # check for bundling errors, large SVGs
npm run test         # unit tests (Supabase must be mocked)
npm run lint         # typecheck + ESLint
```

## Helpful Code Pointers

| Pattern | Location | Notes |
|---------|----------|-------|
| Language system | `src/lib/language.ts` | `detectInitialLanguage`, `setLanguage`, event name |
| Contact persistence | `src/lib/contactLead.ts` | Handles absent env vars, includes `project_source='portfolio'` |
| 3D preview | `src/components/Art3DPreview.tsx` | React-Three-Fiber with visibility control |
| Fluid background | `src/components/LiquidEther.tsx` | Custom Three.js fluid sim (desktop only) |
| Data-driven page | `src/pages/ProjectDetail.tsx` | Reads from `cv.json` |

## Database Details
- **Full docs**: see `SUPABASE.md` in repo root
- **Schema strategy**: `public` for shared, `portfolio` for project-specific
- **All migrations**: `supabase/migrations/` with timestamp prefix
- **Contact leads**: auto-include `project_source='portfolio'` field

## PR Guidelines
- Keep changes small with file-level rationale
- For data/SVG changes: include preview + confirm accessibility (`<title>`)
- For persistence changes: document env vars and fallback behavior

---

**Need examples?** Ask for: test harness, adding pages, migration examples, or 3D component patterns.
