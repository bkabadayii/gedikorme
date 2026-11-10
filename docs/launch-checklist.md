# Launch checklist

Every open item that needs the owner (or an owner decision) before `gedikorme.com` goes live. Engineering items that need no one are in `tasks.md`. `[ ]` open, `[x]` done.

Nothing here is changed on the domain automatically: DNS and the nameserver switch need a separate approval (plan §10 Phase 5).

## 1. Copy and facts
Confirmed already: founded 1997; knitting, dyeing and finishing; the single address (Telsiz, Dursun Kılıç Cd No:38, 34020 Zeytinburnu/İstanbul); phone +90 542 418 77 85 (also WhatsApp); info@gedikorme.com.

- [ ] Review all Turkish copy, then the English (`src/content/copy/tr.ts`, `en.ts`)
- [ ] Founding story, team, machinery, capacity, export markets, certifications. None are claimed today; supply them or leave them out. The old site's "international quality standards" line names no certification and is not used
- [ ] Confirm the sales address `info@gedikorme.com` is the one that should receive inquiries

## 2. Photos, footage and rights
Source list: `docs/media-manifest.md`. Everything there is stock footage or generated, not Gedik Örme's own.

- [ ] Supply original photos/footage: machines, premises, fabrics (organised by fabric code)
- [ ] Confirm ownership and usage rights for everything supplied
- [ ] Replace the three stock clips (Production, About), the generated fabric macros (Home) and the procedural swatches (catalog), then delete their rows from the manifest
- [ ] `public/video/knitting-machine.mp4` is 4.9 MB. If it stays, re-encode it smaller (no ffmpeg on the dev machine)
- [ ] Logo: `public/brand/logo.png` is a 705 px PNG. A vector (SVG) or a larger file would give a sharper header and favicon

## 3. Catalog and the sample decision
- [ ] **Decide:** keep the 10 sample fabrics public but marked "Örnek / Sample" (current), or hide the catalog until verified. Plan §10 asks for an explicit decision. Sample detail pages are `noindex` and left out of the sitemap either way
- [ ] 8–10 verified fabrics: name, category, code, composition, GSM, width, finishing, applications, MOQ if appropriate. Incomplete records are fine; unknown stays "Bilgi için ulaşın". Loader and `catalog-import-template.csv` are not built yet (`tasks.md`)

## 4. KVKK and privacy
- [ ] Owner (or counsel) approves the consent wording. Currently `kvkk-draft-2`, marked DRAFT in `src/content/copy/tr.ts` and `en.ts`; bump `CONSENT_VERSION` in `src/lib/inquiry/validate.ts` on any change
- [ ] Approve the privacy notice (`/tr/gizlilik`, `/en/privacy`, copy in `privacy` in both copy files). Open points: legal basis, retention period, list of processors, whether a VERBIS registration applies, controller details
- [ ] When approved: remove `noindex` from `src/app/[locale]/privacy/page.tsx` and add the page to `src/app/sitemap.ts`
- [ ] Update the consent text if the mail provider is not the one named in the notice

## 5. Mail delivery
Moved here from Phase 3; the forms are built, delivery is not live. Today `/api/inquiry` answers 503 `not_configured` and the form shows the delivery-failed state with phone and email.

- [ ] Domain on Cloudflare (Phase 5), then choose the provider and a verified-domain sender (DNS records only after approval)
- [ ] Create the four Worker secrets: `RESEND_API_KEY` (or the chosen provider's key), `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`, `INQUIRY_TO`. Steps: `DEPLOYMENT.md`. They are deliberately not declared in `cloudflare.config.ts`
- [ ] Create the Turnstile widget for `gedikorme.com` and the `workers.dev` hostname used for previews
- [ ] A real inquiry reaches the inbox, in both languages (Phase 3 exit check)
- [ ] After the secrets exist, load the quote page on the preview and confirm the Turnstile widget renders under the site's Content-Security-Policy (`next.config.ts` allows `challenges.cloudflare.com`; verified only without a key so far)
- [ ] Confirm the rate limit (5 per minute per IP) behaves on the Workers runtime

## 6. Domain and go-live (Phase 5)
- [ ] Export the existing DNS; preserve MX, SPF, DKIM, DMARC and any other service records
- [ ] Add `gedikorme.com` to the Worker, verify TLS and apex/`www` behaviour (the canonical host is `https://gedikorme.com`, no `www`)
- [ ] Decide `www` → apex redirect
- [ ] Separate approval for the nameserver switch
- [ ] After the switch: site, redirects (`/hakkimizda`, `/galeri`, `/iletisim` → Turkish routes), `robots.txt` (indexable only on `gedikorme.com`), sitemap, hreflang, contact delivery, email
- [ ] Submit the sitemap in Search Console; watch indexing and inquiry issues

## 7. Analytics (optional)
None is installed and the privacy notice says there is no tracking. If you want key events (inquiry sent, WhatsApp click), decide the tool first, then update the notice and consent.

## Known, left by engineering
Findings from the Phase 4 audit that were not fixed, and why.

- **Dependency advisories:** 13 moderate in lint and build tooling (`typescript-eslint`, `minimatch`, `satori`/`@vercel/og` and `fflate` via vinext). `npm audit` only offers downgrades of `vinext` and `eslint-config-next`; none is in the shipped Worker code. Revisit when vinext releases. The high-severity Vite advisory (dev server only) was fixed by `npm audit fix`
- **CSP uses `'unsafe-inline'` for scripts and styles:** Next injects inline bootstrap scripts, and a nonce-based policy needs middleware the Worker setup does not have yet. Everything else is locked to `'self'` plus Turnstile. Revisit with nonces
- **Home film is small at 375 px** (`tasks.md`): needs a taller crop
- **Canonical and hreflang point at `https://gedikorme.com`,** which still serves the old site until Phase 5. Nothing on `workers.dev` or previews is indexable (robots and `noindex` by host), so this is intentional
- **Open Graph image is one per language,** not per page. Fine for launch; per-fabric images need real photos
- **Language switch drops the catalog search query** (`?q=`, category) when changing language
- **No Lighthouse or load test was run.** Performance was checked only by transfer size (about 0.4–0.7 MB per page, 5 MB on Production because of the machine clip, which loads only when it scrolls into view) and by loading every page without console errors or horizontal overflow at 375, 390 and 1280. Run Lighthouse on the preview before launch
