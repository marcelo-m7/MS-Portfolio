# Building & Running with Docker

This guide covers creating a Docker image for the Vite + React site and serving the built output via Nginx.

Build the image:

```powershell
docker build -t monynha-portfolio:latest .
```

Run a container locally:

```powershell
docker run --rm -p 8080:80 monynha-portfolio:latest
```

You should be able to visit <http://localhost:8080> and see the built app.

Notes
This setup:

- uses a multi-stage build (Node to build, Nginx to serve), keeping the final image small;
- includes an `nginx.conf` that provides an SPA fallback (`index.html`) and caches static assets for 1 year; and
- should be updated if your project changes its build output directory (e.g., `dist` -> `build`).
