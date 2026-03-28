# Phase 1: Fondations & Design System — Context

**Phase:** 1 of 4
**Goal:** Les bases techniques sont en place et l'expérience visuelle signature est perceptible dès le premier chargement
**Duration estimate:** 1-2 days
**Status:** Not started

---

## What "Done" Looks Like

Phase 1 is complete when all five success criteria pass simultaneously:

1. `npm run dev` starts without error — Tailwind v4 `@theme {}` compiles, fonts load via `next/font`
2. The custom cursor is visible with 4 distinct layers (dot, ring, follower, spotlight), the follower visibly lags behind the dot, and the cursor disappears completely on touch devices
3. Hovering a CTA button within ~80px causes it to magnetically drift toward the cursor; releasing causes a spring return
4. The preloader plays its animation and exits in < 3 seconds; no section entrance animation fires before the preloader completes
5. The fixed navigation highlights the correct section link as the user scrolls through the page

No section content (hero, portfolio, etc.) is required. The deliverable is infrastructure and signature interactions that Phase 2 content will plug into.

---

## Esthetic Direction

**Target:** Ultra-premium showcase indistinguishable from a 50 000€+ agency production. The correct reference points are Awwwards site-of-the-year winners, not SaaS landing pages.

**Palette (defined in `@theme {}`):**
- `--color-brand-black`: oklch(0.10 0.008 250) — near-black with slight cool undertone, not pure #000
- `--color-brand-gold`: oklch(0.72 0.14 82) — warm, deep gold — NOT yellow, NOT orange
- `--color-brand-cream`: oklch(0.96 0.012 88) — warm off-white for text on dark backgrounds
- `--color-brand-charcoal`: oklch(0.18 0.008 250) — dark gray for card surfaces
- `--color-brand-muted`: oklch(0.45 0.01 250) — muted gray for secondary text

**Typography:**
- Display/headline face: `TestSohneBreit-Dreiviertelfett.otf` (local font — heavier weight) — used for hero titles, section headings
- Body/UI face: `TestSohneBreit-Buch.otf` (local font — lighter weight) — used for navigation, body copy, labels
- Both loaded via `next/font/local` pointing to files at project root
- Fallback stack: `system-ui, -apple-system, sans-serif` (sans-serif fallback only, never generic serif)

**Motion language:**
- Entrance: elements travel upward (`y: 60 → 0`) with opacity (`0 → 1`), duration 0.9s, ease `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo equivalent)
- Stagger: 0.08s between sibling elements
- Cursor follower lag: lerp factor 0.08-0.12 via GSAP `quickTo`
- Magnetic return: `gsap.to` with `power3.out`, 0.4s
- Preloader exit: opacity fade + slight scale-up, 0.6s

**Density:** Navigation and utility UI elements are compact (Notion/Linear density). Section layouts breathe with generous whitespace but typography is bold and editorial. This is NOT a "clean minimal" consumer app — it is a confident, dense, premium craft tool aesthetic applied to a showcase.

**What this is NOT:**
- No purple, blue, or violet gradients anywhere
- No Inter, Roboto, or Arial fonts
- No symmetric card grids as primary layouts
- No particle backgrounds (WebGL is Phase 2-out-of-scope level complexity)
- No generic stock photography aesthetics in the design system itself

---

## Key Decisions (Locked)

These decisions are from the project-wide research and are not re-opened in this phase:

| Decision | What It Means for Phase 1 |
|----------|--------------------------|
| Next.js 15.2.x (not 16.x) | Scaffold with `create-next-app@15`. Do not use v16 — Turbopack RangeError with Tailwind. |
| Tailwind 4.0.7 pinned | After scaffold, run `npm install tailwindcss@4.0.7`. Never upgrade to 4.1.x until upstream fix. |
| `@theme {}` CSS-only config | All design tokens live in `globals.css` — no `tailwind.config.ts` file. |
| GSAP 3.14.x — all plugins free | Install `gsap` and `@gsap/react`. No GSAP Club membership needed. SplitText, ScrollTrigger, Flip all included. |
| `useGSAP()` for ALL GSAP code | Never use `useEffect` for GSAP. `useGSAP` handles StrictMode + auto-cleanup. Non-negotiable. |
| `lenis` package (not `@studio-freight/lenis`) | The old package name is dead. Install `lenis`. |
| `motion` package (not `framer-motion`) | `framer-motion` is the legacy name. Import from `motion/react`. |
| Lenis `autoRaf: false` | GSAP ticker drives the RAF loop. Lenis does not run its own. One loop, not two. |
| Cursor position via GSAP `quickTo` ONLY | CursorProvider provides only a string variant. Position never enters React state. 60fps is non-negotiable. |
| Local fonts: `TestSohneBreit-Buch.otf` + `TestSohneBreit-Dreiviertelfett.otf` | Both files exist at project root. Use `next/font/local`. |
| SVG logo: `LOGO VECTO SOURCE.svg` at project root | Use for preloader and navigation. Import as a component or via `next/image`. |

---

## Provider Stack (Critical Order)

```
layout.tsx
  └─ LenisProvider          ← smooth scroll, GSAP ticker sync
       └─ CursorProvider    ← cursor variant string only (NOT position)
            └─ AnimationProvider  ← preloader gate, isReady flag
                 └─ Navigation   ← fixed, outside page flow
                 └─ CustomCursor ← absolute positioned, pointer-events: none
                 └─ {children}   ← page.tsx content
