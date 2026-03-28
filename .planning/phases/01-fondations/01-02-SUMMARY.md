---
phase: 01-fondations
plan: 02
subsystem: ui
tags: [lenis, gsap, cursor, magnetic, providers, react, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: "registerGSAPPlugins(), cn() utility, brand tokens, globals.css cursor CSS classes"
provides:
  - LenisProvider with autoRaf: false + GSAP ticker integration (smooth scroll foundation)
  - useLenis() hook for child components to access Lenis instance
  - CursorProvider with CursorVariant type (7 variants) and useCursor() hook
  - CustomCursor: 4-layer cursor (dot + ring + follower + spotlight) via GSAP quickTo only
  - useMagnetic hook: 80px radius magnetic displacement with spring return
  - MagneticButton component: CTA button with magnetic effect + cursor variant integration
  - layout.tsx wired: LenisProvider > CursorProvider > CustomCursor > children
affects:
  - 01-03 (AnimationProvider consumes useLenis, wraps inside CursorProvider)
  - All Phase 2 sections (useCursor setVariant on interactive elements)
  - Phase 3 configurator (crosshair cursor variant already defined)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LenisProvider: autoRaf: false + gsap.ticker.add((time) => lenis.raf(time * 1000)) — single RAF loop"
    - "gsap.ticker.lagSmoothing(0) — prevents stutter on tab background/foreground switch"
    - "lenis.on('scroll', ScrollTrigger.update) — ScrollTrigger positions stay in sync with Lenis"
    - "GSAP quickTo() for cursor position — direct DOM writes bypass React, ~10x faster than gsap.to()"
    - "CSS custom properties --spotlight-x / --spotlight-y for spotlight layer position (avoids React re-renders)"
    - "matchMedia('(pointer: coarse)') guard — CustomCursor fully inert on touch devices"
    - "useMagnetic: bounds cached on mouseEnter, not recalculated on every mousemove"
    - "CursorProvider provides variant string only (never position) — position is GSAP-only"

key-files:
  created:
    - src/components/providers/LenisProvider.tsx
    - src/components/providers/CursorProvider.tsx
    - src/components/cursor/CustomCursor.tsx
    - src/hooks/useMagnetic.ts
    - src/components/cursor/MagneticButton.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx

key-decisions:
  - "GSAP ticker drives Lenis RAF (autoRaf: false) — one animation loop instead of two competing requestAnimationFrame calls"
  - "Cursor position via GSAP quickTo only — no React useState for x/y coordinates (avoids React reconciler overhead at 60fps)"
  - "CursorProvider provides variant string only — position tracking entirely outside React state"
  - "matchMedia pointer:coarse check in useEffect (not SSR) — ensures CustomCursor is fully inert on touch devices without hydration mismatch"
  - "bounds cached on mouseEnter in useMagnetic — getBoundingClientRect called once per hover, not on every mousemove"

patterns-established:
  - "Provider order: LenisProvider (outermost) > CursorProvider > children — mandatory, reversal breaks dependency chain"
  - "CustomCursor inside CursorProvider (not outside) — it consumes useCursor() hook"
  - "GSAP animations in useEffect with empty deps array — quickTo functions are stable, no re-creation needed"
  - "Spring return on MagneticButton mouseLeave: gsap.to(ref, { x:0, y:0, duration:0.4, ease:'power3.out' })"

requirements-completed: [FOUND-04, CURS-01, CURS-02, CURS-03, CURS-04, CURS-05, CURS-06]

# Metrics
duration: 3min
completed: 2026-03-28
---

# Phase 1 Plan 02: LenisProvider + Custom Cursor System Summary

**GSAP-ticker-driven Lenis smooth scroll + 4-layer custom cursor (dot/ring/follower/spotlight) with magnetic button effect, all position tracking via GSAP quickTo exclusively**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-28T15:42:00Z
- **Completed:** 2026-03-28T15:44:59Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- LenisProvider created with `autoRaf: false` — GSAP ticker drives the single RAF loop via `gsap.ticker.add((time) => lenis.raf(time * 1000))`. ScrollTrigger stays in sync via `lenis.on('scroll', ScrollTrigger.update)`.
- CursorProvider exports `CursorVariant` type (7 variants: default/hover/view/drag/crosshair/text/hidden) and `useCursor()` hook. Provides variant string only — never position data.
- CustomCursor renders 4 DOM layers positioned exclusively via GSAP `quickTo()`. Dot (0.15s), ring (0.20s), follower (0.60s power2.out — visible lag), spotlight (CSS custom properties). Fully hidden on `pointer:coarse` devices.
- `useMagnetic` hook provides 80px radius magnetic displacement with bounds cached on enter. Spring return on leave (power3.out 0.4s).
- `MagneticButton` component combines `useMagnetic` + `useCursor().setVariant` on hover/leave.
- `layout.tsx` wired: `LenisProvider > CursorProvider > CustomCursor > children`. Provider order is mandatory.
- `page.tsx` updated with two `MagneticButton` instances for visual testing of the magnetic effect.

## Task Commits

1. **Task 1: LenisProvider + CursorProvider + provider wiring** — `c9b5e62` (feat)
2. **Task 2: CustomCursor + useMagnetic + MagneticButton + layout/page update** — `b8fbf59` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/components/providers/LenisProvider.tsx` — smooth scroll provider, GSAP ticker integration, useLenis() hook
- `src/components/providers/CursorProvider.tsx` — CursorVariant type, useCursor() hook, variant state only
- `src/components/cursor/CustomCursor.tsx` — 4-layer cursor DOM, GSAP quickTo position, pointer:coarse guard
- `src/hooks/useMagnetic.ts` — magnetic displacement hook (80px radius, spring return)
- `src/components/cursor/MagneticButton.tsx` — CTA button with magnetic + cursor variant integration
- `src/app/layout.tsx` — provider tree + CustomCursor wired
- `src/app/page.tsx` — MagneticButton test instances replacing plain HTML buttons

## Decisions Made

- `autoRaf: false` on Lenis is non-negotiable — two competing RAF loops (Lenis native + GSAP) cause visible scroll stuttering and ScrollTrigger sync issues.
- Cursor position via `gsap.quickTo()` only — React `useState` updates trigger reconciler at 60fps causing ~16ms overhead per frame. GSAP writes directly to DOM transform, bypassing React entirely.
- `matchMedia('(pointer: coarse)')` check in `useEffect` (client-side only) — avoids SSR/hydration issues while correctly detecting touch devices.
- `--spotlight-x` / `--spotlight-y` CSS custom properties for spotlight layer — allows transform calculation in CSS without JavaScript re-renders.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **01-03 (AnimationProvider + Preloader + Navigation):** Ready. LenisProvider/CursorProvider exports are available. Provider order slot for AnimationProvider is documented in layout.tsx comments.
- Exports confirmed: `LenisProvider`, `useLenis`, `CursorProvider`, `useCursor`, `CursorVariant`, `CustomCursor`, `MagneticButton`, `useMagnetic`

## Known Stubs

- `src/app/page.tsx` — Placeholder sections (Réalisations, Expertises, Configurateur, Contact) with hardcoded text. Intentional — Phase 2 will replace with full section components.

---
*Phase: 01-fondations*
*Completed: 2026-03-28*
