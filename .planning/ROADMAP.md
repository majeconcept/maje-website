# Roadmap: Maje Concept — Site Vitrine Ultra-Premium

## Overview

Quatre phases construisent le site de l'intérieur vers l'extérieur : d'abord les fondations techniques et le design system qui rendent tout le reste possible (Phase 1), puis toutes les sections de contenu avec leurs animations complètes (Phase 2), puis les fonctionnalités interactives de conversion — configurateur et formulaire (Phase 3), enfin l'optimisation SEO et performance qui rendent le site production-ready (Phase 4). Chaque phase livre une capacité vérifiable indépendamment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Fondations & Design System** - Scaffold Next.js, design system, curseur custom, navigation et preloader
- [ ] **Phase 2: Sections Principales** - Hero, Portfolio, Expertises et Preuves sociales avec animations GSAP complètes
- [ ] **Phase 3: Interactivité & Conversion** - Configurateur produit, formulaire de contact, footer et mentions légales
- [ ] **Phase 4: SEO & Performance** - Metadata, JSON-LD, sitemap, Core Web Vitals, responsive polish

## Phase Details

### Phase 1: Fondations & Design System
**Goal**: Les bases techniques sont en place et l'expérience visuelle signature est perceptible dès le premier chargement
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, CURS-01, CURS-02, CURS-03, CURS-04, CURS-05, CURS-06, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. Le projet se lance avec `npm run dev` sans erreur, Tailwind v4 `@theme {}` actif, fonts premium chargées via `next/font`
  2. Le curseur custom multi-couches est visible avec follower lag, s'agrandit sur les éléments hover, et disparaît sur touch mobile
  3. L'effet magnétique déplace les boutons principaux vers le curseur dans un rayon de ~80px
  4. Le preloader s'affiche, se complète en < 3 secondes, et les animations de page ne se lancent qu'après sa fermeture
  5. La navigation fixe affiche les liens de section avec état actif qui se met à jour au scroll
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Scaffold Next.js 15 + Tailwind v4 @theme + fonts Söhne Breit + gsapConfig + cn() (2026-03-28)
- [x] 01-02-PLAN.md — LenisProvider + CursorProvider + CustomCursor 4 couches + MagneticButton
- [x] 01-03-PLAN.md — AnimationProvider + Preloader + Navigation fixe IntersectionObserver
**UI hint**: yes

### Phase 2: Sections Principales
**Goal**: Un visiteur peut parcourir l'intégralité du contenu principal avec des animations 60fps qui justifient le positionnement ultra-premium
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, PORT-01, PORT-02, PORT-03, PORT-04, EXPT-01, EXPT-02, EXPT-03, SOCL-01, SOCL-02, SOCL-03, ANIM-01, ANIM-02
**Success Criteria** (what must be TRUE):
  1. Le hero affiche la typographie animée ligne par ligne via SplitText, avec parallax multi-couches actif au scroll et à la souris
  2. La section Portfolio affiche 6+ projets avec hover effects riches, filtres animés par GSAP Flip et lightbox immersive navigable
  3. Les compteurs KPI de la section Expertises s'incrémentent animés à l'intersection (scroll-triggered)
  4. Le carrousel de logos clients et les témoignages sont affichés avec scroll infini horizontal
  5. Chaque section déclenche ses animations GSAP ScrollTrigger en entrant dans le viewport, et tous les éléments interactifs ont des micro-interactions hover/focus
**Plans**: 4 plans
- [x] 02-01-PLAN.md — Section Hero : SplitText ligne par ligne + parallax scroll+souris (3 couches) + 2 CTAs MagneticButton
- [ ] 02-02-PLAN.md — Section Portfolio : grille masonry 8 projets + filtres GSAP Flip + hover overlay + lightbox AnimatePresence
- [ ] 02-03-PLAN.md — Section Expertises : AnimatedCounter KPI (proxy GSAP) + 5 domaines icônes SVG + ScrollTrigger entrance
- [ ] 02-04-PLAN.md — Section Social Proof : carrousel logos CSS marquee + 3 témoignages bento + câblage final page.tsx
**UI hint**: yes

### Phase 3: Interactivité & Conversion
**Goal**: Un visiteur peut configurer un produit et soumettre une demande de devis — le parcours de conversion complet fonctionne de bout en bout
**Depends on**: Phase 2
**Requirements**: CONF-01, CONF-02, CONF-03, CONF-04, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, FOOT-01, FOOT-02
**Success Criteria** (what must be TRUE):
  1. Le configurateur permet de choisir matières, couleurs et dimensions avec un preview SVG 2D mis à jour instantanément et une estimation de prix affichée
  2. Le bouton "Demander un devis" depuis le configurateur pré-remplit le formulaire de contact avec la configuration choisie
  3. La soumission du formulaire déclenche un email de notification à Maje Concept et un email de confirmation au prospect via Resend, puis affiche une animation de succès
  4. Le footer complet est visible avec navigation, coordonnées, réseaux sociaux et formulaire newsletter
**Plans**: TBD
**UI hint**: yes

### Phase 4: SEO & Performance
**Goal**: Le site est production-ready : indexable, performant et conforme aux Core Web Vitals (LCP < 2.5s, CLS < 0.1)
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, ANIM-03, ANIM-04, RESP-01, RESP-02
**Success Criteria** (what must be TRUE):
  1. Les metadata complètes (title, description, OG, Twitter cards) et le Schema.org JSON-LD sont présents et valides dans le HTML rendu
  2. `sitemap.xml` et `robots.txt` sont accessibles et corrects
  3. Un audit Lighthouse ou PageSpeed Insights confirme LCP < 2.5s et CLS < 0.1 sur desktop
  4. Le site est entièrement fonctionnel et visuellement correct sur mobile (320px+), tablette et desktop, avec animations simplifiées sur mobile
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fondations & Design System | 3/3 | Complete | 2026-03-28 |
| 2. Sections Principales | 0/4 | Ready to execute | - |
| 3. Interactivité & Conversion | 0/? | Not started | - |
| 4. SEO & Performance | 0/? | Not started | - |

---
*Roadmap created: 2026-03-28*
*Last updated: 2026-03-28 — Phase 2 planned (4 plans, waves 1-4)*
