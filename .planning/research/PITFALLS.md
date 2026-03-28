# Pitfalls Research: Site Vitrine Ultra-Premium

**Researched:** 2026-03-28
**Domain:** Premium Next.js showcase site with GSAP + Framer Motion + custom cursor
**Confidence:** HIGH

## Critical Pitfalls

### 1. GSAP + React StrictMode Double-Mount

**Severity:** HIGH — animations fire twice, ScrollTrigger creates duplicate instances
**Warning Signs:** Animations appear to stutter on mount, scroll positions are off, memory leaks
**Prevention:**
- Use `useGSAP()` from `@gsap/react` instead of `useEffect` for ALL GSAP code
- `useGSAP` automatically handles cleanup and StrictMode double-invoke
- Never create GSAP instances in `useEffect` — they won't be properly reverted
**Phase:** 1 (Foundation) — establish the pattern from day one

### 2. Lenis + GSAP ScrollTrigger Dual RAF Loop

**Severity:** HIGH — causes scroll jitter, dropped frames, inconsistent animation timing
**Warning Signs:** Smooth scroll feels "wobbly", animations skip frames, scroll position desync
**Prevention:**
- Initialize Lenis with `autoRaf: false`
- Drive Lenis from GSAP's ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- Set `gsap.ticker.lagSmoothing(0)` to prevent GSAP from throttling
- ONE animation loop, not two
**Phase:** 1 (Foundation) — must be correct from the start, painful to retrofit

### 3. Next.js App Router Hydration Errors with Animation Libraries

**Severity:** HIGH — white screen of death in production, console errors in dev
**Warning Signs:** "Hydration mismatch" errors, content flash before animations
**Prevention:**
- Mark ALL animation-heavy components with `"use client"` directive
- Use `useEffect` or `useGSAP` to delay animation setup until after hydration
- Cursor, Lenis, GSAP providers must be client components wrapped in layout.tsx
- SSR renders static HTML; animations enhance after hydration
- Never use `window`, `document`, or `navigator` outside `useEffect`/`useGSAP`
**Phase:** 1 (Foundation) — architecture decision that's impossible to change later

### 4. Custom Cursor Performance on Low-End Devices

**Severity:** MEDIUM — janky cursor ruins the premium impression instantly
**Warning Signs:** Cursor lags behind mouse, visible frame drops, high CPU usage
**Prevention:**
- Cursor position via GSAP `quickTo` (writes `transform` directly, bypasses React render)
- NEVER store cursor position in React state — this causes full re-renders at 60fps
- Use `will-change: transform` on cursor elements
- Use `pointer-events: none` on cursor elements
- Detect touch devices with `matchMedia('(pointer: coarse)')` and hide custom cursor entirely
- Use `mix-blend-mode: difference` (GPU-accelerated) for cursor inversion
**Phase:** 1 (Foundation) — cursor is global, must work before any section is built

### 5. Core Web Vitals Failures from Heavy Animations

**Severity:** HIGH — Google penalizes poor CWV, defeats the SEO investment
**Warning Signs:** LCP > 2.5s, CLS > 0.1, INP > 200ms
**Prevention:**
- **LCP:** Hero image with `priority` prop on `next/image`, preload fonts, avoid render-blocking JS
- **CLS:** Fixed dimensions on all images, `font-display: swap`, reserve space for dynamic content
- **INP:** Passive event listeners for scroll/mouse, debounce non-critical handlers, GSAP ticker (not raw addEventListener)
- **Bundle:** Dynamic import GSAP plugins (`import('gsap/ScrollTrigger')`), code-split sections
- Test with Lighthouse in production mode, not dev (dev mode is 10x slower)
**Phase:** 4 (Polish) — audit after all features built, but keep principles in mind throughout

### 6. Font Loading FOUT/FOIT

**Severity:** MEDIUM — flash of unstyled text destroys the premium first impression
**Warning Signs:** Text appears in system font then jumps to custom font, layout shift on load
**Prevention:**
- Use `next/font/google` or `next/font/local` — both generate optimal preload tags
- Set `display: 'swap'` in font config
- Preloader hides FOUT — the preloader animation covers the font loading window
- Subset fonts if using local files (latin subset for French is sufficient)
- Never load fonts via CSS `@import` or external `<link>` tags
**Phase:** 1 (Foundation) — font loading is the very first thing visitors perceive

### 7. Preloader Blocking Content / SEO

