# Phase 2: Sections Principales — Context

**Phase:** 2 of 4
**Goal:** Un visiteur peut parcourir l'intégralité du contenu principal avec des animations 60fps qui justifient le positionnement ultra-premium
**Duration estimate:** 2-3 days
**Status:** Not started

---

## What "Done" Looks Like

Phase 2 is complete when all five success criteria pass simultaneously:

1. Hero: typographie animée ligne par ligne via GSAP SplitText (mask:"lines"), parallax multi-couches actif au scroll ScrollTrigger ET à la souris (GSAP quickTo, depth 0.1–0.5)
2. Portfolio: 6+ projets, hover effects riches (zoom + overlay), filtres animés GSAP Flip, lightbox immersive navigable au clavier
3. Expertises: compteurs KPI animés à l'intersection via ScrollTrigger, icônes SVG custom, entrées scroll-triggered
4. Social Proof: carrousel logos scroll infini horizontal + témoignages premium
5. Toutes animations GSAP ScrollTrigger en entrée viewport, micro-interactions hover/focus présentes sur tous les éléments interactifs

---

## Esthetic Direction

**Same as Phase 1 — no changes to the design system.**

- `--color-brand-black` oklch(0.10 0.008 250) — background de toutes les sections
- `--color-brand-gold` oklch(0.72 0.14 82) — accents, titres primaires, compteurs KPI
- `--color-brand-cream` oklch(0.96 0.012 88) — corps de texte sur fond sombre
- `--color-brand-charcoal` oklch(0.18 0.008 250) — surfaces de cartes portfolio
- `--color-brand-muted` oklch(0.45 0.010 250) — texte secondaire, labels filtres inactifs

**Typography (Söhne Breit — both weights):**
- Titres sections : `font-display` (TestSohneBreit-Dreiviertelfett) — tous caps ou mixed case, large
- Corps/labels : `font-body` (TestSohneBreit-Buch) — compact, dense

**Motion language (from Phase 1 CONTEXT.md):**
- Entrance: `y: 60 → 0`, `opacity: 0 → 1`, duration 0.9s, ease `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo)
- Stagger: 0.08s entre éléments siblings
- SplitText lines: `yPercent: 100 → 0` avec `mask: "lines"` pour reveal propre
- Counters: `{ val: 0 }` tweened to target via `onUpdate`
- Infinite carousel: GSAP ticker, `gsap.ticker.add()` loop, pause via `tween.pause()` on mouseenter

**Density:** Dense, éditorial — pas de cards identiques avec espacement uniforme. Portfolio asymétrique, expertises en grille compacte, social proof dense avec logos serrés.

**What this is NOT:**
- Pas de grilles de cartes avec espacement égal partout
- Pas de sections aérées "minimal" — dense et éditorial
- Pas d'effets parallax sur toutes les sections — hero seulement, depth cues subtils ailleurs
- Pas de placeholder photos génériques — rectangles colorés si pas d'images fournies

---

## Key Decisions (Locked from Phase 1)

| Decision | What It Means for Phase 2 |
|----------|--------------------------|
| GSAP 3.14.x — SplitText, ScrollTrigger, Flip tous gratuits | Utiliser directement depuis `gsap` npm. Déjà enregistrés dans `lib/gsapConfig.ts`. |
| `useGSAP()` pour TOUT le code GSAP | Non-négociable. Jamais `useEffect` pour GSAP. Cleanup automatique ScrollTrigger. |
| `isReady` gate obligatoire | Chaque section vérifie `useAnimation().isReady` avant toute animation d'entrée. Pattern : `useGSAP(() => { if (!isReady) return; ... }, { dependencies: [isReady] })` |
| Lenis `autoRaf: false` + ticker GSAP | Déjà en place. ScrollTrigger refresh via `lenis.on('scroll', ScrollTrigger.update)` — ne pas toucher. |
| `motion` package (pas `framer-motion`) | Lightbox utilise `AnimatePresence` depuis `motion/react`. |
| Palette et tokens `@theme {}` | Tous les tokens sont en place dans `globals.css`. Pas de couleurs hardcodées. |
| Cursor variants `data-cursor` | Portfolio cards: `data-cursor="view"`. Carousel: `data-cursor="drag"`. CursorProvider répond à ces variants. |
| No WebGL / Three.js | Parallax hero = GSAP + CSS transforms. Pas de canvas WebGL. |

---

## Phase 1 Infrastructure Available

The following is built and ready — Phase 2 MUST use these, not rebuild them:

| Component/Hook | Import Path | Usage in Phase 2 |
|----------------|------------|------------------|
| `useAnimation()` | `@/components/providers/AnimationProvider` | Gate ALL entrance animations behind `isReady` |
| `useCursor()` | `@/components/providers/CursorProvider` | Set `"view"` on portfolio cards, `"drag"` on carousel |
| `MagneticButton` | `@/components/cursor/MagneticButton` | Hero CTAs (Nos Réalisations, Nous Contacter) |
| `registerGSAPPlugins()` | `@/lib/gsapConfig.ts` | Already called — ScrollTrigger, SplitText, Flip registered |
| `cn()` | `@/lib/utils` | Class merging throughout |
| Navigation section IDs | Already observed: `#hero`, `#realisations`, `#expertises`, `#contact` | Sections must use these exact IDs |

