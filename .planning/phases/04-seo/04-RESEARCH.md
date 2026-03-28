# Phase 4: SEO & Performance — Research

**Researched:** 2026-03-28
**Domain:** Next.js 15 SEO APIs, Core Web Vitals optimization, mobile responsive polish
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Next.js 15.5.14 App Router — Metadata API, not third-party head managers
- JSON-LD via native `<script>` tag in Server Component JSX — not `next/script`
- Sitemap and robots via `app/sitemap.ts` / `app/robots.ts`
- `next/font/local` with `display: 'swap'` already in place — add `adjustFontFallback`
- `next/image` with `priority` prop (still valid in Next.js 15.x)
- `gsap.matchMedia()` for reduced-motion / mobile animation gating
- No test framework — validation is manual (Lighthouse + Rich Results Test)

### Claude's Discretion
- OG image: static `/public/og-image.jpg` (1200x630) vs `@vercel/og` dynamic — static recommended
- Schema.org depth: plausible placeholder values for address, hours, priceRange
- sitemap.ts: single URL `/` with `changeFrequency: 'monthly'`, `priority: 1`
- robots.ts: allow all crawlers, point to sitemap

### Deferred Ideas (OUT OF SCOPE)
- Multi-page sitemap
- Analytics (Plausible/Fathom)
- Cookie consent
- Newsletter backend
- Hreflang / multi-language
- Lighthouse CI / automated CWV monitoring
- PWA / web manifest
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Metadata complètes (title, description, OG tags, Twitter cards) via Next.js Metadata API | Patterns 1–2: `export const metadata` with `metadataBase`, `openGraph`, `twitter` |
| SEO-02 | Schema.org JSON-LD (Organization, LocalBusiness, Service, BreadcrumbList) | Pattern 3: native `<script type="application/ld+json">` in layout.tsx Server Component |
| SEO-03 | sitemap.xml et robots.txt via app/sitemap.ts et app/robots.ts | Pattern 4–5: `MetadataRoute.Sitemap` and `MetadataRoute.Robots` |
| SEO-04 | HTML sémantique strict (h1 unique, hiérarchie, alt descriptifs) | Audit checklist in Common Pitfalls — code audit task, not library research |
| SEO-05 | Core Web Vitals LCP < 2.5s, CLS < 0.1, INP optimisé | Patterns 6–7: `priority` on hero, `adjustFontFallback`, no layout-shift sources |
| ANIM-03 | next/image avec lazy loading sauf hero (priority) | Pattern 6: `priority` prop on HeroSection image (currently no next/image in hero — text-only hero, see note below) |
| ANIM-04 | Code splitting avec dynamic imports pour composants lourds | Pattern 8: `next/dynamic` with `ssr: false` for GSAP-heavy sections |
| RESP-01 | Site entièrement responsive 320px+, tablette, desktop | Tailwind responsive prefix audit + breakpoint strategy |
| RESP-02 | Animations réduites/simplifiées sur mobile | Pattern 9: `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` + `(max-width: 768px)` |
</phase_requirements>

---

## Summary

Phase 4 is a polish-and-hardening phase — no new visible features, only production readiness. The codebase at end of Phase 3 passes `npm run build` with zero TypeScript errors and delivers 281KB First Load JS. The work falls into four buckets:

**SEO signals:** Next.js 15 provides the Metadata API (`export const metadata`) for head tags, and file-based `app/sitemap.ts` / `app/robots.ts` for crawl infrastructure. Both are Server Component exports — no client JS needed. JSON-LD structured data uses a native `<script>` tag directly in JSX (not `next/script`, which is for executable code).

**Core Web Vitals:** The site is predominantly text + CSS animation, so LCP candidates are likely the `<h1>` (text LCP) or any above-fold images. CLS risks are: (a) font swap FOUT — mitigated by adding `adjustFontFallback: true` to the existing `next/font/local` config; (b) dynamic content without reserved dimensions — unlikely given the static structure. INP is natural for React 19 + static content.

