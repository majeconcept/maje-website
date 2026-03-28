# Phase 2: Sections Principales — Research

**Researched:** 2026-03-28
**Domain:** GSAP animation patterns — SplitText, ScrollTrigger, Flip, infinite carousel, Motion lightbox
**Confidence:** HIGH (GSAP official docs + verified community patterns)

---

## Summary

Phase 2 builds all content sections of the Maje Concept showcase site. The foundational infrastructure from Phase 1 is complete: GSAP plugins are registered (ScrollTrigger, SplitText, Flip), Lenis smooth scroll drives the single RAF loop, AnimationProvider gates entrance animations behind `isReady`, CursorProvider holds cursor variant state. Phase 2 plugs content into this infrastructure.

The seven animation patterns required are all well-established in GSAP 3.14.x (all plugins free since Webflow acquisition). SplitText received a major overhaul in 3.13+ with 14 new features including `autoSplit`, `mask`, and the `onSplit` callback — the new API is significantly cleaner than older documentation describes. GSAP Flip's filter pattern is the canonical solution for portfolio category filtering. Motion (formerly framer-motion) `AnimatePresence` is the correct tool for the lightbox, as it handles exit animations that React cannot natively animate.

**Primary recommendation:** Use `SplitText.create()` new API (not `new SplitText()` old API) with `mask: "lines"` for hero reveal. Use `Flip.getState()` + DOM mutation + `Flip.from()` for portfolio filter. Use `motion/react` `AnimatePresence` for lightbox. All counter animations via GSAP tween on proxy object with `onUpdate`. Logo carousel via `gsap.ticker.add()` for frame-perfect speed control.

---

<user_constraints>
## User Constraints (from Phase 1 CONTEXT.md)

### Locked Decisions
- GSAP 3.14.x — SplitText, ScrollTrigger, Flip all free, already installed
- `useGSAP()` for ALL GSAP code — never `useEffect` for GSAP
- `isReady` gate: every section checks `useAnimation().isReady` before entrance animations
- `motion` package (not `framer-motion`) — import from `motion/react`
- Lenis `autoRaf: false` + GSAP ticker drives RAF — do not modify LenisProvider
- Tailwind 4.0.7 pinned — `@theme {}` tokens in globals.css, no tailwind.config.ts
- Cursor position never in React state — only `variant` string via CursorProvider
- No WebGL/Three.js — parallax via GSAP + CSS transforms only
- Local Söhne Breit fonts via `next/font/local` — already loaded in layout.tsx
- `cn()` from `@/lib/utils` for class merging

### Claude's Discretion
- Portfolio layout: masonry vs asymmetric grid — choose what looks most premium
- Number of portfolio projects: minimum 6, fictitious but credible content
- Testimonial layout: carrousel vs bento — research which fits better with dense aesthetic
- Exact stagger timing within the 0.08s baseline from Phase 1 motion language
- Section ordering: hero → portfolio → expertises → social proof (proposed)

### Deferred Ideas (OUT OF SCOPE for Phase 2)
- Configurateur produit SVG (Phase 3)
- Formulaire de contact + Resend (Phase 3)
- Footer (Phase 3)
- SEO metadata / JSON-LD / sitemap (Phase 4)
- Responsive polish / CWV audit (Phase 4)
- WebGL/Three.js particle backgrounds (out of scope entirely)
- Multiple horizontal scroll sections (out of scope entirely)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Hero: titre animé ligne par ligne via GSAP SplitText | `SplitText.create()` new API with `mask: "lines"`, `onSplit` callback, `autoSplit: true` |
| HERO-02 | Hero: éléments en séquence orchestrée (staggered reveals) | GSAP timeline with stagger 0.08s, ScrollTrigger `once: true` gated by `isReady` |
| HERO-03 | Hero: parallax multi-couches scroll + souris (depth 0.1–0.5) | ScrollTrigger `scrub` for scroll parallax + `gsap.quickTo` for mousemove parallax |
| HERO-04 | Hero: 2 CTAs (configurateur + contact) | `MagneticButton` reuse from Phase 1 — already built |
| PORT-01 | Portfolio: grille masonry 6+ projets avec titre/description/secteur | CSS Grid asymétrique + project data array, colored rect placeholders |
| PORT-02 | Portfolio: hover effects riches (zoom + overlay) | CSS transforms + GSAP `to()` on mouseenter/mouseleave with `setVariant("view")` |
| PORT-03 | Portfolio: filtres catégorie avec animation fluide GSAP Flip | `Flip.getState()` → DOM mutation (show/hide) → `Flip.from(state)` |
| PORT-04 | Portfolio: lightbox immersive navigable | Motion `AnimatePresence` overlay, keyboard `ArrowLeft`/`ArrowRight`/`Escape` |
| EXPT-01 | Expertises: icônes SVG custom + descriptions | Inline SVG components in `components/icons/`, not external libraries |
| EXPT-02 | Expertises: animations scroll-triggered GSAP ScrollTrigger | `start: "top 80%"`, `once: true`, stagger 0.08s on grid items |
| EXPT-03 | Expertises: compteurs KPI animés à l'intersection | GSAP proxy object `{ val: 0 }` tweened + `onUpdate` writes to DOM, ScrollTrigger `once: true` |
| SOCL-01 | Social Proof: carrousel logos 8+ infini scroll horizontal | GSAP ticker loop, duplicate DOM elements, pause/resume on hover |
| SOCL-02 | Social Proof: témoignages carrousel premium ou layout bento | Motion-animated carousel or static bento grid with entrance animations |
| SOCL-03 | Social Proof: statistiques animées au scroll | Same counter pattern as EXPT-03 |
| ANIM-01 | Toutes sections: scroll-triggered animations GSAP ScrollTrigger | `start: "top 80%"`, `once: true`, `y: 60 → 0`, `opacity: 0 → 1` standard pattern |
| ANIM-02 | Micro-interactions sur tous éléments interactifs (hover/focus) | CSS `transition` + GSAP on hover, visible `:focus-visible` ring, `data-cursor` attributes |
</phase_requirements>

