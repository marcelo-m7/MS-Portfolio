#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8080}"
ROOT_DIR="$(pwd)/dist"

if [ ! -d "$ROOT_DIR" ]; then
  echo "Error: dist/ directory not found. Run 'npm run build' first."
  exit 1
fi

# Inform user and start serving using Python's simple HTTP server
echo "Serving static files from $ROOT_DIR on http://localhost:$PORT"
python3 -m http.server --directory "$ROOT_DIR" "$PORT"
