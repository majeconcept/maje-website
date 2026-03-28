---
phase: 02-sections
plan: 01
subsystem: hero
tags: [gsap, splittext, parallax, magnetic-button, animation, hero, scroll-trigger]

# Dependency graph
requires:
  - phase: 01-03
    provides: "useAnimation().isReady gate, AnimationProvider, MagneticButton, CursorProvider"
  - phase: 01-01
    provides: "globals.css brand tokens, cn() utility"
provides:
  - HeroSection: fullscreen hero with SplitText line reveal, scroll+mouse parallax, MagneticButton CTAs
  - HERO_CONTENT: typed hero data (eyebrow, titleLines, subtitle, CTAs, badge)
  - scrollIndicator keyframe in globals.css
affects:
  - page.tsx (HeroSection replaces placeholder)
  - All Phase 2 sections (establishes data-depth parallax pattern and isReady gate pattern)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "isReady gate: first line of useGSAP() is `if (!isReady) return` — prevents race with preloader"
    - "SplitText.create() new API with mask:lines + autoSplit:true + onSplit callback"
    - "SplitText.revert() called in onComplete to avoid layout accumulation on resize"
    - "Scroll parallax: gsap.to(layer, {y}) with ScrollTrigger scrub — uses `y` pixel property"
    - "Mouse parallax: gsap.quickTo(layer, 'xPercent'/'yPercent') — uses percent to avoid y conflict with scroll"
    - "Three parallax depths: 0.1 (bg texture), 0.3 (geometric accents), 0.5 (main content)"
    - "MagneticButton handles cursor variant internally — no external setVariant() needed in HeroSection"
    - "ScrollTrigger cleanup in useGSAP return: kill triggers where trigger === sectionRef.current"

key-files:
  created:
    - src/components/sections/HeroSection.tsx
    - src/data/hero.ts
  modified:
    - src/app/page.tsx
    - src/app/globals.css

key-decisions:
  - "Mouse parallax uses xPercent/yPercent instead of x/y pixels to avoid conflict with scroll parallax y property — prevents jitter when both ScrollTrigger scrub and quickTo write to same transform channel"
  - "MagneticButton cursor variant handled internally by component — HeroSection does not call setVariant() manually to avoid double-setting"
  - "SplitText.revert() called in onComplete (not in useGSAP cleanup) — text is only split during entrance animation, reverted immediately after to keep DOM clean for resize"

requirements-completed: [HERO-01, HERO-02, HERO-03, HERO-04, ANIM-02]

# Metrics
duration: 10min
completed: 2026-03-28
---

# Phase 2 Plan 01: HeroSection Summary

**GSAP SplitText line-by-line reveal + 3-layer parallax (scroll ScrollTrigger + mouse quickTo) with MagneticButton CTAs on brand-black fullscreen hero**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-03-28T16:14:00Z
- **Tasks:** 2/2
- **Files modified:** 4 (2 created, 2 updated)

## Accomplishments

- **`src/data/hero.ts`:** Typed `HERO_CONTENT` constant with eyebrow, titleLines array (3 lines), subtitle, ctaPrimary/ctaSecondary with hrefs, and badge. Exported as `as const` for full TypeScript inference.

- **`src/components/sections/HeroSection.tsx`:** Fullscreen hero section (`id="hero"`, `min-h-screen`, `bg-brand-black`). Entrance timeline via `useGSAP()` gated on `isReady`: badge (0.6s) → eyebrow (0.7s) → SplitText lines (1.1s stagger 0.1) → subtitle+CTAs (0.9s stagger 0.08). SplitText.create() with `mask:"lines"` and `autoSplit:true` for clean clip reveal. Three `data-depth` parallax layers (0.1 background texture, 0.3 geometric gold accents, 0.5 main content). Scroll parallax via ScrollTrigger scrub on `y`. Mouse parallax via `gsap.quickTo` on `xPercent`/`yPercent` (separate properties to avoid scroll conflict). Two `MagneticButton` CTAs: "Nos Réalisations" and "Nous Contacter". Animated scroll indicator.

- **`src/app/page.tsx`:** Hero placeholder replaced with `<HeroSection />`. All section IDs (#realisations, #expertises, #configurateur, #contact) preserved as placeholder divs — Navigation IntersectionObserver tracking uninterrupted.

- **`src/app/globals.css`:** `@keyframes scrollIndicator` added for the scroll indicator bar animation.

## Task Commits

1. **Task 1: src/data/hero.ts + HeroSection.tsx** — `9b5ec06` (feat)
2. **Task 2: page.tsx integration** — `13b0319` (feat)

## Success Criteria — All 6 Pass

1. `npm run build` passes without error — CONFIRMED (`Compiled successfully`)
2. `if (!isReady) return` as first check in useGSAP — CONFIRMED (line 23)
3. `SplitText.create()` with `mask:"lines"` and `autoSplit:true` — CONFIRMED (lines 46-58)
4. Three parallax layers data-depth 0.1 / 0.3 / 0.5 — CONFIRMED (lines 132, 153, 173)
5. Two MagneticButton CTAs "Nos Réalisations" and "Nous Contacter" — CONFIRMED
6. page.tsx renders HeroSection + all section IDs preserved — CONFIRMED

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Mouse parallax uses xPercent/yPercent instead of x/y**
- **Found during:** Task 1 implementation
- **Issue:** Plan had mouse quickTo on `"x"` and `"y"` properties. ScrollTrigger scrub also writes to `y`. When both animate the same property each tick, the last writer wins causing jitter — scroll position would be partially overridden by mouse parallax on every RAF tick.
- **Fix:** Mouse quickTo targets `"xPercent"` and `"yPercent"` instead of pixel `"x"`/`"y"`. These are separate GSAP transform properties, so scroll and mouse parallax compose cleanly. Mouse offset values scaled to percent units (4% × depth for X, 2% × depth for Y — visually equivalent to the plan's pixel values at 1920px width).
- **Files modified:** `src/components/sections/HeroSection.tsx`
- **Commit:** `9b5ec06`

**2. [Rule 1 - Bug] Removed redundant cursor setVariant() calls from HeroSection**
- **Found during:** Task 1 implementation
- **Issue:** Plan's code passed `onMouseEnter={() => setVariant("hover")}` and `onMouseLeave={() => setVariant("default")}` to MagneticButton. Actual MagneticButton implementation already calls `setVariant(cursorVariant)` internally (line 67 in MagneticButton.tsx) and `setVariant("default")` on leave (line 72). Passing these props would fail TypeScript (MagneticButton interface doesn't accept these) and would double-set the variant.
- **Fix:** Removed `useCursor()` import from HeroSection. MagneticButton handles cursor variant entirely — this is the correct usage per its interface contract.
- **Files modified:** `src/components/sections/HeroSection.tsx`
- **Commit:** `9b5ec06`

## Known Stubs

None — HeroSection is fully functional with real content from HERO_CONTENT.

---
*Phase: 02-sections*
*Completed: 2026-03-28*
