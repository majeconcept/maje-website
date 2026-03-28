# Phase 1: Fondations & Design System — Research

**Researched:** 2026-03-28
**Domain:** Next.js 15 App Router + Tailwind v4 + GSAP + Lenis + Custom Cursor infrastructure
**Confidence:** HIGH (all versions verified against project research artifacts, all patterns cross-referenced)

---

## Summary

Phase 1 establishes the five technical pillars that every subsequent phase builds on: (1) a correctly configured Next.js 15 + Tailwind v4 scaffold, (2) premium local fonts loaded with zero FOUT, (3) Lenis smooth scroll wired to GSAP's single RAF loop, (4) a high-performance multi-layer cursor system with magnetic buttons, and (5) a preloader that gates all entrance animations.

The most critical constraint is performance architecture: cursor position must never touch React state (60fps breaks immediately if it does), Lenis must run inside GSAP's ticker (not its own RAF), and all GSAP code must use `useGSAP()` (StrictMode in Next.js will create duplicate animations otherwise). These are founding decisions — retrofitting them after Phase 2 sections are built is expensive.

The Söhne Breit font files (`TestSohneBreit-Buch.otf` and `TestSohneBreit-Dreiviertelfett.otf`) are already present at the project root. They must be copied into `public/fonts/` before `next/font/local` can reference them. The SVG logo at root (`LOGO VECTO SOURCE.svg`) is used in the preloader and navigation.

**Primary recommendation:** Scaffold with `create-next-app@15`, immediately pin `tailwindcss@4.0.7`, copy fonts to `public/fonts/`, and establish all three providers (Lenis → Cursor → Animation) as the very first code written. Everything else hangs off this foundation.

---

<user_constraints>
## User Constraints (from project research — no CONTEXT.md exists for this phase)

### Locked Decisions
- Next.js 15.x (App Router) — v16 has Tailwind Turbopack bug
- Tailwind CSS 4.0.7 pinned — v4.1.x confirmed broken with Next.js Turbopack
- GSAP 3.14.x — all plugins free (no Club membership)
- `motion` package, import from `motion/react` — not `framer-motion`
- `lenis` package — not `@studio-freight/lenis`
- Lenis `autoRaf: false` + GSAP ticker integration
- Cursor position via GSAP `quickTo` — NEVER React state
- `useGSAP()` hook for all GSAP code (StrictMode safety)
- `@theme {}` in globals.css — no tailwind.config.ts
- Local fonts: `TestSohneBreit-Buch.otf` + `TestSohneBreit-Dreiviertelfett.otf` via `next/font/local`
- SVG logo at root: `LOGO VECTO SOURCE.svg`
- Palette: noir profond + or chaud + blanc cassé — no purple, no blue gradients
- Provider order: LenisProvider → CursorProvider → AnimationProvider

### Claude's Discretion
- Exact OKLCH values for palette tokens (within constraint of noir/or/crème)
- Timing function names and values in `@theme {}`
- Preloader animation style (logo + progress bar vs. logo + counter vs. logo + reveal)
- Navigation layout details (horizontal links, logo left vs. center, hamburger breakpoint)
- Spotlight implementation detail (CSS custom property vs. inline style on mousemove)
- IntersectionObserver threshold values for active section tracking

