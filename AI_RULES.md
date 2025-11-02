# AI Rules and Coding Conventions

Authoritative guidance for AI agents and contributors. These rules complement `.github/copilot-instructions.md` and clarify what to change, how to code, and what to avoid.

- Start here for architecture, data, and workflows: `.github/copilot-instructions.md`
- Tasks and guardrails for agents: `AGENTS.md`
- Project docs and references: `./docs/`

## Scope and responsibilities

- Prefer small, focused changes with clear rationale
- Avoid changes to global routing, layout, and build chunking unless explicitly requested
- Always keep content-driven architecture intact (reads from `public/data/cv.json` unless DB fully wired)
- When unsure, propose a plan with minimal assumptions and proceed with the smallest safe update

## Protected areas (do not change without explicit request)

- `src/App.tsx` and `src/components/Layout.tsx` (routing and layout)
- `src/components/LiquidEther.tsx` (complex Three.js shaders)
- `vite.config.ts` manual chunks and core build strategy
- `public/data/cv.json` schema shape (field names across pages)
- Tailwind config and tokens (unless narrowly scoped fix requested)
- TypeScript strictness in `tsconfig.json` (kept relaxed intentionally)

## Data flow and fallbacks

- Primary content source is `public/data/cv.json`
- Optional Supabase: `src/lib/supabaseClient.ts` may export `undefined` when env vars are missing
- Hooks in `src/hooks/usePortfolioData.ts` follow: try DB → fallback to cv.json → cache via React Query (stale ~15m, cache ~30m)
- Never hard-fail UI if Supabase is unavailable—warn and fallback

## Language and translation

- Supported languages: `pt`, `en`, `es`, `fr`
- Detect via `detectInitialLanguage()`; broadcast with `setLanguage()` (event: `monynha:languagechange`)
- Static UI strings: `src/lib/translations.ts` with `useTranslations()`
- Dynamic content: `src/lib/translateService.ts` free Google Translate web endpoint; cache in localStorage (`monynha-translate-cache`, version `2.0`); dedupe requests
- Components should render base PT content first and update when translation arrives

## UI and styling conventions

- Use shadcn/ui components under `src/components/ui/` and Tailwind classes
- Prefer composition over custom CSS; only add CSS files when necessary
- SVGs only for thumbnails in `public/images/`; must include `<title>` for accessibility
- Avoid raster (PNG/JPG) assets

## 3D and performance

- The `LiquidEther` background is desktop-only and lazy-loaded from `Layout.tsx` via `React.lazy`
- For 3D previews, use `@react-three/fiber` with `@react-three/drei` helpers; pause/visibility patterns already implemented
- Keep render trees small; prefer memoization and conditional rendering for list-heavy components
- Maintain prefetching (cv.json) and DNS preconnect in `index.html`
- Web Vitals reporting lives in `src/lib/webVitals.ts` and is initialized in `src/main.tsx`

## Testing

- Vitest is the framework; always mock external services (Supabase, HTTP)
- Add tests near the unit under `src/lib/*.test.ts` or similar conventions in the repo
- Cover happy path plus at least one fallback/error path

## PR guidelines

- Keep diffs small and focused; explain file-level rationale in the PR description
- For data/SVG changes: include preview and confirm `<title>` accessibility tag exists
- For persistence changes: document env vars, fallback behavior, and how errors are handled
- Pass quality gates: build, tests, and lint must be green

## Quality gates (must pass)

- Build: `npm run build` should complete without errors
- Tests: `npm run test` should pass; mock dependencies appropriately
- Lint: `npm run lint` should pass; fix markdownlint issues in docs files

## Practical patterns to reuse

- React Query cache config: stale ~15 minutes; cache ~30 minutes for portfolio data
- React.memo for item-list components; stable props and keys
- Lazy-load heavy visuals (Three.js background) and only render on desktop
- Graceful DB fallback pattern:

```ts
import { supabase } from '@/lib/supabaseClient';

export async function fetchSomething() {
  if (!supabase) {
    console.warn('Supabase disabled; falling back to JSON');
    return fallbackFromJson();
  }
  const { data, error } = await supabase
    .from('table')
    .select('*');
  if (error || !data) return fallbackFromJson();
  return data;
}
```

## When to ask for confirmation

- Schema or data shape changes in `cv.json`
- Any large refactor across routing/layout/build chunking
- Shader or complex 3D pipeline changes
- Introducing new dependencies or replacing existing ones
