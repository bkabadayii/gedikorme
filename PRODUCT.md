# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS with CSS custom properties for tokens; typed static seed data behind a repository interface for v1; no CMS yet. Deployment target is Cloudflare-compatible; adapter/runtime support must be verified before committing. Source: docs/plan.md §8.

## Users

- Turkish B2B buyers: apparel companies, sourcing specialists, wholesalers, designers, purchasing teams.
- International (English-speaking) B2B sourcing teams who need reliable fabric discovery and a clear route to inquiry.
- Secondary: prospective business partners evaluating company history, operations and capabilities.

Journeys: known need (filter catalog, inspect specs, add to inquiry, submit); exploration (browse, compare, request samples/info); supplier evaluation (read production/about pages, verify credibility and location, contact sales).

## Product Purpose

A new bilingual (TR/EN) website for https://gedikorme.com/, the digital showroom of Gedik Örme, a knitted-fabric manufacturer. The goal is qualified B2B inquiries, not online checkout. Success is measured by inquiry submissions, catalog-to-inquiry conversion, contact-link clicks and delivery success; no numeric targets until analytics set a baseline.

## Positioning

An established, real knitted-fabric manufacturer (knitting, dyeing, finishing) presented with editorial material beauty, credible industrial expertise and actionable product information. The fabric is the hero; manufacturing is the proof.

## Operating Context

- Inquiry flow: visitors build a multi-fabric inquiry basket (persisted locally) and submit an RFQ; a general inquiry with no fabrics is also valid. WhatsApp, email and phone are direct alternatives.
- Server-validated form emails the sales inbox; success is shown only after confirmed delivery.
- Locale-prefixed routes with localized slugs (`/tr/kumaslar`, `/en/fabrics`, etc.); old-site URLs redirect.
- Production DNS, nameservers and existing domain email records must never be changed as part of development; the nameserver switch is approved separately.

## Capabilities and Constraints

- Pages: Home, Fabrics catalog (search and filters only where product data exists), Fabric detail, Production, About, Contact, Request a Quote.
- Turkish and English built and QA'd together with identical workflows; Turkish copy written first, English professionally localized.
- Content status per item: `verified`, `draft`, `sample`. Unknown values are `undefined` (shown as "Contact for details"), never zero or invented.
- Seed catalog of 10 representative knitted fabrics (DEMO-001 to DEMO-010) is `sample` only: not verified as produced or sold by Gedik Örme.
- Decided: sample fabrics are public at launch but visibly marked ("Örnek katalog / Sample catalog"). Plan advises not indexing placeholder detail pages until verified.
- Non-goals for v1: prices, cart checkout, accounts, payments, stock, chatbot, ERP, blog, careers or sustainability pages added to fill navigation.
- Never assume without owner confirmation: export markets, equipment, certifications, capacity, lead times, MOQ, prices, availability, composition/GSM values, sustainability claims, testimonials, client logos.

## Brand Commitments

- Name: Gedik Örme. Established 1997 (reconfirm before launch).
- Voice: specific, grounded, human; explain what a fabric or process means to a buyer. No "revolutionizing textiles", "world-class", "cutting-edge" or unverifiable "best quality". CTAs such as `Kumaşları İncele / Explore Fabrics`, `Teklif İste / Request a Quote`, `İletişime Geç / Contact Us`.
- Brand keywords from the plan: tactile, precise, established, understated, warm, human, confident, modern, editorial, practical.
- A logo file exists and will be supplied by the owner.
- The plan binds a 60/30/10 palette (ivory `#F5F2EC`, charcoal `#292C29`, oxblood `#792E3A`) and an editorial serif plus neutral sans pairing; the plan bans AI-startup clichés (purple/blue gradients, glowing blobs, glass cards, SaaS dashboard styling). Recorded as constraints only; visual world is decided in new-work.

## Evidence on Hand

- Public facts from the current site (reviewed 2026-11-10): founded 1997; knitting, dyeing and finishing (apre); sales presence in Zeytinburnu, Istanbul. Contact page lists Merkez: Telsiz Mah., Karanfil Sok. No:26, Zeytinburnu; Şube: Telsiz Mah., Menekşe Sok. No:15/A, Zeytinburnu; phone +90 541 833 43 28; email info@gedikorme.com. All to be reconfirmed by the owner before launch.
- Logo file: promised, not yet in the repo.
- Absent, must not be fabricated: original fabric, machine and premises photography (owner says it exists or is coming; unverified), verified fabric specs, certifications, client logos, testimonials, statistics. The current site's "international quality standards" line does not substantiate a named certification.

## Product Principles

1. Truth over polish: nothing appears as Gedik Örme fact unless verified; sample and representative content is always visibly labeled.
2. The fabric leads and manufacturing proves it; imagery is real or honestly marked representative.
3. Discovery leads to human conversation: every path ends in an easy, low-friction inquiry.
4. Turkish and English are equals, not translation afterthoughts.
5. Clarity of specifications and controls outranks stylistic daring.

## Accessibility & Inclusion

WCAG 2.2 AA where feasible; AA contrast verified for every text/interactive pairing; keyboard navigation, visible focus, accessible form errors, `prefers-reduced-motion` respected. Turkish characters (ğ ü ş ı İ ö ç) must render correctly in both typefaces. Home and catalog primary content works without JS. Business owner or family confirms facts, contacts and TR/EN copy before launch.
