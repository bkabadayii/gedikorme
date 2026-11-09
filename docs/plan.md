# Gedik Örme — Website Product & Implementation Plan

> Status: Initial implementation specification (v1.0)
> Updated: 2026-11-10
> Audience: Project owner, designers, developers, and Claude Code
> Project: New bilingual website for https://gedikorme.com/

## 0. How to use this document

This is the source of truth for the website's intent, experience, content constraints, and staged delivery. Implement in vertical slices; do not attempt the whole project in a single pass. Track execution in a separate `tasks.md` (create when implementation begins) and record consequential decisions in `decisions.md`. If a design shortcut conflicts with the art direction here, follow the art direction or document a reasoned exception.

**Hard constraints:**
- Never replace production DNS/nameservers or touch existing domain email records as part of website development.
- Never present placeholder fabric imagery/specifications or unverified business claims as verified Gedik Örme facts.
- No AI-startup visual clichés: purple/blue gradients, glowing blobs, floating glass cards, default SaaS dashboard styling, generic 3D shapes, meaningless animations, or boilerplate superlatives.
- Build and QA Turkish and English together, not English as an afterthought.
- The business goal is **qualified B2B inquiries**, not online checkout.

## 1. Vision and success criteria

### Vision
Build a premium, human, modern textile manufacturer's digital showroom: **editorial material beauty + credible industrial expertise + actionable product information**. Visitors should feel that this is an established real business with knowledge, judgment, and care for the material it manufactures.

### Primary audiences
1. **Turkish B2B buyers**: apparel companies, sourcing specialists, wholesalers, designers, and purchasing teams.
2. **International B2B buyers**: English-speaking sourcing/purchasing teams who need reliable fabric discovery and clear routes to inquiry.
3. Secondary: prospective business partners who want evidence of company history, operations, and capabilities.

### Core visitor journeys
- **Known need:** arrive with fabric type / composition / GSM in mind → filter catalog → inspect specification → add to inquiry → submit.
- **Exploration:** browse visuals, applications, knit structures → compare products → request samples or information.
- **Supplier evaluation:** read production and company pages → verify credibility, capabilities, and location → contact sales.

### Outcome metrics (instrument; don't invent targets)
- Qualified inquiry submissions, by language and source page.
- Catalog-to-inquiry conversion and product selections per inquiry.
- Clicks on email, telephone, and WhatsApp links.
- Inquiry delivery success/failure, spam rate, and response process.
- Relevant search impressions and organic landing pages after launch.

No numeric growth or conversion claims until analytics establish a baseline.

## 2. Existing-site content and truth policy

### Confirmed from current public site (reviewed 2026-11-10)
- Gedik Örme was established in **1997**.
- The company describes itself as a **knitted-fabric manufacturer** with **knitting, dyeing, and finishing (apre)** operations.
- The site identifies a sales presence in **Zeytinburnu, Istanbul**.
- Existing contact page lists:
  - Merkez: Telsiz Mahallesi, Karanfil Sokak No:26, Zeytinburnu, İstanbul.
  - Şube: Telsiz Mahallesi, Menekşe Sokak No:15/A, Zeytinburnu, İstanbul.
  - Telephone: +90 541 833 43 28.
  - Email: info@gedikorme.com.
- Source URLs: https://gedikorme.com/ , /hakkimizda , /galeri , /iletisim.

**Before public launch:** owner must reconfirm addresses, phone, mailbox, company operations, exact naming, and any claim reused from the original website. The current website's broad statement about international quality standards does **not** substantiate a named certification.

### Never assume without confirmation
- Export markets, international shipping or global client base.
- Ownership of specific knitting/dyeing/finishing equipment, certifications or branded machine lines.
- Production capacity, lead times, minimum order quantities, inventory, prices, or sample policy.
- Specific product availability or composition/GSM values.
- Sustainability credentials, recycled materials, compliance claims, testimonials, or client logos.

Maintain an explicit content status: `verified`, `draft`, `sample`. Sample content may be used for internal demos and **must be visibly marked** if published. Avoid indexing placeholder product-detail pages until they have verified product content.

## 3. Brand personality and artistic direction

### Brand keywords
Tactile. Precise. Established. Understated. Warm. Human. Confident. Modern. Editorial. Practical.

### Creative thesis
The fabric is the visual hero; manufacturing is the proof. Take cues from premium fashion editorials, print catalogs, architecture magazines, materials libraries, and thoughtful industrial photography—not SaaS landing-page kits.

