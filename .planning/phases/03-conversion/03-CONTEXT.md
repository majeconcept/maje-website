# Phase 3: Interactivité & Conversion — Context

**Phase:** 03-conversion
**Goal:** Un visiteur peut configurer un produit et soumettre une demande de devis — le parcours de conversion complet fonctionne de bout en bout

## Decisions

### Locked

- **SVG layers inline React components** — pas de canvas, pas de Three.js pour le configurateur. Composition de calques SVG en JSX pur, mise à jour instantanée via React state.
- **Resend 6.x + react-email 5.x** pour les emails — deux envois dans le même Route Handler : notification Maje Concept + confirmation prospect.
- **`motion/react`** (package `motion`) pour les animations — AnimatePresence pour la success animation du formulaire. Import depuis `motion/react`.
- **Route Handler Next.js** — `/api/contact/route.ts` (App Router), pas de Server Action.
- **react-hook-form + Zod** — validation frontend temps réel + re-validation serveur avec le même schéma Zod.
- **Pas de backend** pour le configurateur — tout client-side, estimation de prix via lookup table en mémoire.
- **Rate limiting in-memory Map + honeypot field** — pas de service externe (pas de Arcjet, pas de Upstash Redis).
- **Pré-remplissage configurateur → formulaire via React Context** (pas URL params) — état partagé dans le même SPA.

### Discretion Areas

- Structure interne des calques SVG du t-shirt (combien de `<path>` exactement, quelles zones)
- Produits proposés dans le configurateur : combien et lesquels (t-shirt certainement, polo ?)
- Palette de couleurs proposée dans le configurateur
- Grille tarifaire exacte pour l'estimation (fourchettes acceptables)
- Mise en page exacte du footer (3 ou 4 colonnes)

## Deferred Ideas (OUT OF SCOPE)

- Configurateur 3D (Three.js / React Three Fiber) — V2-04 dans REQUIREMENTS.md
- Base de données pour stocker les soumissions de formulaire
- Double opt-in newsletter RGPD (hors scope Phase 3 — à noter dans Phase 4)
- Validation Turnstile / hCaptcha — honeypot suffit pour v1
- Analytics sur les conversions configurateur