**Severity:** MEDIUM — preloaders that block too long hurt bounce rate, SEO crawlers may not wait
**Warning Signs:** Users see loading screen for > 3 seconds, Google indexes empty page
**Prevention:**
- Maximum preloader duration: 2-3 seconds (hard timeout, not waiting for every asset)
- Preloader is a visual overlay, not a content blocker — HTML is rendered underneath
- Use `requestIdleCallback` or `Promise.all` for asset preloading with timeout fallback
- Google's crawler renders JavaScript — but test with `?_escaped_fragment_` or similar
- The preloader is cosmetic, not functional — it gates entrance animations, not content
**Phase:** 1 (Foundation) — implemented alongside AnimationProvider

### 8. Tailwind CSS v4 Migration Confusion

**Severity:** MEDIUM — using v3 patterns breaks builds, tutorials are outdated
**Warning Signs:** `tailwind.config.ts` doesn't work, PostCSS errors, classes not applying
**Prevention:**
- **No `tailwind.config.ts`** — Tailwind v4 uses `@theme {}` in CSS
- Use `@import "tailwindcss"` not `@tailwind base/components/utilities`
- Use the Vite plugin `@tailwindcss/vite` (for standalone Vite) or the PostCSS plugin (for Next.js)
- Pin Tailwind to `4.0.7` — v4.1.x has a confirmed Turbopack `RangeError` with Next.js
- OKLCH color format is native and preferred over hex/HSL
**Phase:** 1 (Foundation) — CSS architecture established first

### 9. GSAP SplitText Cleanup

**Severity:** MEDIUM — orphaned split elements cause layout issues on unmount/resize
**Warning Signs:** Text elements multiply on resize, broken layout after navigation
**Prevention:**
- Always call `splitInstance.revert()` in the `useGSAP` cleanup
- Re-split on window resize (debounced) for responsive text
- SplitText is now free (part of public GSAP since Webflow acquisition)
**Phase:** 2 (Core Sections) — used in hero section

### 10. "AI Slop" Design Patterns

**Severity:** HIGH — user explicitly demands NO AI slop aesthetic
**Warning Signs:** Purple gradients, generic illustrations, Inter font, symmetrical card grids, vague stock imagery
**Prevention:**
- Distinctive palette: deep black + warm gold + off-white (or similar — no purple, no blue gradient)
- Premium serif + sans font pairing (Playfair Display + DM Sans)
- Asymmetric layouts over card grids
- SVG illustrations over stock photos
- Purposeful animation over decoration — every animation should have a functional reason
- Dense, editorial feel (Notion/Linear aesthetic) not airy consumer app
**Phase:** ALL — design sensibility must permeate every component

## Medium Pitfalls

### 11. Magnetic Button Edge Cases
- Button jumps when cursor enters from unexpected angles
- Fix: Use euclidean distance + clamp to maximum displacement
- Disable on touch devices (no hover = no magnetic)

### 12. Framer Motion + GSAP Conflicts
- Both try to control `transform` on the same elements
- Fix: Use Framer Motion for layout animations (AnimatePresence, layout prop) and GSAP for scroll/timeline animations — never both on the same element

### 13. Image Optimization Oversights
- Using PNG where WebP/AVIF would save 60%+ bandwidth
- Fix: Let `next/image` handle format negotiation, always specify `width`/`height` or `fill`
- Portfolio images should have responsive srcSet (multiple sizes)

### 14. Accessibility with Custom Cursor
- `cursor: none` removes the native cursor — screen readers and keyboard users need alternatives
- Fix: Only hide native cursor on `pointer: fine` devices, maintain full keyboard navigation, visible focus states on all interactive elements

### 15. Contact Form Without Rate Limiting
- Bots will abuse an unprotected form endpoint
- Fix: Simple rate limiting in the API route (in-memory counter or turnstile/hCaptcha)
- Honeypot field as first line of defense (invisible field that bots fill)

## Low Pitfalls

### 16. Missing `robots.txt` / `sitemap.xml`
- Fix: Use Next.js built-in `app/robots.ts` and `app/sitemap.ts`

### 17. Missing Canonical URLs
- Fix: Set in metadata export, Next.js handles this natively

### 18. Newsletter Form Without Double Opt-In
- RGPD requires double opt-in for email marketing in France
- Fix: Collect email, send confirmation link, only subscribe after click

---
*Researched: 2026-03-28*
