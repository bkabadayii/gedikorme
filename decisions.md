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
