# Multi-stage Dockerfile for Monynha Softwares Website
# - Installs dependencies (pnpm)
# - Generates Supabase TypeScript types during build (optional, controlled by build args/env)
# - Builds the Vite app
# - Serves static `dist` with nginx

# --- Dependencies stage ---
# Use Node 20 slim (glibc) so Vite/rollup native optional binaries work
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies using npm (npm installs optional/native build deps which fixes rollup native module issues)
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy the rest of the repo
COPY . .


# --- Builder stage: generate types + build ---
FROM node:20-slim AS builder
WORKDIR /app

# Copy installed node_modules and project files from deps stage
COPY --from=deps /app /app

# Set production environment by default
ENV NODE_ENV=production

# Optional build-time args for Supabase type generation
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# Optionally install the supabase CLI when the SERVICE ROLE KEY is provided for type generation
RUN if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then npm install -g supabase; fi

# Conditionally generate Supabase TypeScript types only when the CLI and creds are available
RUN if command -v supabase >/dev/null 2>&1 && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then \
			supabase gen types typescript --schema public > src/integrations/supabase/types_db.ts; \
		else \
			echo "Supabase type generation skipped"; \
		fi

# Build the Vite app with npm
RUN npm run build


# --- Production stage: serve with nginx ---
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]