### Deferred Ideas (OUT OF SCOPE for Phase 1)
- Hero section content (Phase 2)
- Portfolio section (Phase 2)
- All section content (Phase 2+)
- Three.js / R3F (out of scope entirely per PROJECT.md)
- Dark mode toggle (explicitly excluded)
- Multiple horizontal scroll sections (explicitly excluded)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 15 App Router scaffolded with TypeScript, Tailwind v4, GSAP, Motion, Lenis | Standard Stack section; Installation commands |
| FOUND-02 | Design system: palette (noir + or + crème), typography (Söhne Breit), timing functions in `@theme {}` | Architecture Patterns — Tailwind v4 theme block |
| FOUND-03 | Premium fonts loaded via `next/font/local` with font-display swap and preload | Code Examples — next/font/local pattern |
| FOUND-04 | Lenis `autoRaf: false` + GSAP ticker drives RAF (single loop) | Code Examples — LenisProvider pattern |
| CURS-01 | Custom cursor replaces native cursor, circle with mix-blend-mode: difference | Code Examples — CustomCursor 4-layer pattern |
| CURS-02 | Follower with lag (lerp 0.08-0.12) via GSAP `quickTo` | Code Examples — quickTo follower setup |
| CURS-03 | Contextual cursor states: enlarges on cards, morphs on buttons, crosshair on configurator | Code Examples — CursorProvider variant + CSS |
| CURS-04 | Magnetic effect on CTAs within ~80px radius, spring return | Code Examples — useMagnetic hook |
| CURS-05 | Spotlight/torchlight on dark sections via radial gradient following mouse | Code Examples — spotlight CSS custom property |
| CURS-06 | Cursor hidden on mobile/touch via pointer: coarse detection | Code Examples — touch detection guard |
| NAV-01 | Fixed navigation with active section state from scroll position | Code Examples — Navigation with IntersectionObserver |
| NAV-02 | Preloader (logo + progress) masks initial load, exits in < 3 seconds | Code Examples — Preloader component |
| NAV-03 | AnimationProvider gates entrance animations until preloader completes | Code Examples — AnimationProvider + useAnimation hook |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.2.4 | React framework, App Router, API routes, image optimization | Stable line for 2026; v16 has Turbopack/Tailwind bug |
| react | 19.2.4 | UI rendering (ships with Next.js 15) | Current stable; required by Motion v12 |
| typescript | 5.x | Type safety | Mandatory — GSAP types, catches cursor/animation prop errors |
| tailwindcss | 4.0.7 (PINNED) | Utility-first CSS, @theme design tokens | CSS-first, no config file; PINNED to avoid Turbopack RangeError |
| @tailwindcss/postcss | 4.0.7 (PINNED) | PostCSS plugin for Next.js | Must match tailwindcss version exactly |

### Animation Layer
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | Scroll animations, complex timelines, cursor quickTo | All plugins free since Webflow; industry standard 60fps |
| @gsap/react | 2.1.2 | `useGSAP()` hook — StrictMode-safe GSAP in React | Required to prevent double-animation in Next.js StrictMode |
| motion | 12.38.0 | Page transitions, layout animations | Renamed from framer-motion; import from `motion/react` |
| lenis | 1.3.21 | Smooth scroll, GSAP ticker integration | Renamed from `@studio-freight/lenis`; one RAF loop |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest CLI | UI primitives (Dialog, etc.) for Phase 2+ | Init now, used actively from Phase 2 |
| lucide-react | latest | Icons for navigation, UI elements | Default icon set for shadcn |

### What NOT to Install in Phase 1
| Package | Why Not |
|---------|---------|
| `framer-motion` | Dead package name — use `motion` |
| `@studio-freight/lenis` | Dead package name — use `lenis` |
| `tailwindcss@4.1.x` | Build-breaking Turbopack RangeError |
| `react-hook-form`, `zod`, `resend` | Phase 3 dependencies — don't install yet |
| `@react-three/fiber` | Out of scope per PROJECT.md |

### Installation (exact commands)

```bash
# 1. Scaffold
npx create-next-app@15 . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git

# 2. Pin Tailwind (critical — do this immediately after scaffold)
npm install tailwindcss@4.0.7 @tailwindcss/postcss@4.0.7

# 3. Animation core
npm install gsap @gsap/react motion lenis

# 4. shadcn init (after Tailwind is confirmed working)
npx shadcn@latest init

# 5. Dev tooling
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
app/
├── layout.tsx              # Root: fonts, providers, nav, cursor, metadata
├── page.tsx                # Home page (placeholder for Phase 2 sections)
└── globals.css             # @theme tokens, base styles, cursor layers CSS

components/
├── providers/
│   ├── LenisProvider.tsx   # smooth scroll + GSAP ticker
│   ├── CursorProvider.tsx  # variant string context only
│   └── AnimationProvider.tsx  # preloader gate + isReady
├── cursor/
│   ├── CustomCursor.tsx    # 4-layer cursor (dot, ring, follower, spotlight)
│   └── MagneticButton.tsx  # magnetic effect wrapper
├── navigation/
│   └── Navigation.tsx      # fixed nav, IntersectionObserver active state
└── ui/
    └── Preloader.tsx       # loading animation, gates AnimationProvider

lib/
├── gsapConfig.ts           # plugin registration (ScrollTrigger, SplitText, Flip)
└── utils.ts                # cn() helper

public/
└── fonts/
    ├── TestSohneBreit-Buch.otf
    └── TestSohneBreit-Dreiviertelfett.otf
```