### 60 / 30 / 10 palette
| Role | Share | Token | Hex | Use |
| --- | --- | --- | --- | --- |
| Primary | ~60% | `--color-ivory` | `#F5F2EC` | Main backgrounds, editorial breathing room |
| Secondary | ~30% | `--color-charcoal` | `#292C29` | Main type, high-contrast sections, footer |
| Accent | ~10% | `--color-oxblood` | `#792E3A` | Primary CTAs, meaningful interactive emphasis, selected rules |

Support neutrals (not competing brand colors): `--color-paper: #FCFAF6`, `--color-muted: #6D6A63`, `--color-line: #D9D4CA`. Use cream text `#F5F2EC` on charcoal. Check accessible contrast for every text/interactive combination (WCAG AA normal text >= 4.5:1; large text >= 3:1). Avoid burgundy as a full-width default backdrop; keep its use rare and purposeful.

60/30/10 is an **overall visual balance**, not a rule for literal pixel counting. Product photography introduces its own colors but should be color-graded consistently and naturally, without falsifying fabric hues.

### Typography
- Display: a characterful **editorial serif** with excellent Turkish characters (e.g. `Cormorant Garamond` or `Newsreader`, subject to live type tests).
- Utility/body: neutral high-legibility **sans-serif** (e.g. `Manrope` or `Inter`, subject to live type tests).
- Limit to two families, careful weight range, clear hierarchy.
- Use meaningful contrast: strong large headlines and smaller deliberate technical captions, not giant typography everywhere.
- Avoid artificial letter spacing on long Turkish text; verify `ğ, ü, ş, ı, İ, ö, ç` in both typefaces.
- Include correct font licensing and load locally or with an appropriately optimized provider.

### Composition and grid
- Build a strong underlying 12-column desktop grid; **break visual symmetry intentionally**.
- Use asymmetrical 5/7 or 7/5 image/text splits, offset image baselines, varying editorial crop ratios, and occasional narrow reading columns.
- Alternate serene negative space and dense useful detail; don't make every section a card grid.
- Prefer sharp edges or restrained 2–8px rounding; no ubiquitous 24px rounded cards.
- Use hairline separators, generous section spacing, and subtle number labels (`01 / MATERIAL`, `02 / PROCESS`) sparingly.
- Mobile should be composed deliberately, not just a stacked desktop layout; preserve whitespace and hierarchy without sacrificing usability.
- Never sacrifice clarity of specifications or controls for avant-garde layout.

### Photography / visual assets
- Priority 1: original high-resolution photos of **actual Gedik Örme fabrics**, swatches, textile folds, machines, hands at work, manufacturing detail, and premises.
- Photography style: natural directional light, authentic texture, honest colors, imperfect/human details, restrained grading.
- Until originals exist: use licensed or self-created **clearly labeled representative imagery** for design/staging. Do not imply placeholder images document Gedik Örme equipment/products. Maintain a central replacement manifest.
- No stock photos of anonymous smiling office teams, AI-generated sci-fi factories, or generic business handshakes.
- No decorative image solely because a section feels empty.

### Motion and interaction
- Subtle reveal transitions, delicate crop/parallax only if performance allows, product image zoom, tasteful underline/micro-interaction.
- Typical durations 150–350ms; respect `prefers-reduced-motion` and avoid layout shifts.
- No autoplay hero carousel, aggressive cursor effects, scroll hijacking, looping marquess, or entrance animation on every component.
- Product UI should feel responsive and deliberate, not flashy.

### Copywriting rules
- Specific, grounded, human language. Explain what a fabric or process means to a buyer.
- Short clear CTAs: `Kumaşları İncele / Explore Fabrics`, `Teklif İste / Request a Quote`, `İletişime Geç / Contact Us`.
- Avoid generic phrases such as “revolutionizing textiles”, “world-class innovation”, “cutting-edge solutions”, and unverifiable “best quality”.
- Sample editorial heading (provisional): TR `Her kumaşın ardında bir uzmanlık var.` / EN `Experience woven into every fabric.` These are **draft creative directions**, not approved brand slogans.
- Human Turkish copy first, professional English localization (not literal machine-translation style); consistent textile terminology.

## 4. Information architecture and routes

Use locale-prefixed routes for parity and SEO:

