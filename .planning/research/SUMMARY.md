# Research Summary: Maje Concept — Site Vitrine Ultra-Premium

**Synthesized:** 2026-03-28
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

## Executive Summary

Building an ultra-premium showcase website for Maje Concept (print & textile specialist, Alsace) using Next.js 15 App Router + Tailwind v4 + GSAP + Motion + Lenis. The competitive gap in the local B2B print market is enormous — most competitors use stock templates from the 2010s. A well-executed premium site will have no local peer.

## Stack Consensus

| Layer | Choice | Version | Confidence |
|-------|--------|---------|------------|
| Framework | Next.js (App Router) | 15.2.x | HIGH — v16 has Turbopack bug |
| Styling | Tailwind CSS | 4.0.7 (pin!) | HIGH — v4.1 breaks with Next.js |
| Scroll animations | GSAP + ScrollTrigger | 3.14.x | HIGH — all plugins now free |
| Layout animations | Motion (ex framer-motion) | latest | HIGH — renamed package |
| Smooth scroll | Lenis | 1.3.x | HIGH — renamed from @studio-freight |
| Email | Resend + react-email | 6.x / 5.x | HIGH — native Next.js pattern |
| Forms | react-hook-form + Zod | latest | HIGH — standard stack |
| Fonts | next/font (Google or local) | built-in | HIGH |
| Icons | Custom SVG components | — | HIGH |

**Critical version pins:**
- Tailwind 4.0.7 (not 4.1.x — Turbopack RangeError)
- Next.js 15.x (not 16.x — same bug)
- GSAP from public npm (all plugins free since Webflow acquisition)
- `motion` package (not `framer-motion` — renamed)
- `lenis` package (not `@studio-freight/lenis` — renamed)

## Feature Priorities

### Must-Have (Table Stakes)
- Custom cursor with follower lag
- Lenis smooth scroll
- Preloader with entrance gate
- Scroll-triggered GSAP animations on every section
- Masonry portfolio with filters + lightbox
- Contact form with real-time validation + Resend emails
- SEO metadata + JSON-LD
- Premium typography (serif + sans pairing)
- Mobile responsive with touch cursor disabled

### High-Impact Differentiators
- **Multi-layer cursor** (4+ contextual states + spotlight) — signature visual
- **SplitText kinetic hero typography** — GSAP SplitText now free
- **Magnetic CTA buttons** — cheap to implement, high visual impact
- **Live product configurator** — unique in the market, highest complexity
- **Animated portfolio filters** — GSAP Flip for smooth transitions
- **KPI animated counters** — standard but effective social proof

### Explicitly Excluded
- WebGL/Three.js particle backgrounds (kills LCP, no brand relevance)
- Multiple horizontal scroll sections (fragile, confusing)
- Purple gradients (AI slop marker)
- Dark mode toggle (dilutes brand)
- Audio (universally hated)

## Architecture Key Decisions

1. **Single-page architecture** — all sections in `app/page.tsx`
2. **Provider stack order:** LenisProvider → CursorProvider → AnimationProvider
3. **Cursor position via GSAP `quickTo`** — never React state (60fps requirement)
4. **Lenis `autoRaf: false`** + GSAP ticker drives scroll (one RAF loop)
5. **`useGSAP()` hook** for all GSAP code (StrictMode safe, auto-cleanup)
6. **Tailwind v4 `@theme {}`** in globals.css — no tailwind.config.ts
7. **Route Handler** for contact form (`/api/contact/route.ts`)
8. **Configurator:** SVG layer composition (2D), not Three.js

## Top 5 Pitfalls to Watch

| # | Pitfall | Impact | Phase |
|---|---------|--------|-------|
| 1 | GSAP + React StrictMode double-mount | Duplicate animations, memory leaks | Phase 1 |
| 2 | Lenis + GSAP dual RAF loop | Scroll jitter, dropped frames | Phase 1 |
| 3 | Hydration errors from client-side animation libs | White screen in production | Phase 1 |
| 4 | Custom cursor in React state (not GSAP quickTo) | Janky cursor at 60fps | Phase 1 |
| 5 | AI slop aesthetic (purple gradients, Inter font, card grids) | Fails quality bar | ALL |

## Suggested Build Order

```
Phase 1: Foundation & Design System
  Next.js scaffold + Tailwind @theme + fonts + Lenis + GSAP + cursor + nav + preloader
  → Everything animation-critical established first

Phase 2: Core Sections
  Hero (parallax + SplitText) + Portfolio (masonry + filters + lightbox)
  + Expertise (scroll anims + counters) + Social Proof (logos + testimonials)
  → All content sections with full animation treatment

Phase 3: Interactive & Conversion
  Configurator (SVG layers + real-time preview) + Contact form (validation + Resend)
  + Footer + Mentions légales
  → Revenue-generating features

Phase 4: SEO & Performance
  Metadata + JSON-LD + sitemap + robots.txt + CWV audit + responsive polish
  → Production readiness
```

## Open Questions for Roadmap

1. **3D vs 2D configurator** — SVG layer composition (recommended) is sufficient and avoids R3F bundle size (+200KB). Confirm before Phase 3.
2. **Licensed font vs Google Fonts** — both paths viable. Licensed adds exclusivity but requires `next/font/local`.
3. **Analytics** — Plausible/Fathom (privacy-first, no cookie banner needed) vs GA4 (cookie consent required under RGPD).
4. **Rate limiting on contact form** — honeypot field + simple in-memory rate limit recommended.

---
*Synthesized: 2026-03-28*