```

Order is mandatory. Reversing any two breaks the dependency chain.

---

## What Phase 2 Needs From Phase 1

Phase 2 builds Hero, Portfolio, Expertise, and Social Proof sections. Each of those depends on:

1. **GSAP + ScrollTrigger registered** (`lib/gsapConfig.ts` must call `gsap.registerPlugin(ScrollTrigger, SplitText, Flip)`)
2. **`useAnimation()` hook from AnimationProvider** — returns `isReady: boolean`. Section entrance animations check `if (!isReady) return` before firing
3. **CursorProvider** — sections set `data-cursor="view"` on portfolio cards, `data-cursor="drag"` on carousels. Phase 2 expects CursorProvider to respond to these attributes
4. **Lenis instance** — ScrollTrigger must be connected to Lenis scroll events (`lenis.on('scroll', ScrollTrigger.update)`)
5. **Design tokens** — all `@theme {}` tokens are referenced by Phase 2 section styles. Changing token names after Phase 2 starts is costly.
6. **`cn()` utility** — Phase 2 uses `cn()` from `lib/utils.ts` for class merging
7. **MagneticButton component** — Phase 2 hero CTAs and contact CTAs use it directly

---

## What NOT to Do (Phase 1 Pitfalls)

| Pitfall | Consequence | Rule |
|---------|-------------|------|
| Storing cursor position in React state | Full React tree re-render at 60fps = janky cursor, defeated purpose | Use GSAP `quickTo` ONLY for position |
| Running Lenis with its own RAF (`autoRaf: true`) | Two RAF loops = scroll jitter, animation desync | Set `autoRaf: false`, drive from `gsap.ticker` |
| Using `useEffect` for GSAP code | StrictMode double-mount = duplicate animations, orphaned ScrollTriggers | Always `useGSAP()` from `@gsap/react` |
| Referencing `window`/`document` outside effects | SSR build fails, hydration errors in production | All browser APIs inside `useGSAP`, `useEffect`, or guarded with `typeof window !== 'undefined'` |
| Missing `"use client"` on animation components | Server component tries to import browser-only APIs | Every provider, cursor, and GSAP component needs `"use client"` |
| Installing Tailwind 4.1.x | `RangeError: Invalid code point` crashes the build | Pin explicitly: `npm install tailwindcss@4.0.7` |
| Using `tailwind.config.ts` for v4 theme | Config file is ignored in v4 | All tokens go in `@theme {}` in `globals.css` |
| Preloader that blocks HTML rendering | SEO bots index empty page | Preloader is a visual overlay — HTML renders underneath, animations are gated |
| `mix-blend-mode: difference` on cursor without `pointer-events: none` | Cursor captures mouse events, breaks all click targets | Always `pointer-events: none` on ALL cursor layers |
| Custom cursor on touch devices | Touch users see a ghost element that serves no purpose | Detect `matchMedia('(pointer: coarse)')` and bail out of cursor init |

---

## Integration Points With Phases 3 and 4

- **Phase 3 (Configurator + Contact):** Will add `data-cursor="crosshair"` on the configurator canvas. CursorProvider must handle this variant.
- **Phase 4 (SEO + Performance):** Will audit CLS from font loading. The `next/font/local` setup from Phase 1 with `display: 'swap'` and the preloader cover are the defensive measures already in place.

---

*Context written: 2026-03-28*
*Phase owner: Claude*
