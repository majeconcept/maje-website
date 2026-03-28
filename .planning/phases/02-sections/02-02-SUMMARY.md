---
phase: 02-sections
plan: 02
subsystem: portfolio
tags: [gsap, flip, portfolio, lightbox, masonry, motion, scroll-trigger, cursor]

# Dependency graph
requires:
  - phase: 01-03
    provides: "useAnimation().isReady gate, AnimationProvider, CursorProvider, useCursor()"
  - phase: 02-01
    provides: "isReady gate pattern, data-cursor pattern, scrollTrigger entrance pattern"
provides:
  - PortfolioSection: 12-col masonry grid, GSAP Flip category filters, hover overlay, lightbox
  - PORTFOLIO_PROJECTS: 8 typed Maje Concept projects with oklch gradient placeholders
  - PORTFOLIO_CATEGORIES: filter list ["Tous", "Sérigraphie", "Broderie", "DTF", "Flocage", "Transfert"]
  - Lightbox: AnimatePresence modal with keyboard navigation (Escape/←/→)
affects:
  - src/app/page.tsx (PortfolioSection replaces #realisations placeholder)
  - Phase 2 Plan 03 (data-cursor="view" pattern established for portfolio cards)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GSAP Flip filter: Flip.getState(grid.querySelectorAll('[data-flip-id]')) → setActiveFilter(filter) → requestAnimationFrame(() => Flip.from(state, {...}))"
    - "isAnimating.current ref guards handleFilter against concurrent animations"
    - "Lightbox uses AnimatePresence from motion/react — NOT framer-motion"
    - "AnimatePresence wraps the conditional — key='lightbox-overlay' on direct motion.div child"
    - "Lightbox currentIndex stored in parent (PortfolioSection), lightbox index maps to PORTFOLIO_PROJECTS (all, not filtered)"
    - "data-cursor='view' attribute on portfolio cards + setVariant('view') on mouseEnter"
    - "CursorVariant type used — not plain string — setVariant('hover') on filter buttons"
    - "Masonry via CSS Grid grid-cols-12 + auto-rows-[180px] lg:auto-rows-[220px], each card has colSpan/rowSpan Tailwind classes"

key-files:
  created:
    - src/data/portfolio.ts
    - src/components/ui/Lightbox.tsx
    - src/components/sections/PortfolioSection.tsx
  modified:
    - src/app/page.tsx

key-decisions:
  - "Lightbox currentIndex references PORTFOLIO_PROJECTS (full array) not filtered subset — ensures correct project opens regardless of active filter"
  - "Masonry layout uses CSS Grid with per-card colSpan/rowSpan Tailwind classes in data — avoids JavaScript layout calculation, animates cleanly with Flip"
  - "Filter hides cards via className 'hidden' before Flip capture — Flip animates enter/leave elements correctly with absolute:true"

requirements-completed: [PORT-01, PORT-02, PORT-03, PORT-04, ANIM-01, ANIM-02]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 2 Plan 02: PortfolioSection Summary

**Masonry grid portfolio with GSAP Flip category filters, hover overlays, and Motion AnimatePresence lightbox for 8 real Maje Concept projects**

## Performance

- **Duration:** ~2 min
- **Completed:** 2026-03-28T16:18:57Z
- **Tasks:** 2/2
- **Files modified:** 4 (3 created, 1 updated)

## Accomplishments

- **`src/data/portfolio.ts`:** 8 typed `PortfolioProject` objects covering all Maje Concept techniques (Broderie, Sérigraphie, DTF, Flocage, Transfert). Each project has `id`, `title`, `client`, `category`, `description`, `tags`, `color` (oklch gradient), `colSpan` and `rowSpan` Tailwind classes for asymmetric masonry layout. `PORTFOLIO_CATEGORIES` and `PortfolioFilter` exported as `as const` for type safety.

- **`src/components/ui/Lightbox.tsx`:** Modal using `AnimatePresence` from `motion/react` (not framer-motion). `AnimatePresence` wraps the conditional, direct `motion.div` child has `key="lightbox-overlay"` (unique, mandatory). Keyboard navigation: `Escape` closes, `ArrowLeft`/`ArrowRight` navigate with bounds clamping. `useEffect` locks body scroll when open. Backdrop click closes, inner content click stops propagation.

- **`src/components/sections/PortfolioSection.tsx`:** Section `id="realisations"`. CSS Grid 12-col masonry with `auto-rows-[180px] lg:auto-rows-[220px]` — each card spans colSpan/rowSpan from data. GSAP Flip filter: `Flip.getState → setActiveFilter → requestAnimationFrame → Flip.from` — exact mandatory sequence with `absolute:true`, `onEnter`/`onLeave` callbacks, and `isAnimating.current` guard. ScrollTrigger entrance animation gated on `isReady`: header slides up, then `.portfolio-card` stagger. `data-cursor="view"` on each card + `setVariant("view")` on `mouseEnter`. Lightbox receives `currentIndex` mapped to `PORTFOLIO_PROJECTS` index (full array, not filtered).

- **`src/app/page.tsx`:** `PortfolioSection` imported and replaces the `#realisations` placeholder div. `#expertises`, `#configurateur`, `#contact` placeholder divs untouched — Navigation IntersectionObserver tracking uninterrupted.

## Task Commits

1. **Task 1: portfolio.ts + Lightbox.tsx** — `fadafd4` (feat)
2. **Task 2: PortfolioSection.tsx + page.tsx** — `d6e310a` (feat)

## Success Criteria — All 7 Pass

1. `npm run build` passes without error — CONFIRMED (`Compiled successfully`)
2. 8 projects in PORTFOLIO_PROJECTS with correct Maje Concept categories — CONFIRMED
3. GSAP Flip filter pattern exact: `Flip.getState → setActiveFilter → requestAnimationFrame → Flip.from` — CONFIRMED (lines 60, 63, 66-67 PortfolioSection.tsx)
4. `data-cursor="view"` on each card + `setVariant("view")` on hover — CONFIRMED (lines 153, 150)
5. Lightbox uses `motion/react` AnimatePresence with unique `key` on direct child — CONFIRMED (Lightbox.tsx lines 4, 47, 49)
6. Keyboard nav: Escape=close, ArrowLeft/ArrowRight=navigate with bounds — CONFIRMED (Lightbox.tsx lines 22-33)
7. `page.tsx` renders PortfolioSection, `#expertises`, `#configurateur`, `#contact` preserved — CONFIRMED

## Deviations from Plan

None — plan executed exactly as written. The `cn()` import was removed from Lightbox (not needed there) as a minor cleanup but the plan did not mandate it.

## Known Stubs

None — all 8 portfolio projects have real Maje Concept content (client names, descriptions, realistic quantities). Gradient placeholders are intentional (no product photos available) and fully functional as visual elements per the CONTEXT.md design direction.

---
*Phase: 02-sections*
*Completed: 2026-03-28*