**Image optimization (ANIM-03):** The current HeroSection uses no `next/image` — the hero is text-only with a CSS noise background. PortfolioSection and SocialProofSection use placeholder/inline SVG data. No `<img>` tags were found in section components. ANIM-03 is satisfied by ensuring all future real images use `next/image`, and any existing `<img>` tags are replaced. One audit pass is all that's needed.

**Mobile responsive + animation reduction (RESP-01, RESP-02):** The cursor system already bails out on `pointer: coarse` in JavaScript. GSAP animations need `gsap.matchMedia()` guards so that on mobile (or with prefers-reduced-motion), heavy entrance animations are either simplified (shorter duration, no parallax) or skipped entirely.

**Primary recommendation:** All SEO/metadata work goes in `app/layout.tsx` (Server Component already). Dynamic imports should wrap the three heaviest sections (PortfolioSection, ConfiguratorSection, SocialProofSection). Font adjustFontFallback and gsap.matchMedia() guards address the remaining CWV/responsive requirements.

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| next | 15.5.14 | Metadata API, sitemap.ts, robots.ts, next/image | All SEO features built in — no extra install |
| gsap + @gsap/react | 3.14.2 / 2.1.2 | matchMedia() for reduced-motion gating | Already installed |

### Additions (new installs for this phase)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | 1.1.x | TypeScript types for Schema.org JSON-LD | Optional — adds type safety to the JSON-LD object |

**Installation for new packages:**
```bash
npm install -D schema-dts
```

schema-dts is a dev dependency — it only provides TypeScript types, zero runtime bundle impact.

**Version verification (current as of 2026-03-28):**
```bash
npm view schema-dts version   # 1.1.0
```

---

## Architecture Patterns

### Recommended File Structure (additions to existing)
```
src/app/
├── layout.tsx          # Add: full metadata export, JSON-LD script, adjustFontFallback
├── sitemap.ts          # NEW: MetadataRoute.Sitemap — generates /sitemap.xml
├── robots.ts           # NEW: MetadataRoute.Robots — generates /robots.txt
├── page.tsx            # Add: metadata export for page-level OG; wrap heavy sections with dynamic()
public/
└── og-image.jpg        # NEW: 1200x630 static OG image for social sharing
```

---

## Code Examples

Verified patterns from official Next.js documentation (v15 / v16.2.1 — all patterns backward compatible):

### Pattern 1: Full Metadata Export in app/layout.tsx

The current `layout.tsx` exports a minimal `metadata`. This replaces it with the full set.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maje-concept.fr'),

  title: {
    default: 'Maje Concept — Impression & Marquage Textile Premium en Alsace',
    template: '%s | Maje Concept',
  },
  description:
    'Spécialiste du print et marquage textile en Alsace depuis plus de 15 ans. Sérigraphie, broderie, DTF, flocage — pour entreprises, institutionnels et associations. Devis gratuit.',

  keywords: [
    'marquage textile',
    'impression textile Alsace',
    'sérigraphie Colmar',
    'broderie personnalisée',
    'DTF flocage',
    'vêtements professionnels',
    'print textile Alsace',
  ],

  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Maje Concept',
    title: 'Maje Concept — Impression & Marquage Textile Premium',
    description:
      'Votre spécialiste du marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage pour entreprises et associations.',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',   // resolved to absolute via metadataBase
        width: 1200,
        height: 630,
        alt: 'Maje Concept — Print & Marquage Textile Premium en Alsace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Maje Concept — Impression & Marquage Textile Premium',
    description:
      'Spécialiste du marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage.',
    images: ['/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: '/',
  },
}
```

**Key rules:**
- `metadataBase` is mandatory when using relative URLs in `openGraph.images` and `twitter.images` — without it, Next.js throws a build error
- Set via `NEXT_PUBLIC_SITE_URL` env var so staging and production differ
- `title.template` has no effect on `layout.tsx` itself (only applies to child route segments) — but `title.default` sets the root title

### Pattern 2: adjustFontFallback on next/font/local

The current `layout.tsx` uses `next/font/local` without `adjustFontFallback`. Adding it tells Next.js to compute a `size-adjust` CSS override for the fallback system font, eliminating FOUT-induced CLS.

```typescript
// Source: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
// In app/layout.tsx — modify existing localFont call
const sohneBreit = localFont({
  src: [
    {
      path: '../../public/fonts/TestSohneBreit-Buch.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TestSohneBreit-Dreiviertelfett.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sohne-breit',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial', // <-- ADD THIS
  // 'Arial' for sans-serif fonts, 'Times New Roman' for serif
})
```

**How it works:** Next.js measures the actual font metrics from the OTF files at build time and generates a `@font-face` rule for the fallback font with `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` properties. The fallback renders at the same visual size as Sohne Breit, so when the swap occurs there is zero reflow. CLS from font loading drops to ~0.

### Pattern 3: Schema.org JSON-LD in layout.tsx (Server Component)

```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// In app/layout.tsx — add inside <html> body, after providers

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  name: 'Maje Concept',
  description:
    'Spécialiste du print et marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage pour entreprises et associations.',
  url: 'https://www.maje-concept.fr',
  logo: 'https://www.maje-concept.fr/logo.svg',
  image: 'https://www.maje-concept.fr/og-image.jpg',
  telephone: '+33 3 89 XX XX XX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '10 Rue du Maréchal Foch',
    addressLocality: 'Colmar',
    postalCode: '68000',
    addressRegion: 'Alsace',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.0793,
    longitude: 7.3585,
  },
  areaServed: {
    '@type': 'State',
    name: 'Alsace',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de marquage textile',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sérigraphie' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Broderie' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DTF' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flocage' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transfert' } },
    ],
  },
  sameAs: [
    'https://www.linkedin.com/company/maje-concept',
    'https://www.instagram.com/majececoncept',
  ],
}

