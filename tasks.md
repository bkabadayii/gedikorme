# Tasks

Status: `[ ]` open, `[x]` done. Phases follow docs/plan.md §10.

## Phase 0 — Repo foundation
- [x] Next.js (App Router) + TypeScript + Tailwind v4 baseline
- [x] Design tokens (60/30/10 palette, fonts, radius, motion) in `src/app/globals.css`
- [x] TR/EN routing: typed segment map, rewrites, redirects, legacy redirects
- [x] Copy dictionaries outside components (`src/content/copy`)
- [x] Lint, typecheck, vitest
- [x] vinext + Cloudflare Workers config (`cloudflare.config.ts`, `vite.config.ts`)
- [x] `/api/inquiry` stub verified on the Workers runtime (always 503 until delivery exists)
- [x] CI + deploy workflow (`.github/workflows/cloudflare.yml`)
- [x] DEPLOYMENT.md
- [ ] Owner: create Cloudflare API token, add GitHub secrets (see DEPLOYMENT.md)
- [ ] First real deploy to workers.dev and PR-preview check
- [x] First commit (push still pending)

## Phase 1 — Brand experience and homepage
- [x] Header/footer, Numune Masası homepage, DESIGN.md recorded
- [x] About page: verified-only facts ledger, representative stock clips, story slot as TODO
- [x] Production page: knitting → dyeing → finishing, unconfirmed specs as "Bilgi için ulaşın" rows
- [x] All generated/stock imagery labelled representative; `docs/media-manifest.md` lists replacements
- [ ] Owner: reconfirm 1997, addresses, phone, email; supply logo, real photos/footage
- [ ] Owner: founding story, team, machinery, capacity, certifications (About/Production TODOs)
- [ ] Mobile visual pass on About/Production at real device width

## Later phases
See docs/plan.md §10.