### Pattern 1: Tailwind v4 `@theme {}` Block

All design tokens defined once in CSS. No JS config file.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand Palette — OKLCH (perceptually uniform, CSS-native) */
  --color-brand-black:     oklch(0.10 0.008 250);
  --color-brand-charcoal:  oklch(0.18 0.008 250);
  --color-brand-gold:      oklch(0.72 0.14 82);
  --color-brand-gold-light: oklch(0.82 0.12 82);
  --color-brand-cream:     oklch(0.96 0.012 88);
  --color-brand-muted:     oklch(0.45 0.010 250);

  /* Typography */
  --font-display: "TestSohneBreit", "Söhne Breit", system-ui, sans-serif;
  --font-body: "TestSohneBreit", "Söhne Breit", system-ui, sans-serif;

  /* Custom easing — referenced in GSAP as CSS vars or duplicated in lib/animations.ts */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-inout-smooth: cubic-bezier(0.87, 0, 0.13, 1);

  /* Spacing scale additions */
  --spacing-section: 8rem;    /* inter-section vertical gap */
}

/* Cursor layers — always on top, never capture events */
.cursor-dot,
.cursor-ring,
.cursor-follower,
.cursor-spotlight {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  will-change: transform;
}

/* Hide native cursor when custom is active */
body.cursor-active * {
  cursor: none !important;
}
```

### Pattern 2: `next/font/local` — Söhne Breit

Font files live in `public/fonts/`. `next/font/local` generates optimal `<link rel="preload">` and inlines the `@font-face` at build time.

```typescript
// app/layout.tsx
import localFont from "next/font/local";

const sohneBreit = localFont({
  src: [
    {
      path: "../../public/fonts/TestSohneBreit-Buch.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TestSohneBreit-Dreiviertelfett.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sohne-breit",
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sohneBreit.variable}>
      <body className="bg-brand-black text-brand-cream font-display antialiased">
        {/* providers wrap here */}
        {children}
      </body>
    </html>
  );
}
```

The CSS variable `--font-sohne-breit` is then referenced in `@theme {}`:
```css
@theme {
  --font-display: var(--font-sohne-breit), system-ui, sans-serif;
  --font-body: var(--font-sohne-breit), system-ui, sans-serif;
}
```

### Pattern 3: GSAP Plugin Registration

Centralized in `lib/gsapConfig.ts`, called once in layout. Prevents double-registration across hot reloads.

```typescript
// lib/gsapConfig.ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

let registered = false;

export function registerGSAPPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  registered = true;
}
```

### Pattern 4: LenisProvider with GSAP Ticker Integration

`autoRaf: false` is mandatory. GSAP ticker becomes the sole RAF loop.

```typescript
// components/providers/LenisProvider.tsx
"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAPPlugins } from "@/lib/gsapConfig";

registerGSAPPlugins();

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,         // CRITICAL — GSAP ticker drives this
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker drives Lenis — ONE loop, not two
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);   // Prevent GSAP throttle causing scroll stutter

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
```

### Pattern 5: CursorProvider — Variant Only, Never Position

Context carries only a semantic variant string. Position is managed entirely by GSAP in `CustomCursor.tsx`.

```typescript
// components/providers/CursorProvider.tsx
"use client";
import { createContext, useContext, useState, useCallback } from "react";

