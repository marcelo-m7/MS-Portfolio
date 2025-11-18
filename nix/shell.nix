{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "ms-portfolio-shell";

  buildInputs = [
    pkgs.python3
    pkgs.coreutils
  ];

  shellHook = ''
    export MS_PORTFOLIO_DIST="$(pwd)/dist"
    echo "MS-Portfolio Nix development shell loaded."
    echo "To serve the compiled static site run: ./nix/run-dist.sh [PORT]"
    echo "Example: ./nix/run-dist.sh 8080"
  '';
}
