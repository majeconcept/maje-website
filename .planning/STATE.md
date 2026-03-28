# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-28)

**Core value:** Chaque visiteur est immédiatement impressionné par l'expérience visuelle et convertit en lead qualifié — l'impression de qualité dès les 3 premières secondes est la priorité absolue
**Current focus:** Phase 1 — Fondations & Design System

## Current Position

Phase: 1 of 4 (Fondations & Design System)
Plan: 0 of 3 in current phase
Status: Ready to execute — Phase 1 plans complete
Last activity: 2026-03-28 — Phase 1 planning complete (3 plans created, 3 waves)

Progress: [░░░░░░░░░░] 0%

## Phase 1 Plans

| Plan | Objective | Wave | Status |
|------|-----------|------|--------|
| 01-01 | Scaffold Next.js 15 + Tailwind v4 @theme + fonts + gsapConfig + cn() | 1 | Not started |
| 01-02 | LenisProvider + CursorProvider + CustomCursor 4 couches + MagneticButton | 2 | Not started |
| 01-03 | AnimationProvider + Preloader + Navigation fixe IntersectionObserver | 3 | Not started |

**Execution order:** Plans 01-01 → 01-02 → 01-03 (strictly sequential — each depends on the previous)

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: — min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Tailwind 4.0.7 pinned (not 4.1.x — Turbopack RangeError with Next.js 15)
- Next.js 15.x pinned (not 16.x — same Turbopack bug)
- Curseur via GSAP `quickTo`, jamais React state (exigence 60fps)
- Lenis `autoRaf: false` + GSAP ticker (un seul RAF loop — évite le scroll jitter)
- SVG layer composition pour le configurateur (pas Three.js — évite +200KB bundle)
- `motion` package (pas `framer-motion` — renommé)
- `lenis` package (pas `@studio-freight/lenis` — renommé)
- Fonts locales: TestSohneBreit-Buch.otf + TestSohneBreit-Dreiviertelfett.otf via next/font/local
- Palette: noir profond (oklch 0.10) + or chaud (oklch 0.72) + crème (oklch 0.96) — jamais de violet
- Provider order: LenisProvider → CursorProvider → AnimationProvider (non négociable)

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-28
Stopped at: Phase 1 planning complete. 3 plans written to .planning/phases/01-fondations/. Ready to execute plan 01-01.
Resume file: None

## Next Steps

Execute Phase 1:
1. Start with plan 01-01 (scaffold)
2. Then 01-02 (cursor + providers)
3. Then 01-03 (preloader + navigation)

Command: `/gsd:execute-phase 01-fondations`