| Turkish | English | Function |
| --- | --- | --- |
| `/tr` | `/en` | Home |
| `/tr/kumaslar` | `/en/fabrics` | Searchable/filterable catalog |
| `/tr/kumaslar/[slug]` | `/en/fabrics/[slug]` | Fabric detail |
| `/tr/uretim` | `/en/production` | Production and QA overview |
| `/tr/hakkimizda` | `/en/about` | History, expertise, identity |
| `/tr/iletisim` | `/en/contact` | Contact and location |
| `/tr/teklif-iste` | `/en/request-quote` | Multi-fabric RFQ form |

Optional later: dedicated applications/use-cases landing pages, material education, verified certifications. **Do not add a blog, careers, or sustainability page just to fill navigation.**

### Navigation
Desktop: Logo | Fabrics | Production | About | Contact | TR / EN | [Request a Quote].
Mobile: accessible menu, persistent language switch, contact CTA, visible inquiry basket count where appropriate.

Preserve locale when switching languages and move to the equivalent translated product page where available. Home and catalog must be accessible without JS for primary content.

## 5. Page-by-page UX requirements

### Home
1. Clean, intentional header; brand/logo and language toggle.
2. Editorial hero: true manufacturing/material image, precise headline, descriptive subhead, `Explore Fabrics` primary CTA and `Request a Quote` secondary CTA. **No slideshow.**
3. Brief proof/identity line: `Since 1997` (only if reconfirmed), knitted fabric production; no invented stats.
4. Featured fabric categories (3–4 initially) with varied photographic crops and clear browsing paths.
5. Manufacturing section: knitting → dyeing → finishing; link to Production; distinguish verified operations from aspirational descriptions.
6. Company/story vignette with real imagery and timeline or selected milestones only if factual.
7. Strong contextual inquiry panel: talk to the team about fabric needs.
8. Footer: verified contacts, location, language, legal links.

### Catalog
- Search by name/code/keywords (both languages where relevant).
- Filters: structure/category, composition, GSM range, intended application **only when product data exists**. Avoid empty or inaccurate filter controls.
- Clearly visible count and reset filters, meaningful empty state.
- Product cards: honest photo/sample-image tag, name, code, concise useful properties, link to details, `Add to Inquiry` control.
- Avoid fake stock, price, review stars, or e-commerce checkout affordances.
- Functional and accessible keyboard/mobile navigation; pagination or progressive loading if catalog grows.

### Fabric detail
- Real photo gallery when provided; until then obvious sample photo treatment.
- Product title/code, concise explanation, structured technical specs, potential applications, available variants if verified.
- Show missing specs as `Contact for details` rather than fictional values.
- Clear `Add to Inquiry` and immediate `Request information about this fabric` options.
- Related fabrics by category/structural similarity, not arbitrary recommendations.
- No unnecessary tab maze; important specs visible on page.

### Production
- Editorial documentary storytelling: knitting, dyeing, finishing, quality, and process flow grounded in real operations.
- Show machinery details, capacity, standards, and location only after verification.
- Buyer-facing purpose: how process contributes to consistency, quality, and coordination.
- Avoid fictional certificates or facility footage.

### About
- Founded in 1997, provenance, values, human expertise, facility/teams imagery (verified facts only).
- Fewer generic paragraphs; show specifics and careful chronology.
- Invite prospective buyers to discuss an order or visit/contact.

### Contact
- Email, phone, physical address(es) with clickable actions; map only if it adds value and privacy/performance are acceptable.
- Dedicated inquiry entry point and plain direct contact route.
- Correct international telephone formatting and time-zone context if desired.

### Request a Quote (RFQ)
- Inquiry basket persists during navigation (local storage if appropriate, with minimal personal-data collection).
- Show selected product list with remove/edit controls. Allow **general inquiry with no selected fabrics**.
- Fields: name, company, email (required), phone/WhatsApp (optional), country (optional), selected fabrics, estimated quantity + unit (optional), message / technical requirements (required), consent to privacy notice (where required).
- Optional product-level notes; do not force unknown details such as GSM, color, MOQ.
- Explicit acknowledgment and graceful errors. Accessible validation and spam/honeypot/rate limiting.
- Server validates input; emails sales inbox and optionally sends customer acknowledgment after confirmed delivery; protect credentials and minimize retention.
- Maintain delivery logs without exposing personal information to analytics.
- WhatsApp link can prefill a short message referencing selected fabric names/codes, but do not leak PII in URLs.
- Confirm sales recipient and WhatsApp number with owner before launch.

## 6. Initial 10-fabric seed catalog — **representative only**

These are common knitted-fabric types proposed for demonstrating UI and data structures. **Not verified as produced, stocked, or sold by Gedik Örme.** Keep `contentStatus: 'sample'`; display `Sample catalog / Örnek katalog` where present on a public preview. Do not set fabricated GSM, widths, blends, MOQs, prices, or availability.