// In layout.tsx JSX (inside <body>, before providers or directly in <html>):
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

**Critical rules:**
- Use a plain `<script>` tag — NOT `<Script>` from `next/script`. JSON-LD is structured data, not executable JavaScript. `next/script` is for third-party JS loading strategies.
- The `.replace(/</g, '\\u003c')` XSS sanitization is the official Next.js recommendation.
- Place it in `layout.tsx` (not `page.tsx`) so it applies globally and is part of the SSR output.
- `@type: ['LocalBusiness', 'ProfessionalService']` — array syntax is valid Schema.org for multiple types.

### Pattern 4: app/sitemap.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// File: src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maje-concept.fr'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

**Notes:**
- This single-entry sitemap is correct for a single-page site. All sections are anchors within `/`, not separate routes.
- Next.js automatically serves it at `/sitemap.xml` — no next.config.ts rewrites needed.
- The `changeFrequency` and `priority` fields are advisory hints to crawlers, not enforced.

### Pattern 5: app/robots.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// File: src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maje-concept.fr'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

**Notes:**
- `/api/` is disallowed — contact endpoint and any future API routes should not be indexed.
- Next.js serves this at `/robots.txt` automatically.

### Pattern 6: next/image — Hero LCP and Section Images

The current HeroSection is text-only (no `<img>` tags). LCP for this site will be a **text LCP element** (the `<h1>` heading). For text LCP, the key optimization is ensuring the font is loaded quickly — handled by `preload: true` on `next/font/local` (already set).

For sections with real images (portfolio cards, testimonial photos when added), the pattern is:

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image'

// Above-fold hero image (if one is added) — prevent lazy loading
<Image
  src="/hero-bg.jpg"
  alt="Atelier de marquage textile Maje Concept en Alsace"
  width={1920}
  height={1080}
  priority            // Still valid in Next.js 15.x — deprecated only in Next.js 16
  quality={85}
  sizes="100vw"
  className="object-cover"
/>

// Below-fold portfolio images — default lazy loading (no priority prop)
<Image
  src={project.image}
  alt={`Projet ${project.title} — Maje Concept`}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

**Key CLS prevention rules for images:**
- Always provide `width` and `height` OR use `fill` with a sized parent container — this reserves space before the image loads
- `sizes` prevents the browser from fetching oversized images on mobile
- `priority` on the single true LCP candidate only — over-preloading adds 400–1200ms of delay

### Pattern 7: CLS Sources Audit Checklist

CLS below 0.1 requires eliminating all layout shifts. Sources to audit in this codebase:

