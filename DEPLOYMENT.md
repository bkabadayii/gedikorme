# Deployment (Cloudflare Workers)

The site runs on **vinext** (Next.js API on Vite) as a Cloudflare Worker. It is served from `*.workers.dev` only. **Nothing in this repo or workflow touches DNS, nameservers or gedikorme.com**; the cutover is a separate, manually approved step (docs/plan.md Phase 5).

## What is configured

| File | Purpose |
| --- | --- |
| `cloudflare.config.ts` | Worker `gedik-orme`, `nodejs_compat`, static assets binding, `workersDev` and `previewUrls` on |
| `vite.config.ts` | `vinext()` + `@cloudflare/vite-plugin` (RSC environment runs in workerd) |
| `next.config.ts` | Redirects and rewrites generated from `src/lib/i18n/routes.ts` |
| `.github/workflows/cloudflare.yml` | CI on every push/PR; deploy on `main`; preview on PRs |
| `.nvmrc` | Node 22 for local and CI |

`npm run dev` / `npm run build` still run plain Next.js. Production uses the `:vinext` scripts.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev:vinext` | Vite dev server on :3001 |
| `npm run build:vinext` | Production build into `.cloudflare/output` |
| `npm run preview` | Serve the build locally in workerd (the Workers runtime) |
| `npm run deploy:vinext` | Build and deploy to Cloudflare |
| `npm run deploy:vinext -- --dry-run` | Validate setup only |
| `npm run check` | lint, typecheck, tests, build |

## Manual Cloudflare setup (required once)

1. **Cloudflare account** with Workers enabled. Pick the account that will own the site.
2. **workers.dev subdomain**: Workers & Pages → Overview → set the account subdomain if none exists. The site will be `https://gedik-orme.<subdomain>.workers.dev`.
3. **API token**: My Profile → API Tokens → Create Token → template **Edit Cloudflare Workers**, scoped to this account. Copy it once.
4. **Account ID**: from the dashboard URL (`dash.cloudflare.com/<account-id>`).
5. **GitHub repo** `bkabadayii/gedikorme` → Settings → Secrets and variables → Actions → add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
6. **GitHub environment** (optional but recommended): Settings → Environments → `production`; add required reviewers if you want approval before each deploy.
7. **Preview URLs**: Worker → Settings → Domains & Routes → confirm Preview URLs are enabled (the config requests it on first deploy; check that the dashboard agrees).
8. Branch protection on `main` requiring the `check` job (optional).

## Local first deploy (optional)

```sh
npx cf auth login              # browser sign-in
export CLOUDFLARE_ACCOUNT_ID=<id>
npm run deploy:vinext
```

## GitHub flow

- **Pull request** → `check` (lint, typecheck, tests, build). For PRs from this repo, `preview` also uploads a *non-promoted* Worker version (`--no-promote`) and comments the preview URL. Production traffic is unchanged. Fork PRs run `check` only (no secrets).
- **Push to `main`** → `check`, then `deploy` promotes to 100% on workers.dev.

## Verified vs not yet verified

Verified locally (2026-11-10), on the Workers runtime via `npm run preview`:
- `/` → 307 `/tr`; `/tr`, `/en`, `/tr/kumaslar`, `/en/fabrics`, `/tr/teklif-iste`, `/en/request-quote` → 200
- `/tr/fabrics` and `/en/kumaslar` → 308 to the canonical URL; `/hakkimizda`, `/galeri`, `/iletisim` → 308 to `/tr/...`; unknown locale → 404
- `<html lang>` is `tr-TR` / `en`; Turkish copy renders correctly
- `POST /api/inquiry`: 400 bad JSON, 422 invalid email/missing field/filled honeypot, 503 `delivery_not_configured` for valid input, GET → 405
- `npm run lint`, `typecheck`, `test` (10 tests), `build:vinext`, and `deploy:vinext -- --dry-run` pass

**Not verified (needs the account setup above):** an actual deploy, the workers.dev URL, preview-URL generation, and the PR comment step. The `cf` deploy output does not print the preview URL, so the comment step builds it from the Cloudflare API (newest Worker version id prefix + Worker name + account workers.dev subdomain); the API token needs read access to Workers Scripts to do this.

## Contact and quotation endpoints

`POST /api/inquiry` serves both forms. Today it validates and then returns **503 `delivery_not_configured`**, so no UI can show a false success. Route handlers and JSON POST work on Workers. Phase 3 adds delivery. Options to decide then: Cloudflare Email Service, or an HTTP email provider (Resend, Postmark) with its key stored as a Worker secret (`cf` secrets, never in git) plus rate limiting (Workers rate limiting binding or Turnstile). Local secrets go in `.dev.vars` (git-ignored).

## Known risks

- vinext is upstream-labelled "under active development". Re-run `npx vinext check` before adopting new Next.js features, especially `"use cache"` / `cacheComponents` (partial support) and build-time image/font optimization.
- `next/image` is served unoptimized until `imagesOptimizer()` and an Images binding are configured (paid-plan feature to confirm). Pre-size photography for now.
- Fallback if vinext blocks us: OpenNext (`@opennextjs/cloudflare`) on the same source.

## Domain cutover (not part of this work)

Before any nameserver change: export existing DNS, preserve MX/SPF/DKIM/DMARC, add the custom domain to the Worker, verify TLS, then approve the switch separately.
