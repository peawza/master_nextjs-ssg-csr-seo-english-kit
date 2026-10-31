# syntax=docker/dockerfile:1
#
# DEPLOY-001: Build the Next.js static export (out/) and serve it with nginx.
# The runtime image contains only static files + nginx; there is no Node.js
# server, so ADR-0001 (static export, no request-time rendering) still holds.

ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=stable-alpine

# ---------- Stage 1: build static HTML/CSS/JS ----------
FROM node:${NODE_VERSION} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first for better layer caching.
# Use the lockfile when it exists (reproducible); fall back until BOOT-001 commits one.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

COPY . .

# Same quality gates as the Cloudflare Pages runbook; the image fails to build if any fail.
RUN npm run typecheck \
 && npm run lint \
 && npm run build \
 && npm run verify:html \
 && rm -f out/_headers
# out/_headers is Cloudflare Pages-specific; nginx applies the same headers
# via docker/security-headers.conf.

# ---------- Stage 2: static file server (non-root) ----------
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