| Source | Risk | Fix |
|--------|------|-----|
| Font FOUT (Sohne Breit swap) | HIGH | `adjustFontFallback: 'Arial'` in next/font/local |
| Images without dimensions | MEDIUM | All `next/image` must have width+height or fill |
| Dynamic content injection | LOW | No dynamic content loads after initial render in this site |
| GSAP animations | NONE | GSAP does not cause CLS — it animates elements, not layout |
| Preloader unmount | LOW | Preloader uses `position: fixed` + opacity fade — verify no reflow on unmount |

### Pattern 8: Dynamic Imports for Code Splitting (ANIM-04)

The current `page.tsx` imports all 7 sections eagerly. The three heaviest sections (GSAP-intensive) should be lazy-loaded so their JavaScript is deferred until visible.

```typescript
// Source: https://nextjs.org/docs/app/guides/lazy-loading
// In src/app/page.tsx — replace static imports with dynamic imports for heavy sections

import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/HeroSection'  // Keep eager — above fold

// Below-fold sections with heavy GSAP code — lazy load
const PortfolioSection = dynamic(
  () => import('@/components/sections/PortfolioSection').then(m => ({ default: m.PortfolioSection })),
  { ssr: true }   // SSR true = HTML is server-rendered, JS is deferred
)

const ExpertiseSection = dynamic(
  () => import('@/components/sections/ExpertiseSection').then(m => ({ default: m.ExpertiseSection })),
  { ssr: true }
)

const SocialProofSection = dynamic(
  () => import('@/components/sections/SocialProofSection').then(m => ({ default: m.SocialProofSection })),
  { ssr: true }
)

const ConfiguratorSection = dynamic(
  () => import('@/components/sections/ConfiguratorSection').then(m => ({ default: m.ConfiguratorSection })),
  { ssr: true }
)
```

**Rules:**
- Use `ssr: true` (default) for sections that have visible HTML content — this keeps the HTML in the SSR output for SEO, but defers the JavaScript bundle. This is the correct approach for content sections.
- Use `ssr: false` only for pure client-side interactivity with no SEO-relevant content (e.g., a canvas element).
- HeroSection stays eager — it's above the fold and part of LCP.
- ContactSection and Footer can stay eager — they're small and the footer is semantically important.

### Pattern 9: GSAP matchMedia for Mobile + Reduced Motion (RESP-02)

```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
// Pattern for any component using @gsap/react useGSAP hook

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

useGSAP(() => {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: '(min-width: 769px)',
      isMobile: '(max-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions!

      // Heavy parallax and stagger animations — desktop only, skip on reduced motion
      if (isDesktop && !reduceMotion) {
        gsap.fromTo(
          '.hero-title .word',
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 1.2, ease: 'power3.out' }
        )
      } else {
        // Simplified: instant reveal, no stagger
        gsap.set('.hero-title .word', { y: 0, opacity: 1 })
      }

      if (isMobile) {
        // Disable parallax on mobile — kills performance
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.pin) st.kill()  // Kill pinned ScrollTriggers on mobile
        })
      }

      return () => mm.revert()  // Cleanup on unmount
    }
  )
}, [isReady])
```

**Key rules:**
- `gsap.matchMedia()` is responsive — it re-runs the function when window size crosses the breakpoint
- The cleanup `return () => mm.revert()` is critical — without it, re-renders accumulate duplicate animations
- This should be applied in: HeroSection (SplitText stagger), PortfolioSection (Flip), ExpertiseSection (counters + scroll parallax)
- The cursor already handles `pointer: coarse` in JS — add the CSS complement for instant hide before JS loads:

```css
/* In globals.css — add after existing cursor rules */
@media (pointer: coarse) {
  .cursor-dot,
  .cursor-ring,
  .cursor-follower,
  .cursor-spotlight {
    display: none !important;
  }

  * {
    cursor: auto !important;
  }
}
```

### Pattern 10: Semantic HTML Audit (SEO-04)

The existing sections use HTML5 semantic elements. The audit task is to verify:

