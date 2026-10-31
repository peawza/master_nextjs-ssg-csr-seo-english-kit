# Docker build/preview and Windows batch deploy (DEPLOY-001)

Docker builds and previews the static export. Wrangler, pinned and running in a container, uploads the resulting `out/` files to Cloudflare Pages through Direct Upload. Pages never runs a Docker image, and no Next.js server runs anywhere (ADR-0001).

```text
build.bat / preview.bat / deploy-cloudflare.bat
        -> node scripts/deploy/cli.mjs (config, validation, no shell)
        -> docker build (npm ci, lint, typecheck, next build, verify:html)
        -> .artifacts/out (fresh every run)  -> preview image (static server, non-root)
                                             -> wrangler image -> Cloudflare Pages
```

## Prerequisites
- Windows with Node.js 20.9+ on PATH. The scripts need it to run the helper; development uses v24.15.0.
- Docker Desktop with **Linux containers** and the engine running. The helper checks both and stops with a clear error.
- For deploy only: an existing Cloudflare Pages **Direct Upload** project and an API token (below).

Pinned versions: base image `node:24.15.0-bookworm-slim@sha256:4e6b70dd6cbfc88c8157ba19aa3d9f9cce6ba4703576d55459e45efcbc9c5f5d`, Wrangler `4.155.0` (in `scripts/deploy/cli.mjs` and the Dockerfile `WRANGLER_VERSION` default). npm dependencies come from `package-lock.json` via `npm ci`. Update the pins deliberately, together with this file.

## Configuration
Copy `.env.example` to `.env` (git-ignored, and excluded from the Docker build context). Values already set in the process environment override `.env`. The file is parsed as plain `KEY=VALUE` data, so no shell expansion or command substitution happens.

| Variable | Used by | Default / rule |
|---|---|---|
| `DOCKER_IMAGE_NAME` | all | `villa-luma` |
| `DOCKER_IMAGE_TAG` | preview | `local` |
| `PREVIEW_PORT` | preview | `4173`; published on 127.0.0.1 only |
| `CLOUDFLARE_ACCOUNT_ID` | deploy | required, 32 hex characters |
| `CLOUDFLARE_API_TOKEN` | deploy | required secret; never printed, never a build arg |
| `CLOUDFLARE_PAGES_PROJECT_NAME` | deploy | required; existing project |
| `CLOUDFLARE_PRODUCTION_BRANCH` | deploy | required; must equal the project's production branch |
| `CLOUDFLARE_DEPLOY_BRANCH` | deploy (preview) | `preview`; must differ from the production branch |
| `DEPLOY_TARGET` | deploy | `preview` (default) or `production` |

Build and preview need no Cloudflare values. `node scripts/deploy/cli.mjs check [build|preview|deploy]` validates the configuration without running Docker and shows the token only as `(set)` or `(empty)`.

Changing the site domain is **not** a deploy setting. `src/config/site.ts` is baked into the static HTML, so it requires a source change and a rebuild under SEO-008.

## Commands
| Command | What it does | Exit code |
|---|---|---|
| `build.bat` | Deletes `.artifacts/out`, builds in Docker (lint, typecheck, build, verify:html), exports the artifact, then re-checks it on the host | 0 only if every step passed; a failed build leaves no artifact |
| `preview.bat` | Checks the port is free, builds the `preview` image, serves it at `http://127.0.0.1:PREVIEW_PORT/` | Ctrl+C stops it |
| `deploy-cloudflare.bat` | Validates config, runs a fresh build and verify, then uploads exactly that artifact | nonzero on any failure; nothing is uploaded after a failed step |

Production deploy needs both `DEPLOY_TARGET=production` and `deploy-cloudflare.bat --confirm-production`. Check SEO-008 release readiness first: the tooling never removes `noindex`.

Preview container hardening: non-root user `node`, `--read-only`, `--cap-drop ALL`, `no-new-privileges`, port bound to 127.0.0.1. The static server applies `out/_headers` the same way Pages does, and serves `404.html` with HTTP 404.

## Create the Pages project and token (one time, in the dashboard)
1. Workers & Pages > Create > Pages > **Upload assets** (Direct Upload). Name the project, e.g. `villa-luma`, and upload any placeholder once to create it. Note its production branch (shown under Settings; `main` by default).
2. Account API tokens > Create Token > Custom token > Permissions: **Account / Cloudflare Pages / Edit**. Under Account Resources, select only this account. Set an expiry date.
3. Put the account ID, token, project name and production branch into `.env`.

The scripts never create or delete projects. Sources: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Direct Upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [Wrangler pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/).

## Secret handling
- `.env*` (except `.env.example`), `.dev.vars`, `.wrangler/`, keys and `.git/` are excluded by `.dockerignore`, so they are never in the build context or any image layer.
- The token reaches Wrangler only as `docker run --env CLOUDFLARE_API_TOKEN`, with no value on the command line. Docker reads it from the helper's process environment.
- Before upload, the helper refuses to continue if the artifact contains an env file or the token string. Wrangler output is printed with the token redacted.

## Rollback
Cloudflare Pages keeps earlier deployments. In the dashboard, open the project > Deployments > the previous good deployment > **Rollback to this deployment**. To rebuild an older version locally, check out that commit and run `deploy-cloudflare.bat`. No artifact is reused across runs.

## Troubleshooting
- `Docker engine is not running`: start Docker Desktop and wait for "Engine running".
- `Docker is using windows containers`: switch Docker Desktop to Linux containers.
- `port 4173 is already in use`: stop the other server, or set `PREVIEW_PORT=4180`.
- `upload failed`: check the token permission (Account / Cloudflare Pages / Edit), the account ID and the project name.
- Paths with spaces are supported. A project path containing a comma cannot be bind-mounted; the helper reports this.
