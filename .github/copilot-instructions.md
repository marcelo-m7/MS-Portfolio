# Copilot Instructions – MS-Portfolio

A personal portfolio + experimental lab for modern React patterns, 3D graphics, multilingual content, and accessibility. Built with **Vite + React + TypeScript + Tailwind + shadcn/ui**.

## Architecture Overview

### Core Stack & Data Flow

```
cv.json (source of truth)
  ↓
  ├→ usePortfolioData hooks (React Query)
  │   ├→ Supabase API (optional, with cv.json fallback)
  │   └→ Cache + Error Handling
  ↓
Pages (lazy-loaded via React Router)
  └→ Layout + Navbar + Footer (shared)
      └→ Language System + 3D Background (Galaxy)
```

**Key Principle:** Data flows from [public/data/cv.json](public/data/cv.json) through React Query hooks in [src/lib/api/queries](src/lib/api/queries) to pages. Always gracefully fall back to cv.json if Supabase is undefined (no credentials = portfolio still works).

### Pages & Routes

All pages lazy-load via [src/App.tsx](src/App.tsx) with `Suspense` boundaries:
- **Home** – Hero, hero section with dynamic language detection
- **Portfolio** – Project grid from cv.json
- **ProjectDetail, ArtDetail, SeriesDetail, ThoughtDetail** – Individual detail pages  
- **About** – Profile from cv.json
- **Thoughts** – Blog posts (markdown from `public/content/blog/`)
- **Contact** – Form with Supabase submission (fallback: mailto)
- **NotFound** – 404

Hash-based routing (`HashRouter`) for static server compatibility.

### Critical Components & Guards

⚠️ **Do not restructure without explicit request:**
- [src/App.tsx](src/App.tsx) – Router setup, language detection, error boundary
- [src/components/Layout.tsx](src/components/Layout.tsx) – Navbar/Footer/Galaxy container
- [vite.config.ts](vite.config.ts) – Base path, rollup config, alias setup

## Language & Translation System

**Supported languages:** PT (default), EN, ES, FR (see [src/lib/language.ts](src/lib/language.ts))

### Static UI Translations
Pre-translated button labels, nav items, etc. from [src/lib/translations.ts](src/lib/translations.ts):
```typescript
import { useTranslations } from '@/hooks/useTranslations';

function MyComponent() {
  const t = useTranslations();  // Auto-detects language from document.lang
  return <button>{t.nav.home}</button>;
}
```

### Dynamic Content Translation (cv.json, thoughts, etc.)
Automatic background translation via Google Translate's free endpoint (no API key):
```typescript
import { useTranslatedText } from '@/hooks/useTranslatedContent';

function ProfileBio({ bio }: { bio: string }) {
  const translated = useTranslatedText(bio);  // Returns PT initially, updates after translation
  return <p>{translated}</p>;
}
```

**Details:** See [docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md) – handles caching, deduplication, localStorage.

## Development Workflows

### Quick Links
- **Dev:** `pnpm dev` (port 8080)
- **Build:** `pnpm build`
- **Test:** `pnpm test` (Vitest) or `pnpm test:watch`
- **Lint:** `pnpm lint` (ESLint) or `pnpm lint:fix`
- **Preview:** `pnpm preview`

### Testing
- Framework: **Vitest** (configured in [vitest.config.ts](vitest.config.ts))
- Setup: [tests/setup.ts](tests/setup.ts) suppresses logs unless `VERBOSE_TEST_LOGS=true`
- Test location: `tests/` (mirrors `src/` structure)
- **Example:** [tests/navbar.test.tsx](tests/navbar.test.tsx) – component testing
- **Mocks:** External services (GitHub API, Supabase) use Vitest mocks; never hit real endpoints in tests

### CI Pipeline
Runs on every push/PR via [.github/workflows/ci.yml](.github/workflows/ci.yml):
1. **Setup** – Node 20, pnpm 9, install deps with frozen lockfile
2. **Lint** – ESLint
3. **Test** – Vitest (reporter: dot in CI)
4. **Build** – Vite production build
5. **Type Check** – tsc

