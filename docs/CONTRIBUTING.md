# Contributing to MS-Portfolio

Thanks for your interest in contributing! This project is the personal portfolio of Marcelo Santos with a focus on clean code, accessibility, and performance. Contributions that improve docs, tests, DX, or fix bugs are welcome.

For questions or to propose work directly, contact: [marcelo@monynha.com](mailto:marcelo@monynha.com) or connect on LinkedIn: [linkedin.com/in/marcelo-m7](https://linkedin.com/in/marcelo-m7).

## Table of Contents

- [Contributing to MS-Portfolio](#contributing-to-ms-portfolio)
  - [Table of Contents](#table-of-contents)
  - [Development Setup](#development-setup)
  - [Workflow](#workflow)
  - [Coding Standards](#coding-standards)
  - [Testing](#testing)
  - [Docs \& Linting](#docs--linting)
  - [Commits \& PRs](#commits--prs)

## Development Setup

Prerequisites:

- Node.js >= 20.19
- npm >= 9

Install and run:

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run lint        # ESLint + typecheck
npm run lint:fix    # ESLint with --fix
npm run test        # Vitest
npm run test:watch  # Watch mode
npm run test:coverage # Vitest with coverage (CI)
npm run build    # Production build
npm run preview  # Preview built site
```

Optional: create `.env` to enable Supabase (see `SUPABASE.md`).

## Workflow

- Fork and clone the repo.
- Create a topic branch from `main`:

```bash
git checkout -b feat/short-description
```

- Keep your branch focused and small. One logical change per PR.

## Coding Standards

- TypeScript, React 18, Vite 7.
- Tailwind + shadcn/ui components (avoid ad-hoc CSS).
- Prefer existing UI primitives in `src/components/ui/`.
- Keep `public/data/cv.json` as the single source of truth until full DB migration.
- Avoid adding raster images (PNG/JPG) — SVG only.

## Testing

- Unit tests with Vitest. Tests live under `tests/lib/`.
- Mock external clients (Supabase, network requests).
- Add tests for new logic; maintain coverage where practical.
- CI runs `npm run test:coverage` and uploads coverage artifacts.
  - Global setup at `tests/setup.ts` silences expected console noise; set `VERBOSE_TEST_LOGS=true` to see all logs.

## Docs & Linting

- Run ESLint locally: `npm run lint`.
- Markdown: use fenced code blocks with language spec and blank lines around lists/blocks.
- To lint Markdown locally (optional):

```bash
npx markdownlint "**/*.md"
```

## Commits & PRs

- Use conventional commits where possible (e.g., `feat:`, `fix:`, `docs:`).
- Include a clear description and screenshots/GIFs for UI changes.
- CI must pass (lint, test, build). Artifacts are uploaded for review.
- PRs that change behavior should include tests.