export type CursorVariant =
  | "default"
  | "hover"
  | "view"       // portfolio card hover — enlarges with "Voir" text
  | "drag"       // carousel — shows drag indicator
  | "crosshair"  // configurator canvas
  | "text"       // text selection areas
  | "hidden";    // explicit hide

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (v: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextValue>({
  variant: "default",
  setVariant: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<CursorVariant>("default");

  const setVariant = useCallback((v: CursorVariant) => {
    setVariantState(v);
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {children}
    </CursorContext.Provider>
  );
}
```

### Pattern 6: CustomCursor — 4-Layer Implementation

Position via GSAP `quickTo`. Variant string drives CSS class switches only.

```typescript
// components/cursor/CustomCursor.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCursor } from "@/components/providers/CursorProvider";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { variant } = useCursor();

  useEffect(() => {
    // Touch device bail-out — coarse pointer = touch screen
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const follower = followerRef.current!;

    document.body.classList.add("cursor-active");

    // quickTo: direct DOM writes at 60fps, zero React involvement
    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.2, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.2, ease: "power3.out" });
    // Follower: slower ease = visible lag (lerp effect)
    const moveFollowerX = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power2.out" });
    const moveFollowerY = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
      moveFollowerX(e.clientX);
      moveFollowerY(e.clientY);

      // Spotlight layer — CSS custom property for radial gradient position
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--x", `${e.clientX}px`);
        spotlightRef.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  // Variant → scale/opacity transforms (CSS class changes, not position)
  const variantClasses = {
    default: "",
    hover: "scale-150",
    view: "scale-[3] opacity-80",
    drag: "scale-[2]",
    crosshair: "scale-75 rotate-45",
    text: "scale-[0.4] opacity-60",
    hidden: "opacity-0 scale-0",
  };

  return (
    <>
      {/* Layer 1: Dot — follows cursor precisely */}
      <div
        ref={dotRef}
        className={`cursor-dot w-2 h-2 -translate-x-1/2 -translate-y-1/2
          bg-brand-cream rounded-full mix-blend-difference
          transition-transform duration-200
          ${variantClasses[variant]}`}
      />
      {/* Layer 2: Ring — slightly slower, tracks with slight delay */}
      <div
        ref={ringRef}
        className={`cursor-ring w-8 h-8 -translate-x-1/2 -translate-y-1/2
          border border-brand-cream rounded-full mix-blend-difference
          transition-all duration-300`}
      />
      {/* Layer 3: Follower — visible lag creates depth feel */}
      <div
        ref={followerRef}
        className={`cursor-follower w-12 h-12 -translate-x-1/2 -translate-y-1/2
          border border-brand-gold/30 rounded-full
          transition-all duration-300
          ${variantClasses[variant]}`}
      />
      {/* Layer 4: Spotlight — radial gradient reveals texture on dark sections */}
      <div
        ref={spotlightRef}
        className="cursor-spotlight w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2
          rounded-full opacity-0 pointer-events-none
          [background:radial-gradient(circle,oklch(0.72_0.14_82/0.08)_0%,transparent_70%)]
          [left:var(--x)] [top:var(--y)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
```

### Pattern 7: useMagnetic Hook

Magnetic effect via GSAP. Clamp maximum displacement to prevent extreme jumps.

```typescript
// hooks/useMagnetic.ts
"use client";
import { useRef, useCallback } from "react";
import { gsap } from "gsap";

interface MagneticOptions {
  strength?: number;  // displacement strength (default: 0.4)
  radius?: number;    // activation radius in px (default: 80)
}

export function useMagnetic({ strength = 0.4, radius = 80 }: MagneticOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);

  const onMouseEnter = useCallback(() => {
    bounds.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || !bounds.current) return;
    const { left, top, width, height } = bounds.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);

    if (dist < radius) {
      gsap.to(ref.current, {
        x: distX * strength,
        y: distY * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [strength, radius]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  return { ref, onMouseEnter, onMouseMove, onMouseLeave };
}
```

```typescript
// components/cursor/MagneticButton.tsx
"use client";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursor } from "@/components/providers/CursorProvider";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  const { ref, onMouseEnter, onMouseMove, onMouseLeave } = useMagnetic();
  const { setVariant } = useCursor();

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        onMouseEnter();
        setVariant("hover");
      }}
      onMouseMove={(e) => onMouseMove(e.nativeEvent)}
      onMouseLeave={(e) => {
        onMouseLeave();
        setVariant("default");
      }}
    >
      {children}
    </button>
  );
}
```

### Pattern 8: AnimationProvider + Preloader Gate

`isReady` flag is false until preloader signals completion. All entrance animations in Phase 2+ check this flag.

```typescript
// components/providers/AnimationProvider.tsx
"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { Preloader } from "@/components/ui/Preloader";

interface AnimationContextValue {
  isReady: boolean;
  onPreloaderComplete: () => void;
}

const AnimationContext = createContext<AnimationContextValue>({
  isReady: false,
  onPreloaderComplete: () => {},
});

export function useAnimation() {
  return useContext(AnimationContext);
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const onPreloaderComplete = useCallback(() => {
    setIsReady(true);
    // Small delay lets preloader exit animation complete before removing from DOM
    setTimeout(() => setShowPreloader(false), 800);
  }, []);

  return (
    <AnimationContext.Provider value={{ isReady, onPreloaderComplete }}>
      {showPreloader && <Preloader onComplete={onPreloaderComplete} />}
      {children}
    </AnimationContext.Provider>
  );
}
```

```typescript
// components/ui/Preloader.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

interface PreloaderProps {
  onComplete: () => void;
}

const MAX_DURATION_MS = 2800; // Hard cap — never block longer than this

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const hasCompleted = useRef(false);

  const complete = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;

    if (!containerRef.current) { onComplete(); return; }

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete,
    });
  };

  useGSAP(() => {
    // Hard timeout: always exit before 3s regardless of asset loading
    const timeout = setTimeout(complete, MAX_DURATION_MS);

    // Animate progress bar from 0 to 100
    gsap.to(progressRef, {
      current: 100,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate: function () {
        const bar = containerRef.current?.querySelector<HTMLDivElement>(".progress-bar");
        if (bar) bar.style.width = `${progressRef.current}%`;
      },
      onComplete: () => {
        clearTimeout(timeout);
        // Slight pause at 100% before exiting
        setTimeout(complete, 200);
      },
    });

    return () => clearTimeout(timeout);
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-brand-black flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <div className="mb-12 opacity-0 animate-[fadeInUp_0.6s_ease_0.2s_forwards]">
        <Image
          src="/LOGO VECTO SOURCE.svg"
          alt="Maje Concept"
          width={160}
          height={48}
          priority
        />
      </div>

      {/* Progress bar */}
      <div className="w-48 h-px bg-brand-charcoal overflow-hidden">
        <div className="progress-bar h-full bg-brand-gold w-0 transition-none" />
      </div>
    </div>
  );
}
```

### Pattern 9: Navigation with IntersectionObserver Active Section Tracking

```typescript
// components/navigation/Navigation.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Réalisations", href: "#realisations", sectionId: "realisations" },
  { label: "Expertises", href: "#expertises", sectionId: "expertises" },
  { label: "Configurateur", href: "#configurateur", sectionId: "configurateur" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Track scroll depth for background opacity
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver — 50% of section visible = active
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-80px 0px -40% 0px" }
    );

    NAV_LINKS.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        "flex items-center justify-between px-8 py-5",
        scrolled
          ? "bg-brand-black/80 backdrop-blur-md border-b border-brand-charcoal"
          : "bg-transparent"
      )}
    >
      <Link href="/" className="flex items-center">
        <Image
          src="/LOGO VECTO SOURCE.svg"
          alt="Maje Concept"
          width={120}
          height={36}
          priority
        />
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href, sectionId }) => (
          <li key={sectionId}>
            <a
              href={href}
              className={cn(
                "text-sm tracking-widest uppercase transition-colors duration-200",
                activeSection === sectionId
                  ? "text-brand-gold"
                  : "text-brand-cream/60 hover:text-brand-cream"
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile: hamburger placeholder for Phase 4 */}
      <button className="md:hidden text-brand-cream" aria-label="Menu">
        <span className="block w-6 h-px bg-current mb-1.5" />
        <span className="block w-4 h-px bg-current mb-1.5" />
        <span className="block w-5 h-px bg-current" />
      </button>
    </nav>
  );
}
```

### Anti-Patterns to Avoid

- **Cursor position in useState:** Triggers full React tree re-render on every mousemove = 60fps re-renders = CPU spike = janky cursor. GSAP `quickTo` writes directly to the DOM transform, bypassing React entirely.
- **Lenis with `autoRaf: true` alongside GSAP ticker:** Creates two competing RAF loops. Symptoms: wobbly scroll, ScrollTrigger fires at wrong positions, frame drops.
- **GSAP in `useEffect` instead of `useGSAP`:** React 18+ StrictMode mounts twice in development. `useEffect` animations fire twice, creating duplicate ScrollTriggers. `useGSAP` handles this automatically.
- **`tailwind.config.ts` for v4 tokens:** The file is silently ignored in Tailwind v4. All tokens must be in `@theme {}` in CSS.
- **Importing `framer-motion`:** Package is renamed to `motion`. Both technically install, but `framer-motion` receives no updates. Start correctly.
- **`window` access in Server Component:** Next.js App Router server-renders components. Any `window`/`document` access outside `useEffect`/`useGSAP` crashes the build.
- **Preloader that blocks DOM rendering:** Preloader must be a visual overlay that sits above already-rendered HTML. It is cosmetic — it hides FOUT and orchestrates entrance timing, not a content gate.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| React-safe GSAP cleanup | Custom useEffect with manual kill() calls | `useGSAP()` from `@gsap/react` | Handles StrictMode, auto-reverts ScrollTrigger, tested by GSAP team |
| CSS class merge utility | Custom function | `cn()` from `clsx` + `tailwind-merge` | Handles Tailwind class conflicts (`cn` is the shadcn standard) |
| Font loading optimization | Manual `@font-face` in CSS | `next/font/local` | Generates `<link rel="preload">`, inlines `@font-face`, zero external requests |
| Smooth scroll | Custom momentum scroll via touch events | `lenis` | Edge cases: overscroll, elastic scroll, momentum physics, accessibility |
| Animation cleanup on unmount | Tracking ScrollTrigger refs manually | `useGSAP()` scope | `useGSAP` kills all instances in scope on unmount automatically |
| Image optimization | `<img>` tags with manual srcSet | `next/image` | WebP/AVIF negotiation, responsive srcSet, lazy loading, priority preload |

---

## Common Pitfalls

### Pitfall 1: Tailwind v4.1.x Turbopack RangeError
**What goes wrong:** Build fails immediately with `RangeError: Invalid code point` — no stacktrace points to your code, confusing to diagnose.
**Why it happens:** Confirmed upstream bug in Tailwind v4.1.x with Next.js Turbopack bundler. Not fixed as of 2026-03-28.
**How to avoid:** Run `npm install tailwindcss@4.0.7 @tailwindcss/postcss@4.0.7` immediately after `create-next-app`. Add `"tailwindcss": "4.0.7"` to `package.json` resolutions to prevent accidental upgrade.
**Warning signs:** Error appears during `npm run build` or `npm run dev`, mentions `RangeError` or code point.

### Pitfall 2: Cursor Variant Triggers Re-render on Every Mouse Pixel
**What goes wrong:** Moving the mouse causes `setVariant` to fire hundreds of times per second if wired incorrectly to `onMouseMove`. Every call re-renders the cursor component.
**Why it happens:** Variant should only change when crossing an element boundary (mouseenter/mouseleave), not on every pixel of movement.
**How to avoid:** Wire `setVariant` only to `onMouseEnter`/`onMouseLeave` on interactive elements via `data-cursor` attributes. Never call it inside a mousemove handler.
**Warning signs:** React DevTools shows CursorProvider re-rendering hundreds of times per second.

### Pitfall 3: Lenis `ScrollTrigger.update` Not Called on Scroll
**What goes wrong:** ScrollTrigger calculates trigger positions against native browser scroll position, but Lenis intercepts scroll events. Triggers fire at wrong positions, sections animate too early or too late.
**Why it happens:** GSAP ScrollTrigger doesn't know Lenis is active unless explicitly notified.
**How to avoid:** `lenis.on('scroll', ScrollTrigger.update)` in LenisProvider setup. This line is mandatory.
**Warning signs:** ScrollTrigger animations fire at visually incorrect positions on the page.

### Pitfall 4: Missing `"use client"` on Provider Files
**What goes wrong:** Build error: "You're importing a component that needs... It only works in a Client Component but none of its parents are marked with 'use client'."
**Why it happens:** Next.js App Router defaults to Server Components. Any component that uses `useState`, `useEffect`, `useRef`, or browser APIs must be a Client Component.
**How to avoid:** Every file in `components/providers/`, `components/cursor/`, and any component using React hooks or GSAP must have `"use client"` as the first line.
**Warning signs:** Build error mentioning `useState`, `useRef`, or `window` in a Server Component.

### Pitfall 5: Font CSS Variable Not Connected to @theme
**What goes wrong:** `next/font/local` generates a CSS variable (e.g., `--font-sohne-breit`) but Tailwind doesn't know about it unless referenced in `@theme {}`.
**Why it happens:** `next/font/local` creates the variable; `@theme` in globals.css consumes it. Skipping one half of this breaks the font system.
**How to avoid:** In `globals.css`, set `--font-display: var(--font-sohne-breit), fallbacks` inside `@theme {}`. The `variable: "--font-sohne-breit"` option in `localFont()` must match exactly.
**Warning signs:** Custom font not appearing despite no console errors; system font renders instead.

### Pitfall 6: GSAP `quickTo` Created Outside `useEffect`
**What goes wrong:** During SSR, `gsap.quickTo` is called before the DOM exists. Build fails or hydration errors in production.
**Why it happens:** `gsap.quickTo` requires DOM element refs which are only available after mount.
**How to avoid:** All `gsap.quickTo` setup must be inside `useEffect` (or `useGSAP`). Guard with `if (!dotRef.current) return`.
**Warning signs:** `TypeError: Cannot read properties of null` at build time.

---

## Code Examples

### Complete globals.css starting point

```css
@import "tailwindcss";

