---
phase: 02-sections
plan: 03
subsystem: expertise
tags: [gsap, scroll-trigger, animated-counter, svg-icons, expertise-section]

# Dependency graph
requires:
  - phase: 01-03
    provides: "useAnimation().isReady gate, AnimationProvider, CursorProvider"
  - phase: 02-01
    provides: "isReady gate pattern, scrollTrigger entrance pattern"
  - phase: 02-02
    provides: "data-cursor pattern established, page.tsx placeholder setup"
provides:
  - ExpertiseSection: KPI strip 4 AnimatedCounters + 5-card expertise grid with scroll animations
  - EXPERTISE_DOMAINS: 5 typed domains (sérigraphie, broderie, DTF, flocage, transfert)
  - KPI_STATS: 4 KPIs with target/suffix/label/description
  - AnimatedCounter: GSAP proxy pattern, scroll-triggered, reusable
  - IconSerigraphie, IconBroderie, IconDTF, IconFlocage: inline SVG React components
affects:
  - src/app/page.tsx (#expertises placeholder replaced by ExpertiseSection)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GSAP proxy counter: const proxy = { val: 0 }; gsap.to(proxy, { val: target, onUpdate: () => displayRef.current.textContent = Math.round(proxy.val) + suffix })"
    - "ScrollTrigger once:true on all entrance animations — fires exactly once per page load"
    - "isReady gate as first line of useGSAP callback — prevents race with preloader"
    - "ICON_MAP const object maps icon string keys to React components — dynamic rendering without conditionals"
    - "fr-FR Intl.NumberFormat for targets >= 1000 (2 000 clients with space separator)"

key-files:
  created:
    - src/data/expertise.ts
    - src/components/ui/AnimatedCounter.tsx
    - src/components/icons/IconSerigraphie.tsx
    - src/components/icons/IconBroderie.tsx
    - src/components/icons/IconDTF.tsx
    - src/components/icons/IconFlocage.tsx
    - src/components/sections/ExpertiseSection.tsx
  modified:
    - src/app/page.tsx

key-decisions:
  - "IconDTF reused for 'transfert' domain — both are thermal/digital transfer techniques, ICON_MAP maps both keys to same component"
  - "fr-FR Intl.NumberFormat applied for target >= 1000 — 2000 displays as '2 000' with French thousands separator"
  - "ExpertiseSection uses bg-brand-charcoal to contrast with PortfolioSection bg-brand-black — visual rhythm between sections"

requirements-completed: [EXPT-01, EXPT-02, EXPT-03, ANIM-01, ANIM-02]

# Metrics
duration: 5min
completed: 2026-03-28
---

# Phase 2 Plan 03: ExpertiseSection Summary

**GSAP proxy-pattern animated KPI counters + 5-domain expertise grid with ScrollTrigger stagger entrance on bg-brand-charcoal**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-03-28T19:24:55Z
- **Tasks:** 2/2
- **Files modified:** 8 (7 created, 1 updated)

## Accomplishments

- **`src/data/expertise.ts`:** `EXPERTISE_DOMAINS` (5 domains: sérigraphie, broderie, DTF, flocage, transfert) and `KPI_STATS` (4 KPIs: 12 ans, 2000+, 99%, 48h). Both exported as typed arrays. `ExpertiseDomain.icon` is a union literal type matching ICON_MAP keys.

- **`src/components/ui/AnimatedCounter.tsx`:** GSAP proxy pattern — `const proxy = { val: 0 }` tweened to target via `onUpdate` callback updating `displayRef.current.textContent`. fr-FR `Intl.NumberFormat` applied when target >= 1000. ScrollTrigger `once: true`, `start: "top 80%"`. `isReady` gate from `useAnimation()` as mandatory first check. `useGSAP({ scope: counterRef, dependencies: [isReady] })`.

- **`src/components/icons/`:** 4 inline SVG components (IconSerigraphie, IconBroderie, IconDTF, IconFlocage). All accept `className` and `size` props, use `currentColor` stroke, `aria-hidden="true"`. Minimal geometric style — screen grid for sérigraphie, bobine+aiguille for broderie, imprimante+buses for DTF, t-shirt+velours texture for flocage.

- **`src/components/sections/ExpertiseSection.tsx`:** Section `id="expertises"` on `bg-brand-charcoal`. Three GSAP scroll entrance animations (header, KPI strip, expertise cards) — all `scrollTrigger once:true, start: "top 80%"`, gated on `isReady`. KPI strip: 2×2 grid on mobile / 4-col on desktop with gold accent line `w-0 → w-full` on hover. Expertise grid: 5 cards with dynamic `ICON_MAP[domain.icon]` rendering, `setVariant("hover"/"default")` cursor integration, gold bottom border reveal on hover.

- **`src/app/page.tsx`:** `ExpertiseSection` imported and replaces `#expertises` placeholder. `#configurateur` and `#contact` placeholder divs preserved for Phase 3 navigation tracking.

## Task Commits

1. **Task 1: expertise.ts + AnimatedCounter + 4 SVG icons** — `6751f38` (feat) — *pre-existing from partial prior execution*
2. **Task 2: ExpertiseSection + page.tsx** — `5e852be` (feat)

## Success Criteria — All 7 Pass

1. `npm run build` passes without error — CONFIRMED (`Compiled successfully`)
2. KPI_STATS contains 4 entries with targets: 12 (ans), 2000 (+), 99 (%), 48 (h) — CONFIRMED
3. AnimatedCounter uses proxy object `{ val: 0 }` and onUpdate — no setInterval, no React state — CONFIRMED (AnimatedCounter.tsx lines 35, 46)
4. Each AnimatedCounter has scrollTrigger `once:true` — CONFIRMED (AnimatedCounter.tsx line 44)
5. ExpertiseSection.tsx has `if (!isReady) return` as first line of useGSAP — CONFIRMED (ExpertiseSection.tsx line 34)
6. 5 expertise cards with SVG icon, hover gold border, description — CONFIRMED
7. page.tsx renders ExpertiseSection, preserves #configurateur and #contact placeholders — CONFIRMED

## Deviations from Plan

None — plan executed exactly as written. All files matched plan specs. The `page.tsx` integration was the only gap found at execution time (placeholder was still in place) — updated as planned.

## Known Stubs

None — all 5 expertise domains have real Maje Concept content. KPI values (12 ans, 2000+ clients, 99% satisfaction, 48h délai) are authentic business data per brief.

---
*Phase: 02-sections*
*Completed: 2026-03-28*