| Sample code | TR name | EN name | Illustrative description |
| --- | --- | --- | --- |
| DEMO-001 | Süprem | Single Jersey | Versatile single-knit structure often used in casual clothing |
| DEMO-002 | Ribana | Rib Knit | Ribbed knit with stretch and recovery characteristics |
| DEMO-003 | İnterlok | Interlock | Double-knit construction with a smooth hand feel |
| DEMO-004 | İki İplik | Two-Thread Fleece | Knit associated with lightweight sweatwear |
| DEMO-005 | Üç İplik | Three-Thread Fleece | Heavier sweatwear-oriented knit construction |
| DEMO-006 | Pike | Piqué Knit | Textured knit commonly used in polo-style clothing |
| DEMO-007 | Kaşkorse | Fine Rib Knit | Fine rib texture often used in fitted apparel |
| DEMO-008 | Selanik | Milano / Ottoman Rib Knit | Pronounced knit texture; English naming requires review per actual construction |
| DEMO-009 | Jakarlı Örme | Jacquard Knit | Patterned knit formed through knitting structure |
| DEMO-010 | File Örme | Mesh Knit | Open construction often used for breathable applications |

Technical terminology and EN aliases must be validated with a textile expert before publishing as an actual product line. Demo codes are not real SKUs. **Keep sample and verified datasets separate**, and support swapping the catalog without rewriting UI components.

### Suggested data schema
```ts
type ContentStatus = 'sample' | 'draft' | 'verified';
type Locale = 'tr' | 'en';

type Fabric = {
  id: string; // stable, never language-dependent
  code: string; // demo code or confirmed real SKU
  status: ContentStatus;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  categoryId: string;
  imageAssets: Array<{
    src: string;
    alt: Record<Locale, string>;
    isRepresentative: boolean;
  }>;
  specifications?: {
    composition?: Array<{ fiber: string; percent: number }>;
    gsm?: { min?: number; max?: number };
    widthCm?: { min?: number; max?: number };
    finishes?: string[];
    applications?: string[];
    colors?: string[];
    moq?: { value: number; unit: string };
  };
  searchKeywords?: Record<Locale, string[]>;
  featured?: boolean;
};
```

Validate composition percentages and ranges when present. Represent unknown as `undefined`, **never as zero**. Store taxonomy IDs independently of translation. Prepare a `catalog-import-template.csv` for eventual owner-supplied product information.

## 7. Bilingual UX and SEO

- Both locales must have identical workflows, product availability, and inquiry functionality.
- Use localized metadata/title/description, canonical URLs, alternate `hreflang` (including `tr-TR`, `en`, and optionally `x-default`), and an XML sitemap.
- Redirect `/` to the selected default locale (TR is acceptable; use explicit locale routes and deterministic behavior). Avoid search-engine-unfriendly automatic geolocation redirection.
- Implement old-site redirects where appropriate: `/hakkimizda` → `/tr/hakkimizda`, `/galeri` → `/tr/kumaslar` or an appropriate gallery replacement, `/iletisim` → `/tr/iletisim`.
- Use semantic headings and structured organization/product data **only where verified**; don't add offers/prices/stars that don't exist.
- Translation keys live outside components. Support bilingual slugs and equivalent-locale navigation.
- Dates, decimal formatting, dimensions, units, and email confirmation copy should be locale-aware.

## 8. Engineering architecture

### Recommended initial stack
- **Next.js (App Router) + TypeScript**, with modern stable releases verified at setup.
- **Tailwind CSS** with CSS custom properties for design tokens; a small set of **bespoke components**, not a stock SaaS theme.
- Server-rendered catalog and SEO-relevant content; client components only for interactive filtering, inquiry basket, and forms.
- Static typed seed-data files for v1. A headless CMS should be evaluated when verified products and editorial updates become frequent; avoid adding CMS complexity immediately. Data access behind a repository/interface so the transition is easy.
- Deployment target: Cloudflare-compatible preview and production hosting. **Verify current Next.js support and required adapter/runtime** before committing to a Cloudflare-specific setup; Cloudflare Pages static deployment and full SSR/Workers are different choices. Alternatively, use a separate supported hosting provider while Cloudflare handles DNS.
- No mandatory authentication or commerce backend.