@theme {
  /* Palette */
  --color-brand-black:      oklch(0.10 0.008 250);
  --color-brand-charcoal:   oklch(0.18 0.008 250);
  --color-brand-gold:       oklch(0.72 0.14  82);
  --color-brand-gold-light: oklch(0.82 0.12  82);
  --color-brand-cream:      oklch(0.96 0.012 88);
  --color-brand-muted:      oklch(0.45 0.010 250);

  /* Typography — CSS var set by next/font/local in layout.tsx */
  --font-display: var(--font-sohne-breit), system-ui, sans-serif;
  --font-body:    var(--font-sohne-breit), system-ui, sans-serif;

  /* Custom easing */
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.30, 1);
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.50, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-inout-smooth: cubic-bezier(0.87, 0, 0.13, 1);

  /* Z-index scale */
  --z-cursor:     9999;
  --z-preloader: 10000;
  --z-nav:         100;
}

/* Cursor layer base — always above everything, never captures events */
.cursor-dot,
.cursor-ring,
.cursor-follower,
.cursor-spotlight {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-cursor);
  will-change: transform;
  backface-visibility: hidden;
}

/* Hide native cursor site-wide when custom cursor is active */
body.cursor-active,
body.cursor-active * {
  cursor: none !important;
}

/* Entrance animation keyframe used by preloader logo */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### lib/utils.ts (cn helper)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Note: `clsx` and `tailwind-merge` are installed automatically by `npx shadcn@latest init`. If shadcn init is deferred, install manually: `npm install clsx tailwind-merge`.

