---
phase: 04-seo
plan: 02
subsystem: ui
tags: [gsap, matchmedia, next-dynamic, code-splitting, responsive, performance, css, animations]

requires:
  - phase: 04-01
    provides: "layout.tsx metadata, adjustFontFallback CLS fix, sitemap.ts, robots.ts — build baseline"
  - phase: 02-sections
    provides: "HeroSection SplitText/parallax, PortfolioSection Flip filters, ExpertiseSection ScrollTrigger counters"

provides:
  - "@media (pointer: coarse) CSS guard hiding cursor elements before JS loads"
  - "next/dynamic(ssr:true) for PortfolioSection, ExpertiseSection, SocialProofSection, ConfiguratorSection"
  - "gsap.matchMedia() guards in HeroSection, PortfolioSection, ExpertiseSection — desktop-only heavy animations"
  - "Instant gsap.set() reveal in else branch for mobile/prefers-reduced-motion"
  - "Responsive padding and clamp() floor fixes for 320px viewports"
  - "Production build: 289KB First Load JS, zero TypeScript errors, static SSG confirmed"

affects: [production-deploy, lighthouse-audit, mobile-ux]

tech-stack:
  added: ["next/dynamic (Next.js built-in — no new package)"]
  patterns:
    - "gsap.matchMedia() with isDesktop(min-width:769px) && !reduceMotion conditions for all GSAP sections"
    - "isDesktopRef to synchronize matchMedia state with handleFilter() callback in PortfolioSection"
    - "@media (pointer: coarse) CSS-first cursor hide — no JS dependency for touch device UX"
    - "next/dynamic(ssr:true) code splitting — HTML preserved for SEO, JS bundle deferred"

key-files:
  created: []
  modified:
    - "src/app/globals.css"
    - "src/app/page.tsx"
    - "src/components/sections/HeroSection.tsx"
    - "src/components/sections/PortfolioSection.tsx"
    - "src/components/sections/ExpertiseSection.tsx"

key-decisions:
  - "isDesktopRef.current used in PortfolioSection handleFilter() to gate Flip animation outside useGSAP scope — avoids stale closure"
  - "HeroSection: both mousemove listener and ScrollTrigger cleanup moved inside matchMedia callback — only registered on desktop"
  - "ExpertiseSection: AnimatedCounter kept active on all devices (count-up is lightweight); only ScrollTrigger entrance animations gated"
  - "clamp() floor reduced from 3.5rem to 2rem for h1/h2 — ensures readability at 320px without overflow"
  - "sm: padding prefix added to main content container — px-4 on mobile, px-8 sm+, px-16 lg+"

patterns-established:
  - "matchMedia pattern: always declare mm inside useGSAP, return () => mm.revert() inside callback — correct GSAP cleanup"
  - "Ref bridge pattern: useRef<boolean> synchronized from matchMedia context.conditions to make media state accessible in event handlers"

requirements-completed: [SEO-04, SEO-05, ANIM-03, ANIM-04, RESP-01, RESP-02]

duration: 12min
completed: 2026-03-28
---

# Phase 4 Plan 02: Performance & Responsive Optimization Summary

**gsap.matchMedia() desktop-only animation guards + next/dynamic code splitting + CSS touch cursor hide — production build 289KB, zero errors**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-28T20:20:00Z
- **Completed:** 2026-03-28T20:32:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added `@media (pointer: coarse)` block to globals.css hiding all 4 cursor elements before JS loads — eliminates cursor flash on touch devices
- Converted 4 heavy sections (Portfolio, Expertise, SocialProof, Configurator) to `next/dynamic(ssr:true)` — HTML SSR preserved for SEO, JS bundle split
- Wrapped all GSAP animations in `gsap.matchMedia()` with `isDesktop(min-width:769px) && !reduceMotion` — heavy SplitText stagger, parallax, Flip filters, ScrollTrigger entrance disabled on mobile and prefers-reduced-motion; instant `gsap.set()` reveal in else branch
- Responsive audit: reduced clamp() floors from 3.5rem to 2rem for headings, added `sm:` padding prefix to section containers for 320px compatibility
- Final build: 289KB First Load JS, zero TypeScript errors, static SSG (`○`) output confirmed

## Task Commits

1. **Task 1: globals.css cursor guard + page.tsx dynamic imports** - `427918d` (feat)
2. **Task 2: gsap.matchMedia() guards + responsive audit + final build** - `e8a74b7` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/app/globals.css` - Added `@media (pointer: coarse)` block hiding `.cursor-dot`, `.cursor-ring`, `.cursor-follower`, `.cursor-spotlight` + `* { cursor: auto }`
- `src/app/page.tsx` - Replaced 4 static imports with `next/dynamic(ssr:true)` for heavy GSAP sections; HeroSection/ContactSection/Footer kept eager
- `src/components/sections/HeroSection.tsx` - Wrapped SplitText entrance, scroll parallax, mousemove parallax in `gsap.matchMedia()` isDesktop guard; reduced h1 clamp floor; added sm: padding
- `src/components/sections/PortfolioSection.tsx` - Entrance stagger and Flip filter animation gated by matchMedia; `isDesktopRef` bridge for handleFilter() callback; instant filter switch on mobile
- `src/components/sections/ExpertiseSection.tsx` - Header/KPI/expertise-card ScrollTrigger entrance animations gated; instant reveal on mobile; AnimatedCounter kept active (lightweight)

## Decisions Made

- `isDesktopRef.current` (a `useRef<boolean>`) used to bridge matchMedia state into `handleFilter()` which runs outside useGSAP scope — avoids stale closure problem
- HeroSection mousemove listener and ScrollTrigger cleanup both moved inside the matchMedia callback so they're only registered on desktop (correct — no parallax setup needed on mobile)
- `return () => mm.revert()` placed inside the `mm.add()` callback, not as the outer useGSAP cleanup — this is the correct GSAP pattern
- clamp() floor reduced from 3.5rem to 2rem for hero h1 and section h2 — avoids text overflow at 320px

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Responsive] Reduced clamp() floor for h1/h2 and added sm: padding prefixes**
- **Found during:** Task 2 (responsive audit pass)
- **Issue:** `text-[clamp(3.5rem,9vw,8rem)]` creates a minimum font size of 3.5rem (56px) which causes horizontal overflow on 320px viewports
- **Fix:** Reduced floor to `clamp(2.5rem,9vw,8rem)` for HeroSection h1 and `clamp(2rem,6vw,5rem)` for PortfolioSection/ExpertiseSection h2. Added `px-4` base with `sm:px-8 lg:px-16` to section containers
- **Files modified:** HeroSection.tsx, PortfolioSection.tsx, ExpertiseSection.tsx
- **Committed in:** e8a74b7 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 — responsive correctness)
**Impact on plan:** Required for RESP-01 compliance at 320px. No scope creep.

## Issues Encountered

None — both tasks executed cleanly on first attempt. Build passed with zero TypeScript errors both after Task 1 and the final Task 2 build.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Phase 4 (SEO & Performance) is now complete:
- SEO metadata (Plan 01): layout.tsx with full OpenGraph, Twitter cards, JSON-LD LocalBusiness, adjustFontFallback, sitemap.ts, robots.ts
- Performance (Plan 02): code splitting via dynamic imports, CSS cursor guard, matchMedia animation gating
- Build: `npm run build` passes cleanly, static SSG output, 289KB First Load JS
- No blockers for production deployment

RESEND_API_KEY must be configured in `.env.local` before email functionality works at runtime (noted in STATE.md since Phase 3).

---
*Phase: 04-seo*
*Completed: 2026-03-28*
