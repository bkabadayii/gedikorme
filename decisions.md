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

## 2026-11-10 — Phase 1 homepage: draft details to reconfirm
- Hero shows "EST. 1997" at the owner-side request as a **draft detail**. Must be reconfirmed by the owner before launch (also in `<meta description>`).
- Hero swatches use procedural knit texture and illustrative names (Ribana · Adaçayı, İnterlok · Kiremit, Süprem · Lacivert), labelled TEMSİLİ ÖRNEK / ILLUSTRATIVE SAMPLE. Not verified Gedik Örme products. Replace with real fabric photography once supplied (public/fabrics/ suggested).
- Hero secondary CTA is now "Bizimle İletişime Geç / Contact Us"; "Teklif İste" remains in the header, the quote band and the footer.

## 2026-11-10 — Hero illustration and macro fabric placeholders
- Hero background is an original SVG line drawing ("yarn to fabric": latch needles, yarn guide, loop formation), three compositions in `src/components/home/yarn-illustration.tsx`. Compare with `/tr?illus=a|b|c`; default is `b` (mechanism). Decorative, `aria-hidden`; short CSS stroke reveal, static under `prefers-reduced-motion`.
- The three card images in `public/fabrics/` (`fabric-{sage,terracotta,navy}-macro.webp` + `-sm.webp`) are **procedural CG renders, not photographs**, made by `scripts/render-fabric-macro.py` (numpy + pillow). No suitable free-licence macro knit photos were found/verified, so none were downloaded. Replace with real catalog photography; filenames and card components can stay the same.
- Labels on the cards (TEMSİLİ ÖRNEK / ILLUSTRATIVE SAMPLE) must stay until real, verified photography replaces them.

## 2026-11-10 — About/Production use Pexels stock clips
- Three Pexels clips (free licence) are transcoded with macOS `avconvert` (no ffmpeg here) to small muted loops in `public/video/`. They play only on screen and not under reduced motion; each sits beside a visible REPRESENTATIVE FOOTAGE / TEMSİLİ GÖRÜNTÜ label stating it is not Gedik Örme's own. Listed in `docs/media-manifest.md`.
- Only facts from PRODUCT.md appear as About/Production content. Process descriptions are general, labelled as such; machinery, capacity, certifications, lead time, MOQ and export markets show "Bilgi için ulaşın".

## 2026-11-10 — Üretim Filmi on the home page 
- Ported the design handoff (`docs/Fabric Production Animation.zip`) to `src/components/film/production-film.tsx`. It autoplays on a loop while on screen (no pause button, by the owner's choice; a still frame instead of autoplay under reduced motion). Step buttons (İplik … Sevkiyat) glide the camera to that scene and playback continues; the camera also swings in 3D and tilts slightly with the pointer. A scroll-driven version was tried and rejected by the owner.
- The handoff's opening and closing wordmark scenes are dropped (so are the "1997" frames). Preview-only engine and tweaks panel are not shipped. Copy is in `content/copy` (`film`, `home.film*`); the film follows the page locale.
- At the owner's request the on-page "representative animation" label was removed. The imagery is plainly drawn (procedural CSS/SVG), not photographic, and still must not be presented as real machinery elsewhere.
- **Deviation from the handoff:** the last caption ("reaches the world") and rail step "Dünya/World" imply export markets (unconfirmed, plan §2). Shipped as "Oradan sizin adresinize yola çıkar / From there, it heads to your address" and "Sevkiyat / Delivery". Caption 5 ("our store in Zeytinburnu") is still unconfirmed.

## 2026-11-10 — Phase 2 catalog
- All catalog access goes through `src/content/catalog/repository.ts`; the seed (`seed.ts`) is `status: 'sample'` with no specifications at all, so every spec row reads "Bilgi için ulaşın". Replace the seed to go live with real data.
- Catalog filtering is server-rendered from query strings (`?q=…&cat=…`) so it works without JS. Spec filters (composition, GSM, application) stay hidden until a fabric has that data (`availableSpecFilters`).
- Swatches are procedural (CSS), one texture per structure, labelled ÖRNEK/SAMPLE with the demo code. Sample detail pages are `noindex`.
- Inquiry basket is a localStorage list of fabric ids (key `gedik.inquiry.v1`, max 50, synced across tabs). The RFQ form itself is Phase 3.

## 2026-11-10 — Phase 3 inquiry delivery
- `POST /api/inquiry` (logic in `src/lib/server/inquiry-handler.ts`, route is a thin wrapper): honeypot → config check → rate limit → validation → Turnstile → Resend. Only a Resend 2xx returns `{ok:true, ref}`. A filled honeypot returns a generic 422 that names no field.
- Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`, `INQUIRY_TO`) are set out-of-band; the recipient address is never in the repo. Rate limit: Workers rate-limit binding, 5 per minute per IP.
- **Change of plan (same day): no Resend for now.** Email delivery is set up with the domain move to Cloudflare (Phase 5). The four secrets are no longer declared in `cloudflare.config.ts` (`bindings.secret()` has no optional form and a declared secret is required at deploy), so deploys work without them. Without them `/api/inquiry` returns 503 `not_configured` and the forms show the delivery-failed state with direct phone/email; success is never shown. Forms stay as built. The Phase 3 exit check (a real email arriving) moves to Phase 5.
- Quote requests do not require the message field (contact still does).
- KVKK consent wording is DRAFT (`CONSENT_VERSION = kvkk-draft-1`); marked in code/docs only, no on-page badge. The consent timestamp and version go into each email. Owner approval is on the Phase 4 checklist.
- Errors use ink with a heavier underline and a drawn mark, never colour alone (DESIGN.md "Only Saturation" rule holds).
- WhatsApp (+90 542 418 77 85, confirmed) links prefill fabric codes and names only.

## 2026-11-10 — Phase 4 (owner-free parts)
- Canonical origin is `https://gedikorme.com` (no `www`), set in `src/lib/seo.ts`. hreflang uses `tr-TR`, `en` and `x-default` (Turkish). Canonical and sitemap URLs come from the same `localizedPath` map as routing.
- Indexing is by host: robots.txt and a `noindex` meta apply unless the request host is `gedikorme.com` or `www.gedikorme.com`, so workers.dev and previews stay out of search without a flag.
- Sample fabric pages stay `noindex` and out of the sitemap; the draft privacy notice is `noindex` and out of the sitemap until approved.
- Favicon is the logo's "G" mark on stone, generated (`scripts/make-brand-assets.mjs`) together with the two Open Graph images; outputs are committed.
- Privacy notice paths `/tr/gizlilik`, `/en/privacy`. Consent text no longer names Resend (provider undecided): it says the message may be transferred abroad through an email provider; `CONSENT_VERSION` is `kvkk-draft-2`. DRAFT marking stays in code/docs only.
- Playwright is a dev dependency; e2e runs against the vinext dev server with the form secrets blanked and `/api/inquiry` mocked per test. The e2e job gates the production deploy.
- Language switch is a client component mapping the current path (and fabric slug) to the other language.
- CSP is production-only (React needs eval in dev) and keeps `'unsafe-inline'` for scripts until nonces are practical. Remaining audit items are in `docs/launch-checklist.md`.
