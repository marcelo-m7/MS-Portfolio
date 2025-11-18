## Multi-stage Dockerfile to build and server the Vite-based static site
#
# Build stage (Node) -> Production stage (Nginx)
FROM node:20-alpine AS builder
WORKDIR /app

# Install only production dependencies then build the site
ENV NODE_ENV=production
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --silent

# Copy source, build
COPY . .
RUN npm run build

## Production image
FROM nginx:stable-alpine AS production
LABEL maintainer="marcelo-m7 <marce@example.com>"
EXPOSE 80

# Copy static assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx config with SPA-fallback and caching rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