Concurrency: cancels in-flight jobs on new pushes (same branch).

## Code Patterns & Conventions

### Data Fetching (React Query)
All data queries live in [src/lib/api/queries.ts](src/lib/api/queries.ts):
```typescript
const { data: projects, isLoading, error } = useProjects();
```
Uses `useQuery` with cache keys like `['projects']`, auto-fallback to cv.json.

### Components
- **UI Library:** shadcn/ui (Radix + Tailwind, components in [src/components/ui/](src/components/ui/))
- **Styling:** Tailwind CSS + custom animations in [src/lib/animations.ts](src/lib/animations.ts)
- **Error Handling:** [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) wraps app
- **Loading States:** [src/components/LoadingStates.tsx](src/components/LoadingStates.tsx) for async content

### Hooks
Custom hooks in [src/hooks/](src/hooks/):
- `useCurrentLanguage()` – Returns active language
- `usePortfolioData()` – Fetches from Supabase/cv.json  
- `useTranslations()` – Static UI translations
- `useTranslatedText()` – Dynamic content translation
- `useDeviceCapabilities()` – Detects GPU/low-end hardware
- `useScrollToTop()` – Auto-scroll on route change

### TypeScript
- Config: [tsconfig.json](tsconfig.json), [tsconfig.app.json](tsconfig.app.json)
- `skipLibCheck: true`, `strictNullChecks: false` – Relaxed mode (deliberate for external deps)
- Path alias: `@/` → `src/`
- Database types auto-generated in [src/types/database.types.ts](src/types/database.types.ts) from Supabase schema

## Integration Points

### Supabase (Optional)
- Client in [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts)
- **If env vars missing:** supabase = undefined, queries fallback to cv.json ✓
- Contact form submissions use Supabase (no env = form disabled with fallback)
- Database schema in [supabase/migrations/](supabase/migrations/)
- Tables: `projects`, `artworks`, `series`, `thoughts`, `experience`, `skills`, `contacts`, `technologies`

### GitHub Stats
- API calls in [src/lib/githubApi.ts](src/lib/githubApi.ts)
- Hook: `useGitHubStats()` (rate-limited, cached)
- Used in [src/components/GitHubStats.tsx](src/components/GitHubStats.tsx)

### Markdown Content (Thoughts)
- Blog posts: [public/content/blog/](public/content/blog/) (`.md` files)
- Loader: [src/lib/markdownLoader.ts](src/lib/markdownLoader.ts)
- Parsed by `getAllBlogPosts()`, `getBlogPostBySlug()`

## Safety & Review Checklist

✅ **Safe to automate:**
- Typos, docs updates, config file tweaks
- Tests, minor refactors in hooks/lib/components (excluding core files)
- Tailwind class adjustments, shadcn pattern consistency
- Translation string fixes

❌ **Do not change without explicit request:**
- [src/App.tsx](src/App.tsx), [src/components/Layout.tsx](src/components/Layout.tsx), [vite.config.ts](vite.config.ts)
- Router structure or page paths

⚠️ **Before PR:**
- Run `npm run lint:fix`, `npm run test`, `npm run build` locally
- Confirm no new errors in `npm run lint`
- Verify Supabase fallback logic if touching data fetching

## File Organization Quick Reference

```
src/
  components/      → React components (UI, Layout, pages)
  hooks/          → Custom React hooks (data, language, utilities)
  lib/            → Business logic (API, translations, animations)
    api/          → React Query queries
  pages/          → Route-based pages (lazy-loaded from App.tsx)
  types/          → TypeScript definitions (database.types.ts from Supabase)

public/
  data/           → cv.json (source of truth)
  content/blog/   → Markdown blog posts
  images/         → SVG/PNG assets

tests/            → Vitest test files (mirrors src/ structure)
supabase/         → Schema, migrations, edge functions
.github/          → CI workflows, this instructions file
```

---

**Last Updated:** January 2026  
**Maintainers:** AI agents, code review by humans  
**Key Docs:** [AGENTS.md](AGENTS.md), [docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md), [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
