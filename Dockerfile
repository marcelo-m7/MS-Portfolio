## Multi-stage Dockerfile: Build with Node, serve with Python's http.server
## Usage: docker build -f Dockerfile.python -t ms-portfolio-py .

### Build stage (Node) - builds the static `dist` folder
FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

### Production stage (Python) - lightweight image serving static files
FROM python:3.12-slim
WORKDIR /app
LABEL maintainer="marcelo-m7 <marcelo@monynha.com>"

# Copy built static files from builder
COPY --from=builder /app/dist ./dist

# Expose a port commonly used for simple Python servers
EXPOSE 8080

# Serve the `dist` directory using the builtin http.server
CMD ["python", "-m", "http.server", "8080", "--directory", "dist", "--bind", "0.0.0.0"]
