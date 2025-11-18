# Bun Setup for MS-Portfolio (Monynha)

This project normally uses `npm` + `vite`. Bun is an alternative runtime & package manager that can be used instead of Node + npm. These scripts help install Bun, install dependencies using Bun, and run the Vite dev server via Bun.

⚠️ Note: On Windows, this script uses PowerShell to run the official Bun install script. You may need Administrator privileges or execution policy changes. If you run into issues, install Bun manually from https://bun.sh.

## Quick Start (Linux/macOS/Windows)

1. Try running Vite normally (Node):

```bash
npm run dev
```

2. If you want to use Bun instead (recommended when you want Bun's package manager and runtime):

```bash
# Install bun (automated script will detect platform)
npm run bun:install

# Install dependencies using bun
npm run bootstrap:bun

# Run the dev server with bun
npm run dev:bun
```

## Scripts added

- `bun:check` — check if `bun` is installed on PATH
- `bun:install` — attempt to register Bun on the system using the official installer
- `bootstrap:bun` — installs bun (if not present) and runs `bun install` to install deps via Bun
- `dev:bun`, `build:bun`, `preview:bun` — run vite scripts via `bun` runtime

## Troubleshooting

- If `npm run bun:install` fails on Windows, try installing Bun manually:

1. Install WSL and run `curl -fsSL https://bun.sh/install | bash` inside WSL, or
2. Open PowerShell as Administrator and run `iwr https://bun.sh/install -UseBasicParsing | iex`.

- Bun uses its own package manager. To keep both environments in sync, you can continue to use `npm` normally for `npm ci` or `npm install`; bun also creates `bun.lockb` on installation.

## Notes

- Vite should work under Bun (Bun is Node-compatible in many cases), but not all Node tooling is fully compatible. If you experience runtime issues, fall back to using the standard `npm` scripts (`npm run dev`, `npm run build`).

- The goal here is to provide a way to test / run the project using Bun as a runtime; do not force all CI or dev machines to use Bun without validating the behavior.
