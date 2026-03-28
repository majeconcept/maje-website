# Maje Concept — Site Vitrine Ultra-Premium

## What This Is

Un site web vitrine ultra-premium pour Maje Concept, spécialiste du print et marquage textile en Alsace. Le site doit immédiatement inspirer confiance, démontrer l'expertise et le savoir-faire, et convertir les visiteurs en leads qualifiés. L'identité visuelle est distinctive, luxueuse et mémorable — niveau agence digitale premium 50 000€+.

## Core Value

Chaque visiteur est immédiatement impressionné par l'expérience visuelle et convertit en lead qualifié via le formulaire de contact — l'impression de qualité dès les 3 premières secondes est la priorité absolue.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section immersive avec animations d'entrée orchestrées, typographie expressive animée, et effet de profondeur (parallax/particules)
- [ ] Section Portfolio/Réalisations avec grille masonry, hover effects riches, filtres animés, lightbox immersive (6+ projets)
- [ ] Section Expertises avec icônes SVG custom, animations scroll, compteurs KPI animés
- [ ] Configurateur live de produit avec sélection temps réel (matières, couleurs, dimensions), preview 2D/3D, estimation prix
- [ ] Preuves sociales : logos clients animés (8+), témoignages premium, statistiques comptage animé
- [ ] Formulaire de contact complet avec validation temps réel, envoi email (notification + confirmation), pré-remplissage depuis configurateur
- [ ] Footer premium avec navigation, réseaux sociaux, mentions légales, newsletter, coordonnées
- [ ] Système de curseur custom multi-couches (curseur + follower lag, états contextuels, effet magnétique, spotlight)
- [ ] SEO technique complet (metadata, Schema.org JSON-LD, sitemap, robots.txt, Core Web Vitals optimisés)
- [ ] Preloader élégant, smooth scroll Lenis, scroll-triggered GSAP animations, transitions page Framer Motion
- [ ] Design system cohérent : palette distinctive (noir profond + or chaud + blanc cassé ou similaire), typographie premium, motion design system
- [ ] Performance optimisée : next/image, font-display swap, code splitting, responsive mobile/tablette

### Out of Scope

- Backend complexe / CMS — site statique Next.js, contenu hardcodé pour v1
- E-commerce / paiement en ligne — le site est un outil de conversion vers le contact, pas une boutique
- Multi-langues — français uniquement pour v1
- Blog / contenu éditorial — pas dans le périmètre initial
- Authentification utilisateur — site public vitrine uniquement
- Base de données — pas de persistance côté serveur au-delà de l'envoi d'emails

## Context

- **Client:** Maje Concept, PME alsacienne spécialisée dans l'impression et le marquage textile (t-shirts, polos, workwear, objets promotionnels)
- **Positionnement:** Ultra-premium — le site doit refléter un positionnement haut de gamme, pas un atelier discount
- **Objectif:** Générer des leads qualifiés via le formulaire de contact et le configurateur produit
- **Techniques:** Sérigraphie, broderie, DTF, flocage, transfert
- **Audience:** Entreprises, institutionnels, associations recherchant un prestataire print/textile de confiance
- **Esthétique cible:** Indiscernable d'une production d'agence digitale premium — absolument pas "AI slop"
- **Barre qualité:** Animations fluides 60fps, micro-interactions sur tout, typographie maîtrisée, chaque détail soigné

## Constraints

- **Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis — choisi pour SSR/SSG, performance et écosystème animation
- **Langue:** Interface entièrement en français
- **Fonts:** Premium uniquement (Playfair Display + DM Sans ou similaire haut de gamme — pas Inter, Roboto, Arial)
- **Palette:** Distinctive et luxueuse — pas de gradient violet, pas de design générique
- **Curseur:** Système multi-couches obligatoire (curseur custom + follower lag + états contextuels + magnétique + spotlight)
- **Performance:** LCP < 2.5s, CLS < 0.1, INP optimisé
- **Responsive:** Mobile-first, tablette, desktop
- **Email:** API route Next.js avec Resend ou Nodemailer pour envoi formulaire

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router plutôt que Vite SPA | SSR/SSG pour SEO, metadata API native, API routes intégrées | — Pending |
| GSAP + Framer Motion combinés | GSAP ScrollTrigger pour scroll animations, Framer Motion pour layout/page transitions | — Pending |
| Lenis pour smooth scroll | Standard industrie, léger, compatible GSAP ScrollTrigger | — Pending |
| Curseur custom multi-couches | Signature visuelle premium, différenciateur immédiat vs sites génériques | — Pending |
| Tailwind CSS (pas CSS modules) | Développement rapide, thème cohérent, classes utilitaires pour responsive | — Pending |
| Contenu statique hardcodé | Pas de CMS pour v1, simplicité maximale, contenu fictif mais crédible | — Pending |
| Resend pour emails | API moderne, simple, templates HTML, gratuit pour faible volume | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after initialization*
