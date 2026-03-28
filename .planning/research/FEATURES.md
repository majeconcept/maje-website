# Features Research: Site Vitrine Ultra-Premium

**Researched:** 2026-03-28
**Domain:** Ultra-premium showcase/portfolio websites (Awwwards/FWA level)
**Confidence:** HIGH

## Table Stakes

Features that users expect from a premium showcase site. Missing any signals "amateur" within seconds.

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Custom cursor (at minimum a styled dot) | MEDIUM | Baseline expectation on premium creative sites since ~2022 |
| Lenis smooth scroll | LOW | One-time setup, dramatically improves perceived quality |
| Preloader / page entrance animation | MEDIUM | Covers font/image loading, sets the tone. Must be < 3 seconds |
| Scroll-triggered entrance animations | MEDIUM | GSAP ScrollTrigger + staggered reveals. Every section needs them |
| Portfolio/réalisations grid with lightbox | MEDIUM | Masonry or asymmetric layout, hover overlays, filter by category |
| Contact form with validation | LOW-MEDIUM | Real-time validation, success animation, email sending |
| Mobile responsiveness | MEDIUM | Touch-optimized, cursor effects disabled on touch devices |
| SEO metadata + JSON-LD | LOW | Next.js Metadata API makes this trivial but it's expected |
| Semantic HTML + accessibility basics | LOW | Proper heading hierarchy, alt texts, focus states |
| Premium typography (serif + sans pairing) | LOW | Playfair Display + DM Sans or similar. Never Inter/Roboto/Arial |
| Professional footer with full navigation | LOW | Coordinates, social links, legal mentions, newsletter |

## Differentiators

Features that set Maje Concept apart. No competitor in the Alsace print market has these.

| Feature | Complexity | Impact | Notes |
|---------|-----------|--------|-------|
| Multi-layer cursor system (4+ contextual states) | HIGH | VERY HIGH | Cursor + follower with lag, transforms on hover (enlarge on cards, morph on buttons, crosshair on configurator), spotlight effect on dark sections |
| SplitText kinetic typography in hero | MEDIUM | HIGH | GSAP SplitText (now free) for letter-by-letter or line-by-line reveals |
| Magnetic CTA buttons | MEDIUM | HIGH | Button follows cursor within ~80px radius, spring return. Cheap relative to visual impact |
| Animated masonry portfolio with filter transitions | HIGH | HIGH | GSAP Flip or Framer Motion layout animations for smooth category filtering |
| 2D live product configurator | VERY HIGH | VERY HIGH | SVG layer composition for real-time preview of material/color/dimension choices. Pre-fills contact form. Unique in the market |
| Parallax multi-layer (scroll + mouse) on hero | MEDIUM | HIGH | Background elements at different depth speeds, mouse-responsive |
| Spotlight/torchlight effect on dark sections | MEDIUM | MEDIUM | Radial gradient follows mouse, reveals content/texture underneath |
| Animated KPI counters | LOW | MEDIUM | Count-up animation on scroll intersection. Standard but effective |
| Infinite scroll logo carousel | LOW | MEDIUM | CSS animation or GSAP, 8+ client logos |
| Testimonial carousel/bento layout | MEDIUM | MEDIUM | Photo + name + role + company, premium layout |
| Page transitions (Framer Motion AnimatePresence) | MEDIUM | MEDIUM | Smooth cross-fade between routes if multi-page |

## Anti-Features

Things to deliberately NOT build. Each signals "generic" or "AI slop."

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| WebGL/Three.js particle backgrounds | Kills LCP (>4s on mobile), no brand relevance for print/textile, screams "developer portfolio" | Subtle CSS/SVG parallax layers, or a single hero image with depth |
| Multiple horizontal scroll sections | GSAP nested pinning is fragile, confuses users, GSAP docs warn against overuse | One pinned section max. Vertical scroll is king |
| Purple-to-blue gradient backgrounds | #1 "AI slop" marker of 2025-2026. Instantly signals template | Distinctive palette: deep black + warm gold + off-white, or crème + bordeaux + bronze |
| Inter / Roboto / Arial fonts | Signals "default template" immediately | Playfair Display, DM Sans, Cormorant Garamond, or licensed premium fonts |
| Cookie-cutter equal-height card grids | Boring, predictable, every Tailwind template does this | Asymmetric/editorial layouts, masonry, bento grids |
| Preloaders > 3 seconds | User abandonment spikes. Fake loading bars are worse | Real asset loading with progress, or fast fade-in (<2s) |
| Autoplaying ambient audio | Universally hated, accessibility nightmare | No audio. Period |
| Stock photography (Unsplash generic) | Destroys authenticity for a print/textile specialist | Placeholder SVG illustrations or well-chosen abstract textures |
| Excessive parallax on every section | Motion sickness, performance issues, diminishes the effect | Parallax on hero only, subtle depth cues elsewhere |
| Dark mode toggle | Adds complexity, dilutes brand identity on a showcase site | Single cohesive color scheme that IS the brand |

## Feature Dependencies

```
Lenis smooth scroll ──→ GSAP ScrollTrigger sync ──→ All scroll animations
                                                  ──→ Parallax effects

Custom cursor system ──→ Magnetic buttons
                     ──→ Contextual cursor states (needs portfolio, configurator)
                     ──→ Spotlight effect

Contact form ──→ Configurator pre-fill
             ──→ Email API route (Resend)

Portfolio grid ──→ Lightbox
               ──→ Filter animations (GSAP Flip)

Preloader ──→ Animation orchestration (gates all entrance animations)
```

## Competitive Landscape

The Alsace B2B print market has an enormous competitive gap. Most competitors use stock WordPress templates from the early 2010s. A well-executed premium site has no local peer, making the investment in animation quality highly justified.

Key competitive advantages of the proposed feature set:
- Live product configurator is unheard of in this market segment
- Custom cursor + magnetic buttons signal a level of craft competitors can't match
- Professional SEO + Schema.org markup will dominate local search results

## Open Questions

- SVG layer composition (recommended for configurator) vs third-party service like Zakeke
- Privacy-first analytics (Plausible vs Fathom vs GA4) — determines cookie consent needs under RGPD
- Licensed premium font vs Google Fonts — both viable, licensed adds exclusivity

---
*Researched: 2026-03-28*
