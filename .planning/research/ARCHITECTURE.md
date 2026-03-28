# Architecture Research: Site Vitrine Ultra-Premium

**Researched:** 2026-03-28
**Domain:** Next.js App Router premium showcase site architecture
**Confidence:** HIGH

## High-Level Architecture

Single-page showcase site built on Next.js App Router. All content sections render on one page (`app/page.tsx`). The App Router provides SSG output, metadata API, API routes, and image optimization — but the site is fundamentally a single-page experience with scroll-based navigation.

```
┌─────────────────────────────────────────────┐
│                  layout.tsx                   │
│  ┌─────────────────────────────────────────┐ │
│  │          Provider Stack                  │ │
│  │  LenisProvider → CursorProvider          │ │
│  │  → AnimationProvider                     │ │
│  │  ┌───────────────────────────────────┐   │ │
│  │  │          Navigation               │   │ │
│  │  │          CustomCursor             │   │ │
│  │  │  ┌─────────────────────────────┐  │   │ │
│  │  │  │       page.tsx              │  │   │ │
│  │  │  │  HeroSection               │  │   │ │
│  │  │  │  PortfolioSection           │  │   │ │
│  │  │  │  ExpertiseSection           │  │   │ │
│  │  │  │  ConfiguratorSection        │  │   │ │
│  │  │  │  SocialProofSection         │  │   │ │
│  │  │  │  ContactSection             │  │   │ │
│  │  │  │  Footer                     │  │   │ │
│  │  │  └─────────────────────────────┘  │   │ │
│  │  └───────────────────────────────────┘   │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Component Architecture

### Provider Stack (Critical Order)

Three mandatory providers wrap the entire app in a strict dependency order:

1. **LenisProvider** — smooth scroll. Must init first because GSAP ScrollTrigger hooks into it
2. **CursorProvider** — cursor state context. Carries semantic variant ("default", "hover", "view", "drag", "crosshair") — NOT position
3. **AnimationProvider** — preloader gate. Controls when entrance animations fire

```
LenisProvider (scroll)
  └─ CursorProvider (cursor variant state)
       └─ AnimationProvider (preloader + entrance gate)
            └─ {children}
```

### Cursor Architecture (Performance-Critical)

**Rule: Cursor position must NEVER be React state.**

- GSAP `quickTo` writes `transform` directly to cursor DOM elements at 60fps via `requestAnimationFrame`
- React Context carries only the semantic cursor variant (string: "default" | "hover" | "view" | "drag" | "crosshair")
- Variant changes trigger CSS class switches (scale, opacity, text content) — not position recalculations
- The follower element uses `quickTo` with a lower ease value (0.08-0.12) for the lag effect

```
mousemove event
  ├─→ GSAP quickTo → cursor element transform (60fps, no React)
  ├─→ GSAP quickTo → follower element transform (lagged, no React)
  └─→ Spotlight gradient position update (CSS custom property)

mouseenter on [data-cursor="view"]
  └─→ setCursorVariant("view") → React Context → CSS class change
```

### Lenis + GSAP Integration (Critical Pattern)

**Lenis must use `autoRaf: false`** so GSAP's ticker is the sole RAF loop:

```typescript
// LenisProvider setup
const lenis = new Lenis({ autoRaf: false });

// GSAP ticker drives Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0); // Prevent GSAP from throttling
```

Without this, two RAF loops run simultaneously causing scroll jitter.

### GSAP in React

**Use `useGSAP()` hook from `@gsap/react`** for all GSAP animations:
- Handles React 18+ StrictMode double-invoke
- Automatically reverts ScrollTrigger instances on unmount
- Prevents memory leaks from orphaned animations

```typescript
import { useGSAP } from "@gsap/react";

useGSAP(() => {
  gsap.from(".element", {
    scrollTrigger: { trigger: ".element", start: "top 80%" },
    y: 60, opacity: 0, duration: 1
  });
}, { scope: containerRef }); // Scoped to container
```

## File Structure

```
app/
├── layout.tsx              # Root layout: fonts, providers, nav, cursor, metadata
├── page.tsx                # Home: all sections composed
├── globals.css             # Tailwind v4 @theme tokens, base styles, cursor styles
├── api/
│   └── contact/
│       └── route.ts        # POST handler: Zod validation → Resend emails
├── mentions-legales/
│   └── page.tsx            # Legal mentions (static)
└── sitemap.ts              # Dynamic sitemap generation