```
h1: Must appear exactly once per page — verify HeroSection has <h1> and no other section uses <h1>
h2: Each section title should be <h2> (Portfolio, Expertises, Preuves Sociales, etc.)
h3: Card titles, testimonial names, expertise items
alt: All next/image components must have descriptive alt text (not empty string "")
aria-label: Existing inline SVG social icons already have aria-label — verify
<section>: Each major section should use <section id="..."> not <div>
<article>: Portfolio cards and testimonials should use <article>
<address>: Footer already uses <address> for physical address — verify it's in the footer
<nav>: Navigation already uses <nav> — verify aria-label="Navigation principale"
```

The audit is a code review task, not a library integration. Each section file needs one pass.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Head meta tags | Custom `<head>` manipulation | `export const metadata` in layout.tsx | Next.js deduplicates, merges, and injects correctly. Manual head manipulation causes duplicates and hydration issues. |
| Sitemap generation | Express endpoint or static file | `app/sitemap.ts` with `MetadataRoute` | Built-in caching, automatic serving at `/sitemap.xml`, TypeScript types |
| robots.txt | Static `/public/robots.txt` file | `app/robots.ts` with `MetadataRoute` | Programmatic, TypeScript-typed, automatically served. Note: a static file in `/public/robots.txt` would also work but the Route Handler is more maintainable |
| Font CLS fix | Manual `@font-face` size-adjust CSS | `adjustFontFallback` in `next/font/local` | Next.js measures actual font metrics at build time — manual `@font-face` requires manual measurement |
| Reduced motion | Custom `window.matchMedia` in useEffect | `gsap.matchMedia()` | Built-in GSAP API, responds to system preference changes live, integrates with `useGSAP` cleanup |
| OG image | HTML→PNG via Puppeteer | Static `/public/og-image.jpg` (or `@vercel/og` Satori) | Puppeteer requires headless Chrome; Satori is pure Node and built into Next.js via `ImageResponse` |

**Key insight:** Every SEO surface (metadata, structured data, sitemap, robots) has a first-class Next.js App Router API. Custom solutions for any of these add complexity without benefit.

---

## Common Pitfalls

### Pitfall 1: `metadataBase` Missing — Build Error on Relative OG Images
**What goes wrong:** `openGraph.images: ['/og-image.jpg']` throws `Error: metadata.metadataBase is not set` at build time when the value is a relative path.
**Why it happens:** Next.js cannot resolve a relative path to an absolute URL without knowing the domain.
**How to avoid:** Always set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fallback.com')` in root `layout.tsx`.
**Warning signs:** Build error mentioning "metadataBase" or OG images showing as relative paths in `<head>`.

### Pitfall 2: `next/script` for JSON-LD — Wrong Tool
**What goes wrong:** Using `<Script type="application/ld+json" ...>` from `next/script` causes hydration warnings and may not appear in the SSR `<head>`.
**Why it happens:** `next/script` is designed for third-party executable JavaScript (Google Analytics, etc.) — it adds loading strategies and deferred execution. JSON-LD is data, not code.
**How to avoid:** Use a native `<script type="application/ld+json" dangerouslySetInnerHTML={...} />` in a Server Component layout or page.
**Warning signs:** Hydration mismatch warnings in console; JSON-LD appears in JS bundle instead of HTML.

### Pitfall 3: `priority` on Multiple Images — LCP Regression
**What goes wrong:** Adding `priority` to hero image AND portfolio thumbnails causes the browser to preload 5–10 images simultaneously, delaying the true LCP.
**Why it happens:** Each `priority` image inserts a `<link rel="preload">` — parallel preloading saturates bandwidth.
**How to avoid:** One `priority` prop maximum per page. The hero image (or `<h1>` for text LCP) is the only candidate.
**Warning signs:** LCP score worsens after adding `priority` to multiple images.

### Pitfall 4: Dynamic Import Named Exports — `.then(m => ({ default: m.ComponentName }))` Required
**What goes wrong:** `dynamic(() => import('@/components/sections/PortfolioSection'))` fails if the export is named (`export function PortfolioSection`) rather than default.
**Why it happens:** `next/dynamic` expects a default export. Named exports need the `.then()` wrapper.
**How to avoid:** Always use the `.then(m => ({ default: m.ExportName }))` pattern for named exports.
**Warning signs:** `TypeError: Element type is invalid` at runtime.

