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
- [x] Owner: create Cloudflare API token, add GitHub secrets (see DEPLOYMENT.md)
- [x] First real deploy to workers.dev
- [ ] PR-preview check (first PR: Phase 2)
- [x] First commit and push

## Phase 1 — Brand experience and homepage
- [x] Header/footer, Numune Masası homepage, DESIGN.md recorded
- [x] About page: facts ledger, stock clips
- [x] Production page: knitting → dyeing → finishing, machine clip
- [x] `docs/media-manifest.md` lists every stock/generated asset to replace
- [x] Facts confirmed: 1997, single address (Dursun Kılıç Cd No:38), phone 0542 418 77 85
- [x] Dev-only labels and notes removed from all pages
- [x] Mobile pass on About/Production at 375 and 390 (About headline overflow fixed)
- [ ] Owner: supply logo, real photos/footage; founding story, team, machinery, capacity, certifications when available
- [ ] Home film on phones: scene is small at 375; consider a taller crop

## Later phases
See docs/plan.md §10.