### Connecting LenisProvider scroll to a section anchor click

```typescript
// How to smooth-scroll to a section via Lenis (not native scrollTo)
import { useLenis } from "@/components/providers/LenisProvider";

function NavLink({ sectionId }: { sectionId: string }) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el && lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  };

  return <a href={`#${sectionId}`} onClick={handleClick}>...</a>;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package — `import { motion } from 'motion/react'` | 2025 | Must use new package name or miss all updates |
| `@studio-freight/lenis` | `lenis` package | 2024 | Old package is unmaintained |
| `gsap-trial` for premium plugins | `gsap` (all plugins free) | 2024 (Webflow acquisition) | No more Club membership; SplitText/Flip/MorphSVG all free |
| `tailwind.config.ts` for theming | `@theme {}` in CSS | Tailwind v4 (Jan 2025) | Config file is ignored; tokens go in CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 | Single import replaces three directives |
| R3F v8 for React 18 | R3F v9 for React 19 | 2025 | Must match major versions |

**Deprecated/outdated in this stack:**
- `postcss-import` + PostCSS config for Tailwind v3: replaced by `@tailwindcss/postcss` plugin
- `next.config.js` experimental font optimization flags: now built-in, no config needed
- Manual `ScrollTrigger.refresh()` calls: `lenis.on('scroll', ScrollTrigger.update)` handles this