**Note:** `#configurateur` is also in the IntersectionObserver from Phase 1 navigation. Phase 2 adds `#expertises` and `#realisations` content. Phase 3 adds `#configurateur` and `#contact`.

---

## Section IDs (Navigation Contract)

Phase 1 Navigation.tsx observes these exact IDs:
- `#hero` — hero section
- `#realisations` — portfolio/réalisations section
- `#expertises` — expertises section
- `#configurateur` — configurateur (Phase 3 placeholder, keep as placeholder div in Phase 2)
- `#contact` — contact (Phase 3 placeholder, keep as placeholder div in Phase 2)

Phase 2 replaces the placeholder divs for `#hero`, `#realisations`, `#expertises`, and adds a `#social-proof` sub-section (not in navigation, doesn't need ID tracking).

---

## What NOT to Do (Phase 2 Pitfalls)

| Pitfall | Consequence | Rule |
|---------|-------------|------|
| Missing `if (!isReady) return` | Animation fires before preloader exits — race condition | Always check `isReady` before any GSAP entrance animation |
| SplitText without `revert()` cleanup | Text elements s'accumulent au resize, layout cassé | Appeler `split.revert()` dans la fonction de cleanup `useGSAP` |
| Motion `AnimatePresence` sans `key` unique | Exit animation silently ignored | Chaque `motion.*` direct child de `AnimatePresence` doit avoir une `key` prop unique |
| `framer-motion` import | Package plus activement maintenu | Toujours `import { motion, AnimatePresence } from "motion/react"` |
| ScrollTrigger sur tween child d'une timeline | Trigger fires at wrong time | ScrollTrigger va sur la timeline, pas sur un tween enfant |
| Cursor position en React state pour portfolio hover | Re-renders à 60fps | Seul `variant` string passe par React state — utiliser `setVariant()` uniquement |
| Deux `RAF` loops si GSAP ticker touché | Scroll jitter | Ne pas modifier `LenisProvider.tsx` — infrastructure Phase 1 est correcte |
| Placeholder stock images Unsplash | Détruit l'authenticité | Utiliser des rectangles colorés (CSS `background: oklch(...)`) avec overlay texte |

---

## What Phase 3 Needs From Phase 2

- `#configurateur` et `#contact` comme placeholder divs avec les bons IDs (navigation tracking)
- `MagneticButton` pattern validé et utilisé dans hero — Phase 3 hero CTA vers configurateur réutilise ce composant
- `data-cursor="view"` pattern établi sur les cartes portfolio — Phase 3 configurateur utilisera `data-cursor="crosshair"`

---

*Context written: 2026-03-28*
*Phase owner: Claude*
