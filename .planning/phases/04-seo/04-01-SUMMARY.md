---
phase: 04-seo
plan: 01
subsystem: seo
tags: [next.js, metadata-api, json-ld, schema.org, sitemap, robots, next/font, cls]

# Dependency graph
requires:
  - phase: 03-conversion
    provides: final layout.tsx structure with LenisProvider/CursorProvider/AnimationProvider providers
provides:
  - Full Next.js Metadata API export with metadataBase, title template, OG tags, Twitter cards
  - LocalBusiness+ProfessionalService JSON-LD schema via native script tag
  - /sitemap.xml route via app/sitemap.ts (MetadataRoute.Sitemap)
  - /robots.txt route via app/robots.ts (MetadataRoute.Robots, /api/ disallowed)
  - CLS fix for Sohne Breit font via adjustFontFallback: 'Arial'
affects: [seo-audit, rich-results, google-search-console]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON-LD via native <script type='application/ld+json'> (NOT next/script) in Server Component body"
    - "metadataBase with process.env.NEXT_PUBLIC_SITE_URL ?? hardcoded fallback"
    - "adjustFontFallback: 'Arial' on next/font/local sans-serif declarations"
    - "MetadataRoute.Sitemap and MetadataRoute.Robots in app/ directory for auto-generated routes"

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified:
    - src/app/layout.tsx

key-decisions:
  - "Native <script> tag used for JSON-LD, not next/script — next/script is for executable JS, structured data must be inline in SSR HTML"
  - "adjustFontFallback: 'Arial' added to sohneBreit — Arial is the correct sans-serif system fallback for CLS prevention"
  - "/api/ disallowed in robots.ts — contact form route handler should not be indexed"
  - "telephone placeholder used (+33 3 89 XX XX XX) — real number unknown, must be updated before launch"

patterns-established:
  - "JSON-LD pattern: const jsonLd defined module-level, dangerouslySetInnerHTML with .replace(/</g, '\\u003c') XSS guard"
  - "metadataBase pattern: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maje-concept.fr' for environment-aware URLs"

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-05]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 4 Plan 01: SEO Technical Infrastructure Summary

**Next.js Metadata API with OG/Twitter cards, LocalBusiness+ProfessionalService JSON-LD, auto-generated sitemap.xml + robots.txt, and Sohne Breit CLS fix via adjustFontFallback**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-28T00:00:00Z
- **Completed:** 2026-03-28T00:08:00Z
- **Tasks:** 2
- **Files modified:** 3 (1 modified, 2 created)

## Accomplishments

- Full metadata export with metadataBase, title template, description, 7 keywords, OG and Twitter cards — all resolving correctly from the `https://maje-concept.fr` base
- LocalBusiness+ProfessionalService JSON-LD injected inline in SSR HTML via native `<script>` tag with XSS guard, before the LenisProvider (provider order preserved)
- `/sitemap.xml` and `/robots.txt` served as static routes by Next.js, with `/api/` disallowed and sitemap pointer correct
- `adjustFontFallback: 'Arial'` added to sohneBreit font declaration — Next.js generates `size-adjust` CSS to eliminate FOUT-driven CLS

## Task Commits

Each task was committed atomically:

1. **Tasks 1 + 2: layout.tsx + sitemap.ts + robots.ts** - `8b69673` (feat)

## Files Created/Modified

- `src/app/layout.tsx` — adjustFontFallback added, full metadata export replacing minimal stub, jsonLd const + native script tag inserted before LenisProvider
- `src/app/sitemap.ts` — MetadataRoute.Sitemap returning single homepage entry (single-page site)
- `src/app/robots.ts` — MetadataRoute.Robots allowing all crawlers, disallowing /api/, pointing sitemap

## Decisions Made

- Used native `<script type="application/ld+json">` instead of `next/script` — `next/script` is for executable JavaScript with loading strategies; structured data must be present in the initial SSR HTML
- `adjustFontFallback: 'Arial'` — Arial is the correct system sans-serif fallback for Sohne Breit (geometric sans). Next.js generates `size-adjust`, `ascent-override`, `descent-override` CSS to match metrics
- Telephone field uses placeholder `+33 3 89 XX XX XX` — real number was not provided in project context, must be updated before production launch
- Combined `@type: ['LocalBusiness', 'ProfessionalService']` — both schema types apply to a B2B print/textile studio

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- **JSON-LD telephone:** `src/app/layout.tsx` line ~112 — `"+33 3 89 XX XX XX"` placeholder. Must be replaced with real phone number before launch. Impacts Rich Results Test and Google Business Profile matching.

## Issues Encountered

None — build passed cleanly on first attempt (8/8 static pages generated, TypeScript lint clean).

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- SEO-01, SEO-02, SEO-03, SEO-05 are complete
- SEO-04 (HTML sémantique strict — h1 unique, heading hierarchy, descriptive alt text) is deferred to Plan 02 per the plan's success criteria
- `/og-image.jpg` (1200x630) does not exist in `/public` — OG image tags reference it but no image is present. Before launch, either create a static placeholder or implement `@vercel/og` dynamic generation
- Real telephone number must be substituted in JSON-LD before Rich Results Test validation

---
*Phase: 04-seo*
*Completed: 2026-03-28*
