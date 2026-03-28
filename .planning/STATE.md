---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 02-03-PLAN.md (ExpertiseSection)
last_updated: "2026-03-28T19:25:51.392Z"
last_activity: 2026-03-28
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 7
  completed_plans: 6
  percent: 11
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-28)

**Core value:** Chaque visiteur est immédiatement impressionné par l'expérience visuelle et convertit en lead qualifié — l'impression de qualité dès les 3 premières secondes est la priorité absolue
**Current focus:** Phase 2 — Sections Principales

## Current Position

Phase: 2 of 4 (Sections Principales)
Plan: 3 of 4 in current phase (planning complete, ready to execute)
Status: Ready to execute
Last activity: 2026-03-28

Progress: [████░░░░░░] 11% (3/7 plans across phases 1-2 planned)

## Phase 1 Plans — Complete

| Plan | Objective | Wave | Status |
|------|-----------|------|--------|
| 01-01 | Scaffold Next.js 15 + Tailwind v4 @theme + fonts + gsapConfig + cn() | 1 | Complete |
| 01-02 | LenisProvider + CursorProvider + CustomCursor 4 couches + MagneticButton | 2 | Complete |
| 01-03 | AnimationProvider + Preloader + Navigation fixe IntersectionObserver | 3 | Complete |

## Phase 2 Plans

| Plan | Objective | Wave | Status |
|------|-----------|------|--------|
| 02-01 | Section Hero : SplitText + parallax 3 couches + MagneticButton CTAs | 1 | Not started |
| 02-02 | Section Portfolio : masonry 8 projets + GSAP Flip filters + lightbox | 2 | Not started |
| 02-03 | Section Expertises : AnimatedCounter KPI + icônes SVG + ScrollTrigger | 3 | Not started |
| 02-04 | Section Social Proof : logo carousel CSS marquee + témoignages bento + page.tsx final | 4 | Not started |

**Execution order:** Strictly sequential 02-01 → 02-02 → 02-03 → 02-04 (each depends on prior)

## Performance Metrics

**Velocity:**

- Total plans completed: 3
- Average duration: ~10 min/plan
- Total execution time: ~0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-fondations | 3/3 | 30 min | 10 min |

*Updated after each plan completion*
| Phase 01-fondations P01 | 25min | 2 tasks | 8 files |
| Phase 01-fondations P02 | 3min | 2 tasks | 7 files |
| Phase 01-fondations P03 | 2min | 2 tasks | 4 files |
| Phase 02-sections P01 | 10 | 2 tasks | 4 files |
| Phase 02-sections P02 | 2 | 2 tasks | 4 files |
| Phase 02-sections P03 | 5 | 2 tasks | 8 files |

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
- tsconfig forceConsistentCasingInFileNames=false — GSAP Flip.js/flip.d.ts case mismatch on macOS HFS+
- Logo renamed to public/logo.svg (original filename had spaces — cleaner next/image usage)
- shadcn/ui initialized with @base-ui/react (new shadcn 4.x pattern, not @radix-ui directly)
- [Phase 01-fondations]: GSAP ticker drives Lenis RAF (autoRaf: false) — one animation loop instead of two competing RAF calls
- [Phase 01-fondations]: Cursor position via GSAP quickTo only — no React useState for x/y coordinates
- [Phase 01-fondations]: hasCompletedRef guard prevents race condition between timeout and gsap onComplete
- [Phase 02 Planning]: SplitText.create() new API (3.13+) with mask:"lines" for hero reveal — not new SplitText() old API
- [Phase 02 Planning]: GSAP Flip filter pattern: Flip.getState → setActiveFilter → requestAnimationFrame → Flip.from
- [Phase 02 Planning]: AnimatedCounter uses GSAP proxy object { val: 0 } with onUpdate — not setInterval or React state
- [Phase 02 Planning]: Logo carousel uses CSS marquee @keyframes (lighter than GSAP ticker) + JS animationPlayState for pause
- [Phase 02-sections]: Mouse parallax uses xPercent/yPercent to avoid conflict with scroll parallax y property
- [Phase 02-sections]: MagneticButton handles cursor variant internally — HeroSection does not call setVariant() manually
- [Phase 02-sections]: Lightbox currentIndex maps to PORTFOLIO_PROJECTS full array not filtered subset — correct project opens regardless of active filter
- [Phase 02-sections]: Masonry via CSS Grid colSpan/rowSpan Tailwind classes in data layer — avoids JS layout calculation and animates cleanly with GSAP Flip
- [Phase 02-sections]: IconDTF reused for transfert domain — both are thermal/digital transfer techniques
- [Phase 02-sections]: fr-FR Intl.NumberFormat for KPI >= 1000 — 2000 shows as 2 000 with French thousands separator

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-28T19:25:51.389Z
Stopped at: Completed 02-03-PLAN.md (ExpertiseSection)
Resume file: None

## Next Steps

Execute Phase 2:

1. **Next: 02-01** — Section Hero (SplitText + parallax + CTAs)
2. Then: 02-02 — Section Portfolio (masonry + Flip filters + lightbox)
3. Then: 02-03 — Section Expertises (KPI counters + SVG icons)
4. Then: 02-04 — Section Social Proof (logo carousel + testimonials + page.tsx wiring)

Command: `/gsd:execute-phase 02-sections`