---

## Open Questions

1. **Font fallback metric matching**
   - What we know: Söhne Breit will cause CLS if fallback metrics differ significantly from the OTF file
   - What's unclear: Exact ascender/descender metrics of TestSohneBreit for `size-adjust` CSS property
   - Recommendation: Run the preloader for 1.5s minimum to cover the font swap window; use `display: 'swap'` which is non-blocking

2. **Logo SVG color compatibility with dark background**
   - What we know: `LOGO VECTO SOURCE.svg` exists at project root but internal colors are unknown
   - What's unclear: Whether the SVG uses hardcoded dark colors (invisible on dark bg) or uses `currentColor`
   - Recommendation: Inspect the SVG before implementing the preloader. May need to add `fill="currentColor"` or a white/cream variant.

3. **Spotlight layer performance on lower-end hardware**
   - What we know: `radial-gradient` repaints can cause compositing issues on integrated graphics
   - What's unclear: Whether `will-change: transform` is sufficient or whether `transform: translateZ(0)` force-promotion is needed
   - Recommendation: Implement, test on a budget device, and add `transform: translateZ(0)` to the spotlight layer if repaints are detected in Chrome DevTools layers panel.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All npm commands | Yes | v25.8.2 | — |
| npm | Package management | Yes | 11.11.1 | — |
| npx | create-next-app, shadcn | Yes | 11.11.1 | — |
| git | Version control | Yes (repo exists) | — | — |
| TestSohneBreit-Buch.otf | FOUND-03 | Yes (at project root) | — | Copy to public/fonts/ before use |
| TestSohneBreit-Dreiviertelfett.otf | FOUND-03 | Yes (at project root) | — | Copy to public/fonts/ before use |
| LOGO VECTO SOURCE.svg | NAV-02 (preloader), NAV-01 (nav) | Yes (at project root) | — | Copy to public/ before use |

