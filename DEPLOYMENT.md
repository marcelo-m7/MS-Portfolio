# Deployment Guide

This document covers deployment options for the MS-Portfolio application.

## Table of Contents

- [Coolify / Nixpacks Deployment](#coolify--nixpacks-deployment)
- [Static Hosting Providers](#static-hosting-providers)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Coolify / Nixpacks Deployment

This project is configured for deployment using [Coolify](https://coolify.io/) with [Nixpacks](https://nixpacks.com/).

### Configuration Files

- **`nixpacks.toml`** - Defines the build and deployment process
- **`Caddyfile`** - Web server configuration for serving the SPA

### How It Works

1. **Setup Phase**: Installs Node.js 20.19.0, npm 9.x, and Caddy web server
2. **Install Phase**: Runs `npm ci` to install dependencies deterministically
3. **Build Phase**: Runs `npm run build` to create the production bundle
4. **Start Phase**: Serves the static files using Caddy on port 80

### Nixpacks Configuration

The `nixpacks.toml` file configures:

```toml
[variables]
NIXPACKS_NODE_VERSION = "20.19.0"  # Required by Vite 7.x
NODE_ENV = "production"
NIXPACKS_SPA_OUTPUT_DIR = "dist"

[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x", "caddy"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "caddy run --config /app/Caddyfile --adapter caddyfile"
```

### Caddyfile Configuration

The `Caddyfile` provides:

- **SPA Routing**: All routes fallback to `index.html` for client-side routing
- **Compression**: Gzip and Zstd compression for better performance
- **Security Headers**: Prevents XSS, clickjacking, and MIME sniffing
- **Static Asset Caching**: 1-year cache for immutable assets (JS, CSS, images)
- **Logging**: Request logs to stdout for debugging

### Deployment Steps in Coolify

1. **Create a new service** in Coolify
2. **Connect your Git repository**
3. **Set the branch** (e.g., `main` or `production`)
4. **Configure environment variables** (see [Environment Variables](#environment-variables))
5. **Deploy** - Coolify will automatically detect and use the `nixpacks.toml` configuration

### Automatic Detection

Coolify/Nixpacks will automatically:
- Detect this as a Node.js project
- Use the `nixpacks.toml` configuration
- Build and serve the application correctly

## Static Hosting Providers

This project can also be deployed to static hosting providers (Vercel, Netlify, Cloudflare Pages, etc.):

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload this folder to your hosting provider
```

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 20.19.0 or higher

### SPA Routing Configuration

Configure your hosting provider to:
- Serve `index.html` for all routes (SPA fallback)
- Set proper cache headers for static assets

**Vercel**: Add a `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Add a `_redirects` file in `public/`:
```
/*    /index.html   200
```

## Environment Variables

The application requires these environment variables for full functionality:

### Required for Contact Form

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_SUPABASE_SCHEMA=portfolio
```

### Optional

The application will work without Supabase configured, but the contact form won't persist submissions.

### Setting Variables in Coolify

1. Go to your service settings
2. Navigate to "Environment Variables"
3. Add the variables listed above
4. Redeploy the service

## Troubleshooting

### Build Failures

**Issue**: `npm ci` fails
- **Solution**: Ensure `package-lock.json` is committed to the repository

**Issue**: Build timeout
- **Solution**: The build typically takes 1-2 minutes. If timing out, check Coolify logs

### Runtime Issues

**Issue**: 404 errors on routes
- **Solution**: Ensure the Caddyfile is present and properly configured with SPA fallback

**Issue**: Static assets not loading
- **Solution**: Check that the `dist` folder structure is correct after build

### Caddy Issues

**Issue**: Caddy won't start
- **Solution**: Check the Caddyfile syntax and ensure port 80 is available

**Issue**: Performance problems
- **Solution**: Verify compression is enabled in the Caddyfile

### Logs

View logs in Coolify:
1. Go to your service
2. Click "Logs"
3. Check build logs and runtime logs

Common log messages:
- `npm ci` - Installing dependencies
- `vite build` - Building the application
- Caddy startup messages - Server is running

## Performance Optimization

The configuration includes:

- **Compression**: Gzip and Zstd for all text-based files
- **Caching**: 1-year cache for immutable assets
- **Security**: Standard security headers
- **Efficient Serving**: Caddy's optimized static file serving

## Security

Security headers configured in Caddyfile:
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Support

For issues related to:
- **Nixpacks**: Check [Nixpacks documentation](https://nixpacks.com/)
- **Coolify**: Check [Coolify documentation](https://coolify.io/docs)
- **Caddy**: Check [Caddy documentation](https://caddyserver.com/docs/)
- **This project**: Open an issue on GitHub