components/
├── providers/
│   ├── LenisProvider.tsx   # Smooth scroll + GSAP ticker sync
│   ├── CursorProvider.tsx  # Cursor variant context (NOT position)
│   └── AnimationProvider.tsx # Preloader state, entrance gate
├── cursor/
│   ├── CustomCursor.tsx    # Cursor dot + follower + spotlight
│   └── MagneticButton.tsx  # Magnetic effect wrapper for CTAs
├── navigation/
│   └── Navigation.tsx      # Fixed nav with scroll-based active states
├── sections/
│   ├── HeroSection.tsx     # Hero with parallax, SplitText title, CTAs
│   ├── PortfolioSection.tsx # Masonry grid, filters, lightbox
│   ├── ExpertiseSection.tsx # Skills with SVG icons, scroll animations
│   ├── ConfiguratorSection.tsx # Live product configurator
│   ├── SocialProofSection.tsx  # Logos, testimonials, stats
│   ├── ContactSection.tsx  # Form with validation, configurator pre-fill
│   └── Footer.tsx          # Navigation, social, legal, newsletter
├── ui/
│   ├── AnimatedCounter.tsx # Count-up on intersection
│   ├── SplitText.tsx       # GSAP SplitText wrapper
│   ├── Lightbox.tsx        # Portfolio image lightbox
│   ├── LogoCarousel.tsx    # Infinite scroll client logos
│   └── Preloader.tsx       # Loading screen with animation
└── icons/
    └── *.tsx               # Custom SVG icon components

lib/
├── animations.ts           # Shared GSAP animation presets
├── constants.ts            # Brand colors, breakpoints, timing
├── validations.ts          # Zod schemas (contact form)
└── utils.ts                # Helpers (cn(), formatPhone, etc.)

public/
├── images/
│   ├── portfolio/          # Project images (optimized)
│   ├── logos/              # Client logos (SVG preferred)
│   └── testimonials/       # Testimonial photos
├── fonts/                  # Local premium fonts (if not Google)
└── og-image.jpg            # Open Graph image
```

## Tailwind v4 Theming

**No `tailwind.config.ts` needed.** All theming lives in `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-black: oklch(0.13 0.01 250);
  --color-brand-gold: oklch(0.75 0.12 85);
  --color-brand-cream: oklch(0.96 0.01 90);
  --color-brand-white: oklch(0.98 0.005 90);

  --font-display: "Playfair Display", serif;
  --font-body: "DM Sans", sans-serif;

  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Contact Form Data Flow

```
User fills form (react-hook-form + Zod client validation)
  │
  ├─ If from configurator: configuration data pre-filled via React state
  │
  └─→ POST /api/contact (fetch)
       │
       ├─→ Zod server-side re-validation
       │
       ├─→ Resend: notification email to Maje Concept
       │   (all lead info: name, email, phone, company, need type, message, config)
       │
       ├─→ Resend: confirmation email to prospect
       │   (branded HTML template, thank you + next steps)
       │
       └─→ Response: { success: true }
            └─→ Success animation in UI
```

## Build Order (Dependencies)

```
Phase 1: Foundation & Design System
  Next.js 15 scaffold → Tailwind v4 @theme tokens → Premium fonts
  → LenisProvider + GSAP ticker sync → CursorProvider + CustomCursor
  → MagneticButton → Navigation → Preloader/AnimationProvider

Phase 2: Core Sections
  HeroSection (parallax + SplitText + staggered reveals)
  PortfolioSection (masonry + filters + lightbox)
  ExpertiseSection (scroll animations + counters)
  SocialProofSection (logos + testimonials + stats)

Phase 3: Interactive & Conversion
  ConfiguratorSection (SVG layers + real-time preview)
  ContactSection (form + validation + Resend API route)
  Footer

Phase 4: SEO & Polish
  Metadata + JSON-LD + sitemap + robots.txt
  Performance audit (LCP, CLS, INP)
  Responsive fine-tuning
  Mentions légales page
```

## Performance Strategy

| Concern | Strategy |
|---------|----------|
| LCP | Hero image with `priority` prop (generates `<link rel="preload">`), font preload |
| CLS | Fixed dimensions on images, font-display: swap, skeleton layouts during load |
| INP | Debounced scroll handlers, GSAP ticker (not addEventListener), passive event listeners |
| Bundle size | Dynamic import for GSAP plugins, code splitting per section, tree-shake Motion |
| Images | `next/image` with WebP/AVIF, responsive srcSet, lazy loading (except hero) |

## Open Questions

- Configurator pre-fill transport: URL params (survive refresh, shareable) vs lifted React state (simpler)
- Licensed premium font vs Google Fonts — both viable paths documented
- Whether R3F/Three.js is included (adds ~200KB) — current spec suggests 2D SVG configurator is sufficient

---
*Researched: 2026-03-28*