### Pitfall 5: gsap.matchMedia() Without Cleanup — Memory Leak
**What goes wrong:** `gsap.matchMedia()` accumulates on every re-render because the `mm` object is created inside `useGSAP` without returning the revert function.
**Why it happens:** React StrictMode double-mounts components, creating two `matchMedia` instances that both run animations.
**How to avoid:** Always `return () => mm.revert()` inside the `mm.add()` callback. The `useGSAP` hook from `@gsap/react` handles outer cleanup; the inner `mm.revert()` handles matchMedia cleanup.
**Warning signs:** Duplicate animations on desktop after a hot reload; animations playing twice.

### Pitfall 6: SSR `false` on Content Sections — SEO Blackout
**What goes wrong:** Using `{ ssr: false }` on PortfolioSection makes the section invisible to search engine crawlers that don't execute JavaScript.
**Why it happens:** `ssr: false` means no server-rendered HTML — the component renders only in the browser.
**How to avoid:** Use `{ ssr: true }` (the default) for all content sections. `ssr: false` is only appropriate for components with no SEO value (canvas, WebGL, browser-only APIs).
**Warning signs:** Section content absent from `curl https://yoursite.com | grep "portfolio"` output.

### Pitfall 7: Font CLS — `adjustFontFallback` Not Set on next/font/local
**What goes wrong:** Text reflows when Sohne Breit loads because the fallback system font (Arial or sans-serif) has different character widths.
**Why it happens:** Without `adjustFontFallback`, Next.js uses an unoptimized fallback with mismatched metrics.
**How to avoid:** Add `adjustFontFallback: 'Arial'` to the `localFont()` call. This is a build-time optimization — no runtime cost.
**Warning signs:** CLS score > 0.1 in Lighthouse; visible text reflow on page load before font loads.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<Head>` from `next/head` (Pages Router) | `export const metadata` (App Router) | Next.js 13 | Metadata is Server Component, not client-injected |
| `next-seo` package | Built-in Metadata API | Next.js 13+ | No third-party package needed |
| `next/script` for JSON-LD | Native `<script>` tag in Server Component | Next.js 13+ | Official recommendation as of 2026 |
| `priority` prop on next/image | `preload` prop (clearer semantics) | Next.js 16 | `priority` still valid in v15 — no action needed now |
| Manual `@font-face size-adjust` | `adjustFontFallback` in next/font | Next.js 13.2 | Automatic font metric calculation |
| Static `/public/robots.txt` | `app/robots.ts` Route Handler | Next.js 13.3 | TypeScript-typed, programmatic |
| `framer-motion` package | `motion` package | 2025 | Same API, different package name — project already uses `motion` |

**Deprecated/outdated in this project:**
- Nothing deprecated — the project already uses current patterns. The main gaps are additions, not replacements.

---

## Open Questions

1. **Production domain for metadataBase**
   - What we know: `metadataBase` requires a fully-qualified URL; we're using `NEXT_PUBLIC_SITE_URL` env var
   - What's unclear: The actual production domain (maje-concept.fr? maje-concept.com?) — the Footer shows "Maje Concept" branding but no domain
   - Recommendation: Use `https://www.maje-concept.fr` as the fallback in code; update via env var before deployment

2. **OG image design**
   - What we know: Social cards need a 1200x630 JPEG for Facebook/LinkedIn/Twitter preview
   - What's unclear: Whether to create a static design or use `@vercel/og` dynamic generation
   - Recommendation: Start with a static image — it's simpler, no additional API route needed, and the site has no dynamic pages that would benefit from per-page OG images

3. **Real contact details**
   - What we know: Footer uses `+33 3 89 XX XX XX` placeholder phone; JSON-LD schema should have real phone
   - What's unclear: Whether real contact details exist or remain placeholders for v1
   - Recommendation: Use the placeholder in JSON-LD for now; document in the plan that a real phone number must be substituted before production deploy

