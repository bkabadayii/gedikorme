# Decisions

## 2026-11-10 — vinext on Cloudflare Workers
- **Chosen:** vinext 1.4.4 (Vite reimplementation of the Next.js API) with Cloudflare's `cf` CLI and typed `cloudflare.config.ts`. Requested by owner; `vinext check` reported 88% compatible on the scaffold (partial: `turbopack` rules, `cacheComponents`).
- **Consequence:** vinext is flagged "under active development" upstream. Fallback is OpenNext (`@opennextjs/cloudflare`) on the same Next.js code; `next dev` / `next build` still work.
- Removed the scaffold's experimental `cacheComponents`, `partialPrefetching` and turbopack Tailwind loader; Tailwind runs through PostCSS.
- React bumped to 19.3.1 (vinext peer requirement).

## 2026-11-10 — Localized routing without middleware
- Internal folders under `src/app/[locale]` use English names. Turkish URLs (`/tr/kumaslar`) are `rewrites()`; wrong-locale or internal URLs 308-redirect to the canonical URL. One typed map (`src/lib/i18n/routes.ts`) drives rewrites, redirects and link building.
- `/` redirects (307) to `/tr`. No geolocation redirect.

## 2026-11-10 — Inquiry endpoint
- Single `POST /api/inquiry` for contact and quote. Phase 0 validates and returns 503 `delivery_not_configured`; it never reports success. Delivery provider is a Phase 3 decision.

## 2026-11-10 — Hosting and previews
- workers.dev only. No DNS, nameserver or gedikorme.com changes.
- PR previews use non-promoted Worker versions (`--no-promote` + `previewUrls`), deployed from GitHub Actions. Dashboard-side Workers Builds is the alternative.
