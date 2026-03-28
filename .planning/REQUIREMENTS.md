# Requirements: Maje Concept — Site Vitrine Ultra-Premium

**Defined:** 2026-03-28
**Core Value:** Chaque visiteur est immédiatement impressionné par l'expérience visuelle et convertit en lead qualifié

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Design System

- [ ] **FOUND-01**: Le projet Next.js 15 App Router est scaffoldé avec TypeScript, Tailwind v4, GSAP, Motion et Lenis correctement configurés
- [ ] **FOUND-02**: Le design system est défini avec palette distinctive (noir profond + or chaud + blanc cassé), typographie premium (serif + sans), et timing functions custom dans `@theme {}`
- [ ] **FOUND-03**: Les fonts premium sont chargées via `next/font` avec `font-display: swap` et preload automatique
- [x] **FOUND-04**: Lenis smooth scroll est initialisé avec `autoRaf: false` et synchronisé avec le ticker GSAP (un seul RAF loop)

### Curseur Custom

- [x] **CURS-01**: Un curseur custom global remplace le curseur natif avec cercle/forme épurée et `mix-blend-mode: difference`
- [x] **CURS-02**: Un follower avec lag intentionnel (lerp 0.08-0.12) suit le curseur principal via GSAP `quickTo`
- [x] **CURS-03**: Le curseur change d'état contextuellement : s'agrandit sur les cards portfolio ("Voir"), morphe sur les boutons, réticule sur le configurateur, réduit sur les liens nav
- [x] **CURS-04**: Un effet magnétique déplace les boutons principaux vers le curseur dans un rayon de ~80px avec spring return
- [x] **CURS-05**: Un spotlight/torchlight effect révèle du contenu sur les sections sombres via gradient radial suivant la souris
- [x] **CURS-06**: Le curseur custom est désactivé proprement sur mobile/touch (`pointer: coarse`) avec `pointer-events: none`

### Navigation & Preloader

