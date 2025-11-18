# Nix: serving static site (dist/)

This folder contains simple Nix helpers to serve the compiled static site found in `dist/`.

Available files:

- `shell.nix` — a dev shell including `python3` with a `shellHook` that prints usage tips.
- `run-dist.sh` — convenience script that serves `./dist` on a specified port (default 8080) using Python's `http.server`.
- `default.nix` — a derivation that packages the `dist/` files into a Nix derivation and installs a `run` wrapper in result/bin to serve the site.

Usage

1. Build the project (produce `dist/`):

```powershell
npm run build
```

2. Use the `shell.nix` interactive environment (Optional):

```bash
nix-shell nix/shell.nix
# inside the shell
./nix/run-dist.sh 8080
```

3. Or use `nix-build` to create a runnable `run` command: 

```bash
nix-build -A default -o result && ./result/bin/run 8080
```

Notes
- `default.nix` copies the contents of `dist/` into the Nix derivation at build time, so if you re-run `npm run build` you must re-run `nix-build`.
- The `run-dist.sh` script is portable and works on systems with Python 3.