---

## Standard Stack

### Core (already installed — no new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | All scroll, split, flip, counter animations | Already installed; SplitText, ScrollTrigger, Flip free since 3.13 |
| @gsap/react | 2.1.2 | `useGSAP()` hook — StrictMode safe | Already installed; mandatory for all GSAP in React |
| motion | 12.38.0 | Lightbox AnimatePresence, layout transitions | Already installed; `motion/react` import |
| lenis | 1.3.21 | Smooth scroll — RAF driver | Already installed; drives GSAP ScrollTrigger |

### No new packages required for Phase 2.

All animation libraries needed are already in `package.json`. The lightbox uses `motion/react` `AnimatePresence` which is already installed. No additional UI libraries are needed — shadcn/ui Dialog could be used for lightbox but `AnimatePresence` gives more animation control at zero extra cost.

---

## Architecture Patterns

### Recommended Section File Structure (Phase 2 additions)

```
src/
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx        # HERO-01 through HERO-04
│   │   ├── PortfolioSection.tsx   # PORT-01 through PORT-04
│   │   ├── ExpertiseSection.tsx   # EXPT-01 through EXPT-03
│   │   └── SocialProofSection.tsx # SOCL-01 through SOCL-03
│   ├── ui/
│   │   ├── AnimatedCounter.tsx    # EXPT-03, SOCL-03 (reusable)
│   │   ├── LogoCarousel.tsx       # SOCL-01
│   │   └── Lightbox.tsx           # PORT-04
│   └── icons/
│       ├── IconSerigraphie.tsx    # Custom SVG
│       ├── IconBroderie.tsx
│       ├── IconDTF.tsx
│       └── IconFlocage.tsx
├── data/
│   ├── portfolio.ts               # Project data array (fictitious but credible)
│   ├── expertise.ts               # Expertise domains + KPI data
│   └── social-proof.ts            # Logos + testimonials data
└── app/
    └── page.tsx                   # Compose all sections with correct IDs
```

### Universal Entrance Animation Pattern

All scroll-triggered entrances follow this exact pattern. Do not deviate.

```typescript
// Source: Phase 1 CONTEXT.md + GSAP ScrollTrigger docs
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useAnimation } from "@/components/providers/AnimationProvider"

export function SomeSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return
    gsap.from(".animate-in", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    })
  }, { scope: containerRef, dependencies: [isReady] })

  return <section ref={containerRef}>...</section>
}
```

**Critical rules:**
- `if (!isReady) return` — always first line inside `useGSAP`
- `{ scope: containerRef }` — scopes selectors to this section, prevents cross-section selector collisions
- `{ dependencies: [isReady] }` — re-runs when `isReady` flips `false → true`
- `once: true` — entrance plays once, no reverse on scroll-up
- `start: "top 80%"` — fires when top of section enters bottom 20% of viewport

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text line reveal animation | Custom CSS clip-path keyframes | `SplitText.create()` with `mask: "lines"` | Handles font loading timing, responsive re-split, accessibility |
| Filter layout transitions | CSS transition on grid items | `Flip.getState()` + `Flip.from()` | Handles position changes across DOM mutations correctly — CSS transitions break when items reorder |
| Lightbox exit animation | `display: none` toggle | `AnimatePresence` from `motion/react` | React cannot animate components being removed from DOM — AnimatePresence keeps element mounted during exit |
| Smooth number count-up | `setInterval` + state | GSAP proxy object + `onUpdate` | GSAP's RAF-synced timing is frame-perfect and GPU-friendly; setInterval is not frame-synced |
| Infinite horizontal loop | `setInterval` + `translateX` | GSAP ticker loop with DOM duplication | GSAP ticker is synchronized with the RAF loop driving Lenis — CSS animations run independently and can drift |
| Cursor-following parallax | `addEventListener('mousemove', ...)` with `setState` | `gsap.quickTo()` | quickTo creates a cached setter — no new tween object per frame, no React state, 60fps guaranteed |