### Suggested repository structure
```text
src/
  app/
    [locale]/
      page.tsx
      kumaslar-or-localized-routing/  # actual localized route setup documented in code
      ...
  components/
    layout/
    editorial/
    catalog/
    inquiry/
    ui/
  content/
    company/
    copy/
    fabrics/
  lib/
    catalog/
    i18n/
    inquiry/
    seo/
  styles/
public/
  images/
    placeholders/
    fabrics/
    production/
  fonts/                       # only appropriately licensed assets
plan.md
tasks.md                          # create in phase 0
README.md
```

Implementation note: localized route patterns in the table above are required outcomes; don't literally create a `kumaslar-or-localized-routing` route. Pick an explicit i18n routing strategy with tested typed mappings.

### Security and data handling
- Validate inputs server-side, apply reasonable request limits, bot/honeypot defense, and rate limiting.
- Secrets exclusively in deployment environment, never in git.
- Avoid logging personal inquiries in plaintext. Define a privacy notice and data retention approach before accepting submissions.
- Contact form should fail transparently if delivery fails; never show success for an unsent inquiry.
- Do not load heavyweight third-party trackers by default; honor applicable privacy/cookie requirements.

### Performance, accessibility, quality
- Target excellent Core Web Vitals on mobile; compress/responsive-serve photography without destroying useful texture detail.
- Hero images sized for screen; explicit dimensions, lazy load below-fold, no layout shifts.
- Support semantic landmarks, keyboard nav, visible focus, screen-reader labels, reduced motion, accessible form errors, and minimum WCAG 2.2 AA where feasible.
- Test Chrome, Safari, Firefox, iOS Safari, Android Chrome and common viewport widths.
- Unit tests for catalog filtering, localized mapping, inquiry basket, and input validation; smoke/e2e tests for core TR/EN journeys and RFQ success/error handling.

## 9. Component design and acceptance examples

### Core reusable pieces
- `SiteHeader`, `LocaleSwitch`, `MobileMenu`, `SiteFooter`.
- `EditorialHero`, `SectionIntro`, `AsymmetricFeature`, `ManufacturingProcess`, `InquiryCTA`.
- `FabricCard`, `FabricFilterBar`, `FabricSpecificationTable`, `FabricGallery`, `SampleContentBadge`.
- `InquiryBasket`, `InquiryForm`, `InquirySuccess`, `InquiryError`.

### A good homepage passes when
- At first glance users can tell the company makes knitted fabrics, and they can reach fabrics/contact in one action.
- No fake factory/quality claims or unlabeled placeholder photos.
- Visual rhythm shows asymmetry and deliberate whitespace, not repeated identical cards.
- Mobile retains clarity and fast primary CTA access.
- Both languages are complete and professionally phrased.

### A good catalog passes when
- Demo products are clearly identified as representative, all links work, filters reflect real available attributes, and missing specs aren't made up.
- Users can add/remove fabrics from an inquiry, navigate away and back, and submit without a checkout account.
- Product content can be replaced from a data source without changing templates.

### A good RFQ passes when
- General inquiries and multi-product inquiries work.
- Form validates on client and server, emails the real verified inbox, shows success only after successful delivery, and handles failures clearly.
- No inquiry data appears in public URLs or analytics payloads.

## 10. Delivery plan — incremental Claude Code work units

### Phase 0 — Repo foundation
- [ ] Inspect repository and existing framework before modifying files.
- [ ] Initialize Next.js, TypeScript, Tailwind, linting/formatting, basic tests.
- [ ] Establish `tasks.md` and `decisions.md` with scoped work units.
- [ ] Confirm deployment target/adapter compatibility and create preview deployment.
- [ ] Put palette, typography, spacing, grid, and motion settings into tokens.
- [ ] Set TR/EN routing and translation conventions before page construction.

**Exit:** Preview build works, locales route correctly, tokens are established, and production DNS is unchanged.

### Phase 1 — Brand experience and homepage
- [ ] Build bespoke desktop/mobile header/footer.
- [ ] Build editorial, asymmetrical homepage sections with representative assets clearly identified.
- [ ] Implement real-feeling, restrained hover/reveal effects and reduced-motion support.
- [ ] Add basic About/Production narrative with verified facts and clear TODOs for missing details.

**Exit:** Home is visually distinctive on desktop/mobile, bilingual, accessible, and avoids stock AI-template composition.

### Phase 2 — Catalog and fabric details
- [ ] Implement 10-item labeled sample catalog from a typed repository.
- [ ] Add search, category filters, useful empty states, and localized slugs.
- [ ] Build editorial product detail with a robust incomplete-spec state.
- [ ] Implement inquiry basket and selected-product persistence.
- [ ] Export/import format to replace seed data with original catalog later.