**Missing dependencies:** None. All required dependencies are available or installable.

**Note on font files:** Both `.otf` files are at the workspace root (`/CLAUDE/MAJE-WEBSITE/`), not inside the Next.js project directory yet. The scaffold step creates the project; the first task after scaffold must copy these files to `<project>/public/fonts/` before `next/font/local` can reference them. Same for the SVG logo — it must be copied to `<project>/public/`.

---

## Sources

### Primary (HIGH confidence)
- Project research artifacts: `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md` — all verified against npm and official docs
- Tailwind v4.1 Turbopack bug: https://github.com/tailwindlabs/tailwindcss/discussions/19556
- GSAP npm (v3.14.2 confirmed): https://www.npmjs.com/package/gsap
- @gsap/react npm (v2.1.2 confirmed): https://www.npmjs.com/package/@gsap/react
- lenis npm (v1.3.21, renamed): https://www.npmjs.com/package/lenis
- motion npm (v12.38.0, renamed from framer-motion): https://www.npmjs.com/package/motion
- next/font official docs: https://nextjs.org/docs/app/getting-started/fonts

### Secondary (MEDIUM confidence)
- GSAP + Next.js 2025 setup patterns (useGSAP, cleanup): https://javascript.plainenglish.io/setting-up-gsap-with-next-js-2025-edition-bcb86e48eab6
- Lenis + GSAP scroll proxy pattern: https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap
- shadcn Tailwind v4 compatibility: https://ui.shadcn.com/docs/tailwind-v4

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry in prior research
- Architecture: HIGH — patterns derived from official library docs and cross-project consensus in research artifacts
- Pitfalls: HIGH — all pitfalls are reproducible, documented in multiple sources, verified against official docs
- Code examples: HIGH — patterns are canonical for the libraries used; minor adaptation may be needed based on final scaffold output

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (30 days; Tailwind pin situation may resolve sooner — check the GitHub discussion before upgrading)