**Key insight:** Every "hand-roll" option above produces either janky animation (setInterval, setState) or breaks on edge cases (CSS transitions for reordering, display:none for exit animations). GSAP and Motion exist precisely because these edge cases accumulate into production bugs.

---

## Code Examples

### Pattern 1: GSAP SplitText Hero Animation (lines, mask, stagger from below)

```typescript
// Source: GSAP SplitText docs — https://gsap.com/docs/v3/Plugins/SplitText/
// New API (GSAP 3.13+): SplitText.create() — not new SplitText()
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import { useAnimation } from "@/components/providers/AnimationProvider"

export function HeroTitle({ text }: { text: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return
    if (!titleRef.current) return

    // SplitText.create() new API — receives instance in onSplit callback
    // mask: "lines" wraps each line in a clip container for reveal effect
    // autoSplit: true re-splits on font load and container resize
    SplitText.create(titleRef.current, {
      type: "lines",
      mask: "lines",      // clip container per line — enables yPercent reveal
      autoSplit: true,    // re-splits when fonts load or container resizes
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 100,   // starts below the mask clip boundary (hidden)
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            once: true,
          },
          onComplete: () => self.revert(), // restore original DOM after animation
        })
      },
    })
  }, { scope: titleRef, dependencies: [isReady] })

  return (
    <h1 ref={titleRef} className="font-display text-7xl text-brand-cream leading-none">
      {text}
    </h1>
  )
}
```

**Notes:**
- `mask: "lines"` is the key for a clean reveal — without it, lines animate from below but are visible outside their line bounds
- `yPercent: 100` moves the line entirely below its clip boundary
- `onComplete: () => self.revert()` removes SplitText wrapper elements from DOM after animation, reducing rendering overhead
- `autoSplit: true` + `onSplit` callback handles font-loading races automatically

---

### Pattern 2: Parallax Hero — scroll-based (ScrollTrigger) + mousemove (quickTo)

```typescript
// Source: GSAP ScrollTrigger docs + quickTo API
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useAnimation } from "@/components/providers/AnimationProvider"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return

    // --- SCROLL-BASED PARALLAX ---
    // Each layer element has data-depth="0.1" through data-depth="0.5"
    // Higher depth = moves more on scroll (background moves less, foreground more)
    const layers = gsap.utils.toArray<HTMLElement>("[data-depth]")

    layers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth || "0.2")
      gsap.to(layer, {
        y: () => -(window.innerHeight * depth * 0.5), // move up as user scrolls
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,         // animate proportionally to scroll position
          invalidateOnRefresh: true, // recalculate on resize
        },
      })
    })

    // --- MOUSEMOVE-BASED PARALLAX ---
    // quickTo creates a cached setter — no new tween object per mousemove event
    const quickToSetters = layers.map((layer) => {
      const depth = parseFloat(layer.dataset.depth || "0.2")
      return {
        x: gsap.quickTo(layer, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(layer, "y", { duration: 0.8, ease: "power3.out" }),
        depth,
      }
    })

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx  // -1 to 1
      const dy = (e.clientY - cy) / cy  // -1 to 1

      quickToSetters.forEach(({ x, y, depth }) => {
        x(dx * 40 * depth)  // max 40px * depth factor
        y(dy * 20 * depth)  // max 20px * depth factor (vertical less pronounced)
      })
    }

    sectionRef.current?.addEventListener("mousemove", onMouseMove, { passive: true })

    return () => {
      sectionRef.current?.removeEventListener("mousemove", onMouseMove)
    }
  }, { scope: sectionRef, dependencies: [isReady] })

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background layer — slowest movement */}
      <div data-depth="0.1" className="absolute inset-0 ...">
        {/* Texture / grain overlay */}
      </div>
      {/* Mid layer */}
      <div data-depth="0.3" className="absolute ...">
        {/* Geometric accent / brand mark */}
      </div>
      {/* Foreground content — fastest movement */}
      <div data-depth="0.5" className="relative z-10 ...">
        {/* Hero title, subtitle, CTAs */}
      </div>
    </section>
  )
}
```

