# syntax=docker/dockerfile:1
# DEPLOY-001: build, verify and preview the static export; upload with a pinned Wrangler.
# Cloudflare Pages receives only the exported files (out/). No image runs on Pages,
# and no Next.js server runs anywhere (ADR-0001).

# Same Node version as local development (v24.15.0), pinned by digest.
ARG NODE_IMAGE=node:24.15.0-bookworm-slim@sha256:4e6b70dd6cbfc88c8157ba19aa3d9f9cce6ba4703576d55459e45efcbc9c5f5d

# --- deps: lockfile-exact install, cached separately from the source -------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
COPY package.json package-lock.json ./
RUN npm ci

# --- build: quality gates, static export and HTML/SEO verification ----------------
FROM deps AS build
COPY . .
RUN npm run lint \
 && npm run typecheck \
 && npm run build \
 && npm run verify:html

# --- artifact: only the exported files; use with `docker build --output` ----------
FROM scratch AS artifact
COPY --from=build /app/out /

# --- preview: static server without a Next.js runtime, non-root -------------------
FROM ${NODE_IMAGE} AS preview
WORKDIR /srv
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4173 STATIC_ROOT=/srv/out
COPY --from=build --chown=node:node /app/scripts/serve-static.mjs ./serve-static.mjs
COPY --from=build --chown=node:node /app/out ./out
USER node
EXPOSE 4173
CMD ["node", "serve-static.mjs"]

# --- wrangler: pinned CLI for Pages Direct Upload, non-root ----------------------
# Credentials are passed at `docker run` time only; never as build args.
FROM ${NODE_IMAGE} AS wrangler
ARG WRANGLER_VERSION=4.155.0
ENV WRANGLER_SEND_METRICS=false npm_config_update_notifier=false
RUN npm install --global --no-fund --no-audit "wrangler@${WRANGLER_VERSION}" \
 && wrangler --version
USER node
WORKDIR /home/node/deploy
ENTRYPOINT ["wrangler"]
