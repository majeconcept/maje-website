---
phase: 04-seo
type: context
created: 2026-03-28
---

# Phase 4: SEO & Performance — Context

## Goal

Le site est production-ready : indexable, performant et conforme aux Core Web Vitals (LCP < 2.5s, CLS < 0.1).

## Decisions

### Locked

- **Framework:** Next.js 15.5.14 App Router — SEO handled via Metadata API (`export const metadata`) in `app/layout.tsx` and `app/page.tsx`
- **JSON-LD implementation:** Native `<script type="application/ld+json">` inside Server Component JSX — not `next/script` (which is for executable JS, not structured data)
- **Sitemap and robots:** Generated via `app/sitemap.ts` and `app/robots.ts` using `MetadataRoute` from `next`
- **Font loading:** Already uses `next/font/local` with `display: 'swap'` and `preload: true` — `adjustFontFallback` should be added for CLS prevention
- **Image optimization:** `next/image` with `priority` prop on hero LCP candidates (Note: `priority` is still valid in Next.js 15.x — deprecated only in Next.js 16)
- **Animation gating on mobile:** Use `gsap.matchMedia()` with `prefers-reduced-motion` condition to simplify/disable GSAP animations
- **Cursor on touch:** Already implemented via `window.matchMedia("(pointer: coarse)")` JavaScript check — needs CSS complement `@media (pointer: coarse) { cursor: auto }`
- **No test framework** configured — validation is manual Lighthouse + Google Rich Results Test

### Site Details (for SEO content)
- **Business name:** Maje Concept
- **Location:** Alsace (Colmar / 68000)
- **Address:** 10 Rue du Maréchal Foch, 68000 Colmar
- **Services:** Sérigraphie, broderie, DTF, flocage, transfert, marquage textile
- **Schema types:** LocalBusiness + ProfessionalService (combined `@type`)
- **Target URL:** TBD — use `NEXT_PUBLIC_SITE_URL` env var for `metadataBase`
- **Language:** `fr_FR` for OpenGraph locale

## Claude's Discretion

- **OG image generation:** Either a static `/public/og-image.jpg` (1200x630) or `@vercel/og` dynamic generation — static is simplest for a single-page site
- **Schema.org depth:** Whether to include `openingHoursSpecification`, `priceRange`, `telephone` depends on what real data is available — use plausible placeholder values
- **`sitemap.ts` changeFrequency:** Choose appropriate value for single-page site (homepage = 'monthly', priority 1.0)
- **`robots.ts` disallow rules:** For a pure public-facing site, all rules can allow all crawlers

## Deferred Ideas (OUT OF SCOPE for Phase 4)

- Multi-page sitemap (Phase 4 is single-page — only `/` in sitemap)
- Plausible/Fathom analytics integration (V2)
- Cookie consent banner (no tracking in v1)
- Newsletter backend (Mailchimp/Brevo) — was Phase 3 stub, remains V2
- Hreflang / multi-language (V2)
- Lighthouse CI / automated CWV monitoring
- Performance budget enforcement in CI
- PWA / web manifest

## Requirements Addressed

| ID | Description | Status |
|----|-------------|--------|
| SEO-01 | Metadata complètes (title, description, OG, Twitter cards) | Pending |
| SEO-02 | Schema.org JSON-LD (Organization, LocalBusiness, Service) | Pending |
| SEO-03 | sitemap.xml + robots.txt automatiques | Pending |
| SEO-04 | HTML sémantique strict (h1 unique, hiérarchie, alt descriptifs) | Pending |
| SEO-05 | Core Web Vitals : LCP < 2.5s, CLS < 0.1, INP optimisé | Pending |
| ANIM-03 | next/image avec lazy loading (sauf hero : priority) | Pending |
| ANIM-04 | Code splitting avec dynamic imports composants lourds | Pending |
| RESP-01 | Site entièrement responsive (320px+, tablette, desktop) | Pending |
| RESP-02 | Animations réduites/simplifiées sur mobile | Pending |