- [x] **NAV-01**: Une navigation fixe affiche les liens vers chaque section avec état actif basé sur la position de scroll
- [x] **NAV-02**: Un preloader élégant (logo animé + progression) masque le chargement initial en < 3 secondes
- [x] **NAV-03**: Les animations d'entrée des sections sont gatées par l'AnimationProvider (ne se lancent qu'après le preloader)

### Hero Section

- [x] **HERO-01**: Le hero affiche un titre en typographie expressive animé ligne par ligne via GSAP SplitText
- [x] **HERO-02**: Les éléments du hero apparaissent en séquence orchestrée (staggered reveals)
- [x] **HERO-03**: Un effet parallax multi-couches (scroll + souris) crée un effet de profondeur 3D avec éléments à différentes vitesses (depth 0.1-0.5)
- [x] **HERO-04**: Deux CTAs principaux mènent vers le configurateur et le formulaire de contact

### Portfolio / Réalisations

- [x] **PORT-01**: Une grille masonry ou layout asymétrique affiche minimum 6 projets fictifs crédibles avec titre, description et secteur
- [x] **PORT-02**: Les hover effects sont riches : zoom, overlay avec détails du projet
- [x] **PORT-03**: Des filtres par catégorie permettent de trier les projets avec animation fluide (GSAP Flip)
- [x] **PORT-04**: Une lightbox immersive s'ouvre pour chaque projet avec navigation entre projets

### Expertises

- [x] **EXPT-01**: Les domaines de compétences sont présentés avec icônes SVG custom et descriptions
- [x] **EXPT-02**: Les éléments apparaissent avec animations scroll-triggered via GSAP ScrollTrigger
- [x] **EXPT-03**: Des compteurs animés affichent les KPIs clés (années d'expérience, projets livrés, clients, pays) avec count-up à l'intersection

### Preuves Sociales

- [x] **SOCL-01**: Un carrousel infinite scroll horizontal affiche minimum 8 logos clients fictifs mais réalistes
- [x] **SOCL-02**: Des témoignages avec photo, nom, poste et entreprise sont présentés dans un carrousel premium ou layout bento
- [x] **SOCL-03**: Des statistiques clés (satisfaction, projets livrés) sont animées avec comptage au scroll

### Configurateur Produit

- [x] **CONF-01**: Une interface de sélection en temps réel permet de choisir matières, couleurs, dimensions et finitions pour des produits textiles
- [x] **CONF-02**: Un preview 2D (SVG layer composition) se met à jour instantanément selon les choix
- [x] **CONF-03**: Un résumé de la configuration est affiché avec estimation de prix ou invitation à demander un devis
- [x] **CONF-04**: Un bouton "Demander un devis" pré-remplit le formulaire de contact avec la configuration choisie

### Formulaire de Contact

- [x] **CONT-01**: Le formulaire inclut : nom, prénom, email, téléphone, entreprise, type de besoin (select), message, et configuration produit (si provenant du configurateur)
- [x] **CONT-02**: La validation frontend est en temps réel avec messages d'erreur élégants (react-hook-form + Zod)
- [x] **CONT-03**: Un API route Next.js (`/api/contact`) envoie un email de notification à Maje Concept via Resend avec toutes les infos structurées
- [x] **CONT-04**: Un email de confirmation automatique est envoyé au prospect avec template HTML professionnel
- [x] **CONT-05**: Une animation de succès satisfaisante s'affiche après soumission réussie

### Footer

- [x] **FOOT-01**: Le footer affiche la navigation complète, réseaux sociaux, mentions légales, coordonnées et localisation
- [x] **FOOT-02**: Un formulaire newsletter permet la collecte d'emails

### SEO Technique

- [x] **SEO-01**: Les metadata complètes (title, description, OG tags, Twitter cards) sont générées via Next.js Metadata API
- [x] **SEO-02**: Le Schema.org JSON-LD est implémenté (Organization, LocalBusiness, Service, BreadcrumbList)
- [x] **SEO-03**: Un `sitemap.xml` et `robots.txt` sont générés automatiquement via `app/sitemap.ts` et `app/robots.ts`
- [x] **SEO-04**: Le HTML sémantique est strict (h1 unique, hiérarchie respectée, alt descriptifs sur toutes les images)
- [x] **SEO-05**: Les Core Web Vitals sont optimisés : LCP < 2.5s, CLS < 0.1, INP optimisé

### Animations & Polish

- [x] **ANIM-01**: Toutes les sections ont des scroll-triggered animations GSAP ScrollTrigger
- [x] **ANIM-02**: Des micro-interactions sont présentes sur tous les éléments interactifs (hover, focus, active)
- [x] **ANIM-03**: Les images sont optimisées via `next/image` avec lazy loading (sauf hero : `priority`)
- [x] **ANIM-04**: Le code splitting est automatique avec dynamic imports pour les composants lourds

### Responsive

- [x] **RESP-01**: Le site est entièrement responsive : mobile, tablette et desktop
- [x] **RESP-02**: Les animations lourdes sont réduites ou simplifiées sur mobile pour la performance

## v2 Requirements

Deferred to future release.

### Multi-pages
- **V2-01**: Page "À propos" avec histoire de l'entreprise et équipe
- **V2-02**: Pages projets individuelles avec études de cas détaillées
- **V2-03**: Blog / actualités

### Fonctionnalités avancées
- **V2-04**: Configurateur 3D avec Three.js / React Three Fiber
- **V2-05**: Multi-langues (EN/DE pour marché alsacien transfrontalier)
- **V2-06**: Analytics privacy-first (Plausible ou Fathom)
- **V2-07**: Chat en direct / chatbot
- **V2-08**: Intégration CMS (Sanity ou Payload) pour gestion de contenu

## Out of Scope

| Feature | Reason |
|---------|--------|
| E-commerce / paiement en ligne | Site de conversion vers contact, pas une boutique |
| Backend complexe / base de données | Site statique Next.js, contenu hardcodé pour v1 |
| Authentification utilisateur | Site public vitrine uniquement |
| WebGL/Three.js particle backgrounds | Tue le LCP, pas de pertinence pour le print textile |
| Dark mode toggle | Dilue l'identité de marque |
| Audio ambiant autoplaying | Universellement détesté, problème accessibilité |
| Multiple horizontal scroll sections | GSAP nested pinning fragile, confus pour l'utilisateur |
| Purple/blue gradient aesthetic | Marqueur "AI slop" 2025-2026 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Complete |
| CURS-01 | Phase 1 | Complete |
| CURS-02 | Phase 1 | Complete |
| CURS-03 | Phase 1 | Complete |
| CURS-04 | Phase 1 | Complete |
| CURS-05 | Phase 1 | Complete |
| CURS-06 | Phase 1 | Complete |
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| HERO-01 | Phase 2 | Complete |
| HERO-02 | Phase 2 | Complete |
| HERO-03 | Phase 2 | Complete |
| HERO-04 | Phase 2 | Complete |
| PORT-01 | Phase 2 | Complete |
| PORT-02 | Phase 2 | Complete |
| PORT-03 | Phase 2 | Complete |
| PORT-04 | Phase 2 | Complete |
| EXPT-01 | Phase 2 | Complete |
| EXPT-02 | Phase 2 | Complete |
| EXPT-03 | Phase 2 | Complete |
| SOCL-01 | Phase 2 | Complete |
| SOCL-02 | Phase 2 | Complete |
| SOCL-03 | Phase 2 | Complete |
| CONF-01 | Phase 3 | Complete |
| CONF-02 | Phase 3 | Complete |
| CONF-03 | Phase 3 | Complete |
| CONF-04 | Phase 3 | Complete |
| CONT-01 | Phase 3 | Complete |
| CONT-02 | Phase 3 | Complete |
| CONT-03 | Phase 3 | Complete |
| CONT-04 | Phase 3 | Complete |
| CONT-05 | Phase 3 | Complete |
| FOOT-01 | Phase 3 | Complete |
| FOOT-02 | Phase 3 | Complete |
| SEO-01 | Phase 4 | Complete |
| SEO-02 | Phase 4 | Complete |
| SEO-03 | Phase 4 | Complete |
| SEO-04 | Phase 4 | Complete |
| SEO-05 | Phase 4 | Complete |
| ANIM-01 | Phase 2 | Complete |
| ANIM-02 | Phase 2 | Complete |
| ANIM-03 | Phase 4 | Complete |
| ANIM-04 | Phase 4 | Complete |
| RESP-01 | Phase 4 | Complete |
| RESP-02 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after initial definition*
