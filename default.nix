{ pkgs ? import <nixpkgs> {} }:

let
  python = pkgs.python3;
in

pkgs.stdenv.mkDerivation rec {
  pname = "ms-portfolio-dist-server";
  version = "2.0.0";

  src = ./.;

  buildInputs = [ python ];

  installPhase = ''
    mkdir -p $out/bin
    mkdir -p $out/share/ms-portfolio-static

    if [ -d "${src}/dist" ]; then
      cp -r "${src}/dist/." "$out/share/ms-portfolio-static/"
    fi

    # Create a small wrapper script to serve the static files using python
    cat > $out/bin/run << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$PWD/share/ms-portfolio-static"
if [ ! -d "$ROOT" ]; then
  echo "Missing static files in $ROOT"
  echo "Build the project and copy the dist directory (npm run build)"
  exit 1
fi
PORT="${1:-8080}"
export PYTHONUNBUFFERED=1
printf "Serving static files from %s on http://localhost:%s\n" "$ROOT" "$PORT"
exec python -m http.server --directory "$ROOT" "$PORT"
EOF

    chmod +x $out/bin/run
  '';

  meta = with pkgs.lib; {
    description = "Static server wrapper for MS-Portfolio dist/ (build using vite)";
    license = licenses.mit;
    maintainers = [];
  };
}
