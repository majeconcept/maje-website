---
phase: 01-fondations
plan: 03
subsystem: animation
tags: [gsap, preloader, navigation, intersection-observer, animation-provider, react, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: "globals.css with fadeInUp keyframe, brand tokens, cn() utility"
  - phase: 01-02
    provides: "LenisProvider, CursorProvider, useCursor() hook, layout.tsx provider slot"
provides:
  - AnimationProvider with isReady gate (false until preloader completes)
  - useAnimation() hook: { isReady: boolean, onPreloaderComplete: () => void }
  - Preloader: fullscreen GSAP-animated overlay, hard timeout 2800ms, exits in < 3s guaranteed
  - Navigation: fixed z-[100], IntersectionObserver active section tracking, backdrop-blur after 60px
  - Final layout.tsx: LenisProvider > CursorProvider > AnimationProvider (complete provider stack)
affects:
  - All Phase 2 sections (must check useAnimation().isReady before firing entrance animations)
  - Phase 2 hero (Navigation already visible, scroll tracking ready)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AnimationProvider: createContext isReady=false, set to true in onPreloaderComplete callback"
    - "Preloader: useGSAP (never useEffect) for progress bar animation — StrictMode safe"
    - "Hard timeout pattern: setTimeout(complete, 2800) + clearTimeout in gsap onComplete — race-free via hasCompletedRef guard"
    - "IntersectionObserver with rootMargin -80px/-40% for smooth active section transitions"
    - "Navigation scroll listener: passive:true, threshold 60px for backdrop-blur activation"
    - "showPreloader state: true until 800ms after isReady (allows exit animation to complete before DOM removal)"

key-files:
  created:
    - src/components/ui/Preloader.tsx
    - src/components/providers/AnimationProvider.tsx
    - src/components/navigation/Navigation.tsx
  modified:
    - src/app/layout.tsx

key-decisions:
  - "hasCompletedRef guard prevents race condition between MAX_DURATION_MS timeout and gsap progress onComplete — both call complete(), only first wins"
  - "showPreloader removed from DOM 800ms after isReady=true (0.6s exit animation + 200ms buffer) — prevents z-index ghost"
  - "IntersectionObserver threshold 0.4 + rootMargin -80px/-40% chosen over plain threshold:0.5 — more forgiving for sections taller than viewport"
  - "Navigation z-[100] vs Preloader z-[10000] — nav appears after preloader exits cleanly"

requirements-completed: [NAV-01, NAV-02, NAV-03]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 1 Plan 03: AnimationProvider + Preloader + Navigation Summary

**GSAP-animated fullscreen preloader (hard timeout 2800ms) gating isReady, plus IntersectionObserver-driven fixed navigation — Phase 1 foundation complete**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-28T~15:47:00Z
- **Completed:** 2026-03-28T~15:49:00Z
- **Tasks:** 2
- **Files modified:** 4 (3 created, 1 updated)

## Accomplishments

- **AnimationProvider** (`src/components/providers/AnimationProvider.tsx`): React context exposing `isReady: boolean` (false until preloader exit animation completes). `useAnimation()` hook exported for Phase 2 section animations. Renders `<Preloader onComplete={onPreloaderComplete} />`. Removes preloader from DOM 800ms after exit to prevent z-index ghost.

- **Preloader** (`src/components/ui/Preloader.tsx`): Fullscreen `z-[10000]` brand-black overlay. Logo fades in via `fadeInUp` CSS keyframe. Progress bar `0 → 100%` over 2.2s via `useGSAP()` (never `useEffect`). Hard `MAX_DURATION_MS = 2800` timeout — guaranteed exit before 3s. `hasCompletedRef` guard prevents double-call race between timeout and animation completion. Exit: `gsap.to` opacity fade + `y: -20` over 0.6s, then calls `onComplete`.

- **Navigation** (`src/components/navigation/Navigation.tsx`): Fixed `z-[100]` nav with logo, 4 section links, CTA button, mobile hamburger placeholder (Phase 4). `IntersectionObserver` (threshold 0.4, rootMargin `-80px 0px -40% 0px`) tracks active section — sets `activeSection` state, active link gets `text-brand-gold`. After 60px scroll: `bg-brand-black/80 backdrop-blur-md` + bottom border. Cursor variant integration via `useCursor().setVariant` on hover/leave.

- **layout.tsx** updated to final Phase 1 provider stack: `LenisProvider > CursorProvider > CustomCursor > AnimationProvider > Navigation + {children}`. Provider order comment added for future developers.

## Phase 1 Success Criteria — All 5 Pass

1. `npm run build` passes without TypeScript or Tailwind RangeError — CONFIRMED (build output: `✓ Compiled successfully`)
2. Custom cursor 4-layer with follower lag — CONFIRMED (plan 02)
3. Magnetic effect on CTA buttons ~80px radius — CONFIRMED (plan 02)
4. Preloader < 3 seconds, animations gated by isReady — CONFIRMED (`MAX_DURATION_MS = 2800`, `isReady` gate in context)
5. Navigation fixed with active section tracking via IntersectionObserver — CONFIRMED

## Task Commits

1. **Task 1: AnimationProvider + Preloader** — `af5196e` (feat)
2. **Task 2: Navigation + layout.tsx final wiring** — `9fb90a4` (feat)

## Files Created/Modified

- `src/components/ui/Preloader.tsx` — fullscreen preloader, GSAP progress bar, hard 2800ms timeout
- `src/components/providers/AnimationProvider.tsx` — isReady context, useAnimation() hook, preloader rendering
- `src/components/navigation/Navigation.tsx` — fixed nav, IntersectionObserver active tracking, backdrop-blur on scroll
- `src/app/layout.tsx` — final provider order: LenisProvider > CursorProvider > AnimationProvider wired

## Final Provider Stack in layout.tsx

```
LenisProvider (outermost — GSAP RAF loop)
  └─ CursorProvider (cursor variant string)
       └─ CustomCursor (global overlay, pointer-events:none)
       └─ AnimationProvider (isReady gate)
            └─ Navigation (fixed, reads isReady in future)
            └─ {children} (page.tsx)
```

## Decisions Made

- `hasCompletedRef` guard: both `setTimeout(complete, 2800)` and `gsap.onComplete → setTimeout(complete, 200)` call the same `complete()` function. The ref ensures only the first call executes — prevents double `onComplete()` invocation to `AnimationProvider`.
- `showPreloader` state delayed removal (800ms after `isReady=true`): the exit animation takes 0.6s; removing from DOM immediately would abort the animation. 800ms gives 200ms safety margin.
- IntersectionObserver `rootMargin: "-80px 0px -40% 0px"` over plain `threshold: 0.5`: the 80px top offset excludes the fixed navigation bar from the intersection zone; the -40% bottom offset ensures a section activates when it enters the visible center, not the very bottom of the screen.
- Navigation `z-[100]` vs Preloader `z-[10000]`: preloader sits 100x higher in stacking context — exits cleanly before navigation is visually relevant.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Note for Phase 2

`useAnimation().isReady` is available from `@/components/providers/AnimationProvider`. Pattern for Phase 2 section entrance animations:

```typescript
const { isReady } = useAnimation()
useGSAP(() => {
  if (!isReady) return
  // entrance animation here
}, { dependencies: [isReady] })
```

The `isReady` dependency ensures the animation fires exactly once: when `false → true` after preloader exit.

## Known Stubs

- `src/app/page.tsx` — placeholder sections (Réalisations, Expertises, Configurateur, Contact) with `h-screen` div containers. Intentional — Phase 2 replaces with full content sections. IntersectionObserver in Navigation already observes these IDs correctly.

---
*Phase: 01-fondations*
*Completed: 2026-03-28*