**Notes:**
- `scrub: true` (without a number) = animation progresses 1:1 with scroll, no lag
- `scrub: 0.5` = slight smoothing on scrub (use if desired, not mandatory)
- `invalidateOnRefresh: true` = recalculates `y` function on window resize
- `{ passive: true }` on mousemove = browser optimization, no `preventDefault` needed
- Scroll parallax and mouse parallax run on the same elements — they stack (GSAP handles both `x` and `y` independently)

---

### Pattern 3: Portfolio Masonry Grid with GSAP Flip Filter Transitions

```typescript
// Source: GSAP Flip docs — https://gsap.com/docs/v3/Plugins/Flip/
"use client"
import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"

const CATEGORIES = ["Tous", "Sérigraphie", "Broderie", "DTF", "Flocage"] as const
type Category = typeof CATEGORIES[number]

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<Category>("Tous")
  const gridRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)

  const handleFilter = (category: Category) => {
    if (isAnimating.current || category === activeFilter) return
    isAnimating.current = true

    const grid = gridRef.current
    if (!grid) return

    // Step 1: Capture state BEFORE any DOM changes
    const state = Flip.getState(grid.querySelectorAll("[data-flip-id]"))

    // Step 2: Mutate DOM — update visibility
    setActiveFilter(category)

    // Step 3: After React re-renders, animate from captured state to new positions
    // Use requestAnimationFrame to ensure React has committed the update
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.65,
        ease: "power2.inOut",
        stagger: 0.04,
        absolute: true,    // use absolute positioning during animation to prevent layout thrash
        onComplete: () => { isAnimating.current = false },
        onEnter: (elements) => gsap.fromTo(elements,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        ),
        onLeave: (elements) => gsap.to(elements,
          { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" }
        ),
      })
    })
  }

  return (
    <section id="realisations" className="...">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={cn(
              "px-4 py-2 text-sm tracking-widest uppercase transition-colors duration-200",
              activeFilter === cat
                ? "text-brand-gold border-b border-brand-gold"
                : "text-brand-muted hover:text-brand-cream"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — items conditionally rendered/hidden by activeFilter */}
      <div ref={gridRef} className="grid grid-cols-12 gap-4 auto-rows-[200px]">
        {PROJECTS.map((project) => {
          const visible = activeFilter === "Tous" || project.category === activeFilter
          return (
            <div
              key={project.id}
              data-flip-id={project.id}   // required: Flip tracks by this ID
              className={cn(
                "relative overflow-hidden cursor-none",
                project.colSpan,  // e.g. "col-span-5" for masonry asymmetry
                project.rowSpan,  // e.g. "row-span-2" for tall items
                !visible && "hidden"  // Flip handles the transition
              )}
            >
              {/* Project card content */}
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

**Notes:**
- `data-flip-id` is the unique identifier Flip uses to track elements across DOM mutations
- `isAnimating.current` guard prevents triggering a new filter during an ongoing animation
- `absolute: true` in `Flip.from()` prevents layout thrash during the animation
- `onEnter`/`onLeave` callbacks handle entering and exiting elements (filter reveals/hides)
- `requestAnimationFrame` after `setActiveFilter` ensures React has committed the DOM update before Flip reads new positions

---

### Pattern 4: Lightbox Component (keyboard navigable, Motion AnimatePresence)

```typescript
// Source: motion.dev docs — https://motion.dev/docs/react
// Import from motion/react — NOT framer-motion
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useCallback } from "react"

interface LightboxProps {
  projects: Project[]
  currentIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ projects, currentIndex, onClose, onNavigate }: LightboxProps) {
  const isOpen = currentIndex !== null

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    switch (e.key) {
      case "Escape":    onClose(); break
      case "ArrowRight": onNavigate(Math.min((currentIndex ?? 0) + 1, projects.length - 1)); break
      case "ArrowLeft":  onNavigate(Math.max((currentIndex ?? 0) - 1, 0)); break
    }
  }, [isOpen, currentIndex, projects.length, onClose, onNavigate])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    // AnimatePresence wraps the conditional — NOT inside it
    <AnimatePresence>
      {isOpen && currentIndex !== null && (
        // Direct child of AnimatePresence MUST have unique key
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[5000] bg-brand-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}  // click backdrop to close
        >
          {/* Inner content — stop propagation so clicking content doesn't close */}
          <motion.div
            key={`lightbox-content-${currentIndex}`}  // key changes on navigate = re-animates
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl w-full mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Project image placeholder */}
            <div
              className="w-full aspect-[16/9] rounded-sm"
              style={{ background: projects[currentIndex].color }}
            />

            {/* Project info */}
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="font-display text-2xl text-brand-cream">
                  {projects[currentIndex].title}
                </h3>
                <p className="text-brand-muted mt-1">{projects[currentIndex].category}</p>
              </div>
              {/* Navigation arrows */}
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate(Math.max(currentIndex - 1, 0))}
                  disabled={currentIndex === 0}
                  aria-label="Projet précédent"
                  className="text-brand-muted hover:text-brand-cream disabled:opacity-30 transition-colors"
                >
                  ←
                </button>
                <span className="text-brand-muted text-sm">
                  {currentIndex + 1} / {projects.length}
                </span>
                <button
                  onClick={() => onNavigate(Math.min(currentIndex + 1, projects.length - 1))}
                  disabled={currentIndex === projects.length - 1}
                  aria-label="Projet suivant"
                  className="text-brand-muted hover:text-brand-cream disabled:opacity-30 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Three rules for AnimatePresence to work:**
