# Copilot Instructions for MS-Portfolio

Vite + React + TypeScript portfolio site with Tailwind, shadcn/ui, React Router v6, React Query, Three.js/React-Three-Fiber, and optional Supabase. Keep changes small and focused unless asked otherwise.

## Quick Start (Read First)

**Key files to understand architecture:**
- `src/App.tsx` — routing structure with `Layout` as parent route, lazy-loaded pages
- `src/components/Layout.tsx` — shared layout wrapping all pages with `Navbar`, `Footer`, and `LiquidEther` background (Three.js fluid simulation)
- `public/data/cv.json` — **single source of truth** for all content (projects, artworks, series, thoughts)
- `src/lib/language.ts` — language system broadcasting `monynha:languagechange` custom events
- `src/lib/supabaseClient.ts` + `src/lib/contactLead.ts` — Supabase integration with graceful undefined handling

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

### Language System
- **Detection**: `detectInitialLanguage()` in `src/lib/language.ts` checks localStorage → browser language → falls back to `pt`
- **Broadcast**: `setLanguage()` fires `monynha:languagechange` CustomEvent
- **Hook**: `useCurrentLanguage` in `src/hooks/useCurrentLanguage.ts` listens to events and re-renders components
- **Supported**: `['pt', 'en']` (expandable in `src/lib/language.ts`)

Example usage:
```typescript
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';

function MyComponent() {
  const lang = useCurrentLanguage(); // 'pt' | 'en'
  // Component re-renders on language change
}
```

### Supabase Strategy
- **Optional**: `supabaseClient.ts` exports `undefined` if env vars missing (`VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`)
- **Multi-schema DB**:
  - `public` schema: shared tables across Monynha projects (`leads` table with `project_source` column)
  - `portfolio` schema: project-specific tables (15 tables for MS-Portfolio)
- **Graceful degradation**: always check `if (!supabase) { /* fallback */ }` (see `contactLead.ts`)
- **Migrations**: timestamp-prefixed SQL files in `supabase/migrations/` (e.g., `20251023000001_*.sql`)

Example pattern:
```typescript
import { supabase } from '@/lib/supabaseClient';

async function saveData() {
  if (!supabase) {
    // fallback: email, console.warn, etc.
    return;
  }
  const { data, error } = await supabase.from('leads').insert({ ... });
}
```

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
- Tailwind config and design tokens — unless narrowly scoped
- `src/components/LiquidEther.tsx` — complex shader/Three.js code (1492 lines)

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