4. **HeroSection LCP element**
   - What we know: HeroSection is text-only (CSS background, no `<img>`). The LCP will be the `<h1>` text.
   - What's unclear: Whether the LCP threshold (< 2.5s) can be met with text-only LCP given the preloader (which delays rendering by up to 3s)
   - Recommendation: Audit whether the Preloader blocks LCP. If the preloader hides the `<h1>` for > 2.5s, it will cause LCP failure. The fix is to make the preloader use `visibility: hidden` or `opacity: 0` rather than `display: none` — visible in DOM, invisible to user. This is an important CWV consideration specific to this site's architecture.

---

## Environment Availability

No external dependencies — all Phase 4 work is code changes to an existing Next.js project. Node.js and npm are confirmed available (project builds and runs). No new services, databases, or CLIs required.

Step 2.6: SKIPPED (no external dependencies — all changes are code/config within the existing Next.js project).

---

## Validation Architecture

No automated test framework is configured for this project. All Phase 4 validation is manual:

| Requirement | Validation Method | Tool |
|-------------|-------------------|------|
| SEO-01: Metadata | `view-source:https://...` or DevTools → `<head>` | Browser DevTools |
| SEO-02: JSON-LD | Google Rich Results Test | https://search.google.com/test/rich-results |
| SEO-03: Sitemap + robots | Navigate to `/sitemap.xml` and `/robots.txt` | Browser |
| SEO-04: Semantic HTML | Axe DevTools accessibility scan | Chrome Extension |
| SEO-05: Core Web Vitals | Lighthouse (Performance tab) | Chrome DevTools |
| ANIM-03: Image optimization | Lighthouse → Opportunities → "Use lazy loading" | Chrome DevTools |
| ANIM-04: Code splitting | Network tab → JS bundles on initial load | Chrome DevTools |
| RESP-01: Responsive | Device toolbar at 320px, 768px, 1280px | Chrome DevTools |
| RESP-02: Reduced motion | Chrome → Rendering → prefers-reduced-motion: reduce | Chrome DevTools Rendering panel |

**Quick validation command after each task:**
```bash
npm run build && npm run start
# Then open http://localhost:3000 and run Lighthouse
```

**Phase gate:** Lighthouse score ≥ 90 on Performance, LCP < 2.5s, CLS < 0.1 before Phase 4 is considered complete.

---

## Sources

### Primary (HIGH confidence — official Next.js documentation)
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — complete Metadata type, all fields including openGraph and twitter
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) — official recommendation for `<script>` tag vs `next/script`
- [Next.js sitemap.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — MetadataRoute.Sitemap type and example
- [Next.js robots.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — MetadataRoute.Robots type and example
- [Next.js Image component docs](https://nextjs.org/docs/app/api-reference/components/image) — priority, preload, sizes props; confirmed `priority` deprecated in v16 only
- [GSAP matchMedia() docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) — conditions object API, reduceMotion pattern

### Secondary (MEDIUM confidence — corroborated with official sources)
- [Chrome Developers — Framework tools for font fallbacks](https://developer.chrome.com/blog/framework-tools-font-fallback) — explains adjustFontFallback mechanism
- [Vercel blog — next/font deep dive](https://vercel.com/blog/nextjs-next-font) — adjustFontFallback for local fonts

### Tertiary (LOW confidence — single source, for context only)
- Various community articles on Core Web Vitals 2026 — aligned with known CWV thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js 15.5.14 already installed; all SEO APIs are built-in
- Architecture patterns: HIGH — verified against official Next.js docs (v16.2.1, last updated 2026-03-25)
- JSON-LD patterns: HIGH — official Next.js guide explicitly states `<script>` over `next/script`
- GSAP matchMedia: HIGH — verified from GSAP v3 official docs
- Font CLS fix: HIGH — `adjustFontFallback` is the documented Next.js mechanism
- Pitfalls: HIGH — all derived from official docs or confirmed behaviors

**Research date:** 2026-03-28
**Valid until:** 2026-06-28 (90 days — stable Next.js APIs change infrequently)

**Important version note:** The Next.js docs served (v16.2.1) show `priority` as deprecated on `next/image`. However, the installed project version is **Next.js 15.5.14**, where `priority` is still the correct prop. Do NOT use `preload` prop — it was introduced in Next.js 16. Use `priority` throughout Phase 4.