1. `AnimatePresence` wraps the conditional block — it is NOT inside the conditional
2. Every direct `motion.*` child of `AnimatePresence` has a unique `key`
3. `exit` prop is defined on the direct child

---

### Pattern 5: ScrollTrigger Counter Animation (KPI count-up)

```typescript
// Source: GSAP community pattern (codepen.io/grantsmith/pen/MWmGBWP verified)
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useAnimation } from "@/components/providers/AnimationProvider"

interface AnimatedCounterProps {
  target: number         // final value
  suffix?: string        // e.g. "+" or "%"
  label: string
  duration?: number      // seconds, default 2
}

export function AnimatedCounter({
  target,
  suffix = "",
  label,
  duration = 2,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLDivElement>(null)
  const displayRef = useRef<HTMLSpanElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return
    if (!displayRef.current) return

    // GSAP tweens a proxy object, not a DOM property
    // This avoids GSAP trying to parse formatted strings like "100+"
    const proxy = { val: 0 }

    gsap.to(proxy, {
      val: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: counterRef.current,
        start: "top 80%",
        once: true,     // fires only once
      },
      onUpdate: () => {
        if (displayRef.current) {
          // Math.round for integer display — remove for decimals
          displayRef.current.textContent = Math.round(proxy.val) + suffix
        }
      },
    })
  }, { scope: counterRef, dependencies: [isReady] })

  return (
    <div ref={counterRef} className="text-center">
      <div className="font-display text-5xl text-brand-gold">
        <span ref={displayRef}>0{suffix}</span>
      </div>
      <p className="text-brand-muted text-sm tracking-widest uppercase mt-2">{label}</p>
    </div>
  )
}

// Usage in ExpertiseSection:
// <AnimatedCounter target={12} suffix="+" label="Années d'expérience" />
// <AnimatedCounter target={850} suffix="+" label="Projets livrés" />
// <AnimatedCounter target={200} suffix="+" label="Clients actifs" />
// <AnimatedCounter target={98} suffix="%" label="Satisfaction client" />
```

**Notes:**
- `proxy` object pattern avoids GSAP trying to parse suffixes like "+", "%", "k"
- `once: true` — counter never resets on scroll-up (standard KPI display behavior)
- `ease: "power2.out"` gives the "decelerating" feel that makes large numbers feel weighty
- For comma-formatted numbers (e.g. "1,234"), replace `Math.round()` with `Intl.NumberFormat('fr-FR').format()`

---

### Pattern 6: Infinite Horizontal Logo Carousel (GSAP ticker, pause on hover)

```typescript
// Source: GSAP community patterns + Codrops mastering carousels 2025
"use client"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useCursor } from "@/components/providers/CursorProvider"

const LOGOS = [
  "Entreprise A", "Entreprise B", "Entreprise C", "Entreprise D",
  "Entreprise E", "Entreprise F", "Entreprise G", "Entreprise H",
  // Duplicate the array to create seamless loop
]

export function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const { setVariant } = useCursor()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Width of a single set of logos
    const totalWidth = track.scrollWidth / 2  // divided by 2 because we duplicated

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 20,         // seconds for one full loop — adjust for desired speed
      ease: "none",         // linear — no easing for continuous scroll
      repeat: -1,           // loop forever
      modifiers: {
        // Wrap x value so it loops seamlessly without accumulating
        x: gsap.utils.unitize(gsap.utils.wrap(-totalWidth, 0))
      },
    })

    return () => {
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => {
        tweenRef.current?.pause()
        setVariant("drag")
      }}
      onMouseLeave={() => {
        tweenRef.current?.resume()
        setVariant("default")
      }}
    >
      <div ref={trackRef} className="flex gap-16 items-center whitespace-nowrap will-change-transform">
        {/* Render logos twice for seamless loop */}
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-8 py-4 border border-brand-cream/10 text-brand-muted text-sm tracking-widest uppercase"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Notes:**
- `useEffect` (not `useGSAP`) here because this tween runs on mount, not tied to scroll — acceptable exception to the `useGSAP` rule for always-running ticker animations. Alternative: `useGSAP` with no scrollTrigger also works fine.
- `ease: "none"` — linear motion for continuous scroll
- `repeat: -1` — infinite loop
- `modifiers.x` with `wrap` — keeps the `x` value in bounds without the tween ever "ending"
- `tweenRef.current?.pause()` / `?.resume()` — pause on hover, same direction/speed on resume
- `will-change: transform` on track — GPU layer promotion for smoother animation

**Alternative (simpler) approach** — pure CSS animation for logos, GSAP only for pause control:

```css
/* In globals.css */
@keyframes marquee {
  from { transform: translateX(0) }
  to   { transform: translateX(-50%) }  /* -50% because list is doubled */
}
.logo-track {
  animation: marquee 20s linear infinite;
}
.logo-track:hover {
  animation-play-state: paused;
}
```

CSS approach is lighter and has no JS overhead. Use GSAP approach only if variable speed or ScrollTrigger integration is needed.

---

### Pattern 7: ScrollTrigger Entrance Pattern (generic, reusable for lists/grids)

```typescript
// Source: GSAP ScrollTrigger docs + Phase 1 motion language
// This is the universal entrance pattern — all sections use this

