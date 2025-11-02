# Agents guide

This repository uses AI coding agents to automate small changes and keep docs/code healthy. Start here for conventions and where to look.

- Project docs: ./docs/
- AI instructions: .github/copilot-instructions.md
- Conduct and component rules: ./AI_RULES.md

## Quick links

- Install: see README.md (root)
- Dev server: `npm run dev` (port 8080)
- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`

## Typical agent tasks

- Small refactors, docs moves, keeping configs up-to-date
- Adding/adjusting tests with Vitest (mocks for external services)
- Maintaining Tailwind/shadcn patterns and routing consistency

## Safety checks

- Keep changes small and scoped
- Run build/tests/linters locally before opening PR
- Don’t change `src/App.tsx`, `Layout.tsx`, `vite.config.ts` structure unless explicitly requested
- For Supabase, always handle undefined client and fallback to cv.json

See `.github/copilot-instructions.md` for the full architecture, data flow, and language/translation system overview.