**Exit:** A buyer can discover, inspect, and select fabrics in both languages without encountering fictional facts.

### Phase 3 — Inquiry and contact
- [ ] Build complete RFQ and contact pages.
- [ ] Add validated server endpoint and configured delivery provider.
- [ ] Handle anti-spam, privacy consent, accessible errors, and delivery outcomes.
- [ ] Add optional WhatsApp/email shortcuts using verified contact info.
- [ ] Instrument key events without personal data.

**Exit:** Verified end-to-end inquiries reach the designated recipient in a test environment.

### Phase 4 — Production readiness
- [ ] Finalize owner-approved real-world copy, company details, and verified contact info.
- [ ] Validate sample-status treatment; decide explicitly whether sample items should be public or hidden until verified.
- [ ] Replace representative photos with originals as available; verify image rights.
- [ ] Add redirects, metadata, sitemap/hreflang, social sharing, favicon, privacy notice.
- [ ] Run accessibility, responsiveness, performance, functional, and security checks.
- [ ] Review contact/email delivery and deploy to staging.

**Exit:** Formal release checklist signed off; no unauthorized claims, broken CTAs, or hidden sample-data ambiguity.

### Phase 5 — Launch without downtime
- [ ] Export/copy existing DNS records; specifically preserve MX/SPF/DKIM/DMARC and other services.
- [ ] Verify Cloudflare DNS configuration, TLS, apex/www behavior, and deployment domain mapping.
- [ ] Approve nameserver switch separately; **do not perform automatically**.
- [ ] After switch, verify site, redirect behavior, multilingual SEO, contact delivery, and email operation.
- [ ] Monitor inquiry issues and indexing after launch.

**Exit:** New site live and all existing essential domain services functional.

## 11. Explicit non-goals for v1

- Public prices, shopping cart checkout, customer accounts, payment, stock management.
- An elaborate AI chatbot or AI-driven recommendations.
- Complex CMS customization or ERP integration before content needs justify them.
- Unsupported testimonials, fabricated brand/client logos, compliance badges, or sustainability claims.
- Dozens of speculative pages and a placeholder blog.

## 12. Owner input checklist (can be collected progressively)

**Needed for initial implementation:** preferred logo file, approval of palette/type direction, confirmed sales inbox and phone, desired deployment account/provider, approval of placeholder disclosure, initial TR/EN copy review.

**Needed before full public production launch:** verified business identity and contacts; privacy notice; photo ownership/usage rights; confirmation of exact operations and claims; decision on whether demo product pages should be publicly indexed; inquiry test with recipient.

**Needed to replace initial catalog later:** 8–10 verified fabric entries (names, actual category, codes if available, compositions, GSM, width, finishing, applications, MOQ if appropriate) plus clear original photographs, organized by product code. Incomplete records are allowed; never infer absent specs.

## 13. Instructions for Claude Code

When beginning a work session:
1. Read `plan.md`, then inspect the current repository, `tasks.md`, and `decisions.md`.
2. Propose and implement **one bounded phase/work unit**. Avoid sweeping refactors unrelated to that unit.
3. Start each design step with its visual intent; evaluate it against: *tactile, editorial, asymmetrical, real, useful*.
4. Prefer reusable semantic components and design tokens; avoid prebuilt template aesthetics.
5. Produce both Turkish and English content/behavior for each feature, and test both.
6. Never silently replace `sample` fields with invented details; propagate status to UI and metadata.
7. Run available lint/typecheck/tests/build, fix breakages, and report what was actually verified.
8. Update `tasks.md` status and `decisions.md` for material decisions. Do not alter production DNS or send actual outbound emails until explicitly configured and authorized.
9. When visual output is possible, inspect screenshots at desktop and mobile widths and correct visual rhythm, awkward crops, spacing, contrast, and generic-looking patterns.

### First Claude Code prompt (recommended)

> Read `plan.md` fully and inspect the repository. Implement **Phase 0 only**: Next.js/TypeScript/Tailwind baseline, accessible TR/EN route foundation, design tokens (60/30/10), project structure, lint/typecheck, and a minimal preview-ready shell. Create `tasks.md` and `decisions.md`. Do not implement the catalog or contact delivery yet. Make no production DNS changes. Run checks and summarize changes and decisions.

---

**North star:** A serious textile manufacturer, presented with artistic restraint and genuine industrial credibility, with fabric discovery leading naturally to human conversation.