"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useAnimation } from "@/components/providers/AnimationProvider"

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return

    // Section title entrance
    gsap.from(".expertise-title", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    })

    // Grid items staggered entrance
    gsap.from(".expertise-card", {
      scrollTrigger: {
        trigger: ".expertise-grid",
        start: "top 75%",
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,    // 80ms between each card
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    })

  }, { scope: sectionRef, dependencies: [isReady] })

  return (
    <section ref={sectionRef} id="expertises" className="py-section-spacing px-8">
      <h2 className="expertise-title font-display text-5xl text-brand-cream mb-16">
        Nos Expertises
      </h2>
      <div className="expertise-grid grid grid-cols-2 md:grid-cols-4 gap-6">
        {EXPERTISES.map((exp) => (
          <div key={exp.id} className="expertise-card ...">
            {/* SVG icon + title + description */}
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Common Pitfalls

### Pitfall 1: SplitText Resize — orphaned elements
**What goes wrong:** When the window resizes, SplitText re-splits the text. If `autoSplit: true` is set but animations are NOT defined inside `onSplit`, the new split elements have no animation — or worse, old animation instances target stale elements.
**Why it happens:** `autoSplit` re-splits automatically but the original `from()` tween still points to the original line elements which no longer exist in DOM.
**How to avoid:** Always define the animation INSIDE the `onSplit` callback — `return gsap.from(self.lines, ...)`. The returned tween is time-synced during re-splits.
**Warning signs:** After resize, hero title shows plain unstyled text or the animation replays from scratch.

### Pitfall 2: Flip — React state + requestAnimationFrame timing
**What goes wrong:** `Flip.getState()` is called, `setActiveFilter()` triggers a React re-render, but `Flip.from()` is called before React commits the new DOM — Flip reads the same positions as before and no animation occurs.
**Why it happens:** React state updates are asynchronous — the DOM is not updated synchronously after `setState`.
**How to avoid:** Wrap `Flip.from()` in `requestAnimationFrame(() => ...)` after calling `setActiveFilter()`. This ensures React has committed the render before Flip reads new positions.
**Warning signs:** Filter clicks don't animate — items just snap to new positions.

### Pitfall 3: AnimatePresence three silent failure modes
**What goes wrong:** `exit` animation silently does not play.
**Why it happens:** One of three root causes:
1. `AnimatePresence` is inside the conditional (`{isOpen && <AnimatePresence>...`)
2. The motion component lacks a `key` prop
3. The motion component is not a direct child of `AnimatePresence` (there's a wrapper `div` in between)
**How to avoid:** Mental model — `AnimatePresence` is the "gate keeper" that stays mounted; its direct children (with `key`) are what get animated in/out.
**Warning signs:** Overlay disappears instantly without animation when closed.

### Pitfall 4: Counter animation with suffix strings
**What goes wrong:** `gsap.to(displayRef.current, { innerHTML: 100 })` breaks when the initial value is "0+" because GSAP tries to parse "0+" as a number.
**Why it happens:** GSAP's automatic type detection fails on strings that mix numbers and characters.
**How to avoid:** Tween a proxy object `{ val: 0 }` and write to DOM in `onUpdate`. Never tween a DOM property that contains non-numeric characters.
**Warning signs:** Counter shows `NaN`, stops at wrong value, or throws GSAP warnings in console.

### Pitfall 5: Horizontal carousel gap on loop
**What goes wrong:** A visible "gap" or "jump" occurs when the carousel loops back to position 0.
**Why it happens:** The duplicated content doesn't perfectly match the original width (margins, flex gaps, odd logo widths).
**How to avoid:** Calculate `totalWidth` from actual `scrollWidth / 2` after DOM renders. Use `modifiers.x` with `gsap.utils.wrap` for pixel-perfect looping. Ensure logos all have explicit `flex-shrink-0`.
**Warning signs:** Carousel plays smoothly for one cycle then jumps.

### Pitfall 6: Missing `isReady` gate on ScrollTrigger
**What goes wrong:** Section entrance animations fire before the preloader exits, causing them to play unseen (or partially seen during the preloader overlay).
**Why it happens:** `useGSAP` runs on mount — if `isReady` is not checked, the animation starts when the component mounts, not after the preloader completes.
**How to avoid:** `if (!isReady) return` as the FIRST line of every `useGSAP` block. Use `{ dependencies: [isReady] }` so the hook re-runs when `isReady` becomes `true`.
**Warning signs:** Scroll down after page load and animations don't play — they already fired.

### Pitfall 7: ScrollTrigger on tween inside a timeline
**What goes wrong:** The ScrollTrigger fires at unexpected scroll positions.
**Why it happens:** GSAP docs explicitly state: put `ScrollTrigger` on the timeline, not on a child tween of the timeline.
**How to avoid:**
```typescript
// WRONG
const tl = gsap.timeline()
tl.to(".el", { scrollTrigger: { ... }, y: 0 })  // ❌

// CORRECT
const tl = gsap.timeline({ scrollTrigger: { ... } })
tl.to(".el", { y: 0 })  // ✓
```
**Warning signs:** ScrollTrigger fires at top of page or bottom of page, seemingly at random.

---

## Architecture Patterns (Section-Specific)

### Portfolio Data Structure

```typescript
// src/data/portfolio.ts
export interface Project {
  id: string
  title: string
  description: string
  category: "Sérigraphie" | "Broderie" | "DTF" | "Flocage"
  client: string          // fictitious company name
  year: number
  color: string           // OKLCH color for placeholder rectangle
  colSpan: string         // Tailwind class e.g. "col-span-7"
  rowSpan: string         // Tailwind class e.g. "row-span-2"
}

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    title: "Collection Workwear Industriel",
    description: "500 vêtements de travail brodés pour une PME industrielle alsacienne",
    category: "Broderie",
    client: "Alsatec Industries",
    year: 2024,
    color: "oklch(0.25 0.04 220)",   // dark teal placeholder
    colSpan: "col-span-7",
    rowSpan: "row-span-2",
  },
  // ... 5+ more projects
]
```

### Section Ordering in page.tsx

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <main>
      <HeroSection />          {/* id="hero" */}
      <PortfolioSection />     {/* id="realisations" */}
      <ExpertiseSection />     {/* id="expertises" */}
      <SocialProofSection />   {/* no nav ID needed */}
      {/* Phase 3 will replace these: */}
      <div id="configurateur" className="h-screen" />   {/* nav placeholder */}
      <div id="contact" className="h-screen" />          {/* nav placeholder */}
    </main>
  )
}
```

**Keeping Phase 3 placeholder divs** is mandatory — Navigation.tsx already observes `#configurateur` and `#contact` via IntersectionObserver. Removing them would cause navigation to never highlight those links.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `new SplitText(el, {})` | `SplitText.create(el, { onSplit() {} })` | GSAP 3.13 | New API is functionally different — `onSplit` callback handles font loading races, `autoSplit` eliminates manual resize handling |
| `import { SplitText } from "gsap/SplitText-Trial"` | `import { SplitText } from "gsap/SplitText"` | GSAP 3.13 (Webflow acquisition) | All GSAP plugins free — no Club membership, no trial package |
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` | 2025 rebranding | Same API, different package name — `framer-motion` no longer actively maintained |
| CSS animation for infinite scroll | GSAP ticker `modifiers.x` with `wrap` | — | GSAP ticker syncs with Lenis RAF loop — CSS animations run independently and can drift |

**Deprecated/outdated:**
- `new SplitText()` old constructor API: still works but does not support `autoSplit`, `mask`, or the `onSplit` callback. Use `SplitText.create()`.
- `import from "framer-motion"`: package is frozen. Import from `motion/react`.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is purely code additions to an existing Next.js project. All animation libraries are already installed. No external services, databases, or CLI tools beyond Node.js are required.

---

## Validation Architecture

Step 4: SKIPPED — No test framework is configured in this project (no jest.config, no vitest.config, no `__tests__` directory). This is a visual/animation-heavy showcase site; functional testing is manual. Phase 4 SEO & Performance will add Lighthouse CI if needed.

Manual validation checklist for Phase 2:
- [ ] `npm run dev` starts without TypeScript errors
- [ ] `npm run build` passes (Turbopack, no RangeError)
- [ ] Hero title animates line-by-line after preloader exits
- [ ] Parallax layers respond to both scroll and mousemove
- [ ] Portfolio filter transitions via Flip (no snap/jump)
- [ ] Lightbox opens, Escape closes, arrow keys navigate
- [ ] KPI counters animate on first scroll into view, not again
- [ ] Logo carousel runs at 60fps, pauses on hover, resumes same direction
- [ ] All section entrances fire after preloader (isReady gate works)
- [ ] Cursor changes to "view" on portfolio cards
- [ ] No console errors in production build (`npm run start`)

---

## Open Questions

1. **Portfolio layout: masonry CSS Grid vs asymmetric editorial grid**
   - What we know: `grid-template-areas` + explicit `col-span`/`row-span` per project achieves masonry-like layouts in CSS Grid without JavaScript library. Native CSS masonry (`grid-template-rows: masonry`) has limited browser support (Safari TP only as of March 2026).
   - What's unclear: the exact visual layout needs to be designed — 6+ projects across a 12-column grid with varying spans.
   - Recommendation: Use explicit col/row spans on each project card, defined in the data file. Gives full editorial control.

2. **Testimonial layout: bento vs carousel**
   - What we know: A testimonial carousel adds complexity (navigation, touch support). A bento/magazine grid layout is static but visually richer with asymmetric placement.
   - Recommendation: Bento grid for testimonials — 3-4 testimonials in an asymmetric grid, Motion entrance animations. No carousel needed. Simpler, denser, more editorial.

3. **SplitText in page title — font loading race**
   - What we know: `autoSplit: true` + `onSplit` callback handles font loading timing automatically in GSAP 3.13+. The `next/font/local` setup generates `<link rel="preload">` tags — fonts should be available before JS runs.
   - What's unclear: whether `autoSplit` is needed given fonts are preloaded by next/font.
   - Recommendation: Use `autoSplit: true` regardless — it costs nothing and protects against edge cases.

---

## Sources

### Primary (HIGH confidence)
- [GSAP SplitText official docs](https://gsap.com/docs/v3/Plugins/SplitText/) — `SplitText.create()` API, `mask`, `autoSplit`, `onSplit` callback
- [GSAP Flip official docs](https://gsap.com/docs/v3/Plugins/Flip/) — `getState()`, `from()`, `onEnter`/`onLeave`, `absolute` option
- [GSAP ScrollTrigger official docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — `scrub`, `once`, `start`, `invalidateOnRefresh`
- [Motion (framer-motion) docs](https://motion.dev/docs/react) — `AnimatePresence`, `motion.*` components, exit animations
- [Phase 1 CONTEXT.md](/.planning/phases/01-fondations/01-CONTEXT.md) — motion language, palette, infrastructure contracts
- [Phase 1 01-03-SUMMARY.md](/.planning/phases/01-fondations/01-03-SUMMARY.md) — `useAnimation().isReady` pattern, provider stack

### Secondary (MEDIUM confidence)
- [Codrops: Animating Responsive Grid Transitions with GSAP Flip (Jan 2026)](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/) — Flip filter pattern with React state
- [Codrops: Mastering Carousels with GSAP (Apr 2025)](https://tympanus.net/codrops/2025/04/21/mastering-carousels-with-gsap-from-basics-to-advanced-animation/) — `horizontalLoop()` helper, pause on hover
- [Codrops: 5 Creative Demos Using Free GSAP Plugins (May 2025)](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/) — SplitText mask patterns confirmed free

### Tertiary (LOW confidence — needs validation against live behavior)
- GSAP Community Forum: Flip filter pattern with `requestAnimationFrame` timing fix — pattern is widely used but exact React timing behavior may vary with React 19 concurrent rendering
- GSAP counter proxy pattern — widely reproduced from codepen.io examples, verified to match official onUpdate docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified installed in package.json, correct versions
- GSAP SplitText new API: HIGH — fetched from official GSAP docs directly
- GSAP Flip filter pattern: HIGH — fetched from official GSAP docs + Codrops Jan 2026 tutorial
- Motion AnimatePresence lightbox: HIGH — fetched from motion.dev official docs
- Counter proxy pattern: MEDIUM — widely reproduced community pattern, consistent with official `onUpdate` docs
- Logo carousel GSAP ticker approach: MEDIUM — community pattern, CSS approach is simpler alternative if ticker approach has issues

**Research date:** 2026-03-28
**Valid until:** 2026-09-28 (stable GSAP API, unlikely to change)
