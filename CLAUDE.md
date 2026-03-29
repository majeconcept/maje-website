## Projet

**Maje Concept — Site Vitrine Ultra-Premium**

Site vitrine pour Maje Concept, spécialiste du print et marquage textile en Alsace. L'objectif est d'inspirer confiance immédiatement, démontrer l'expertise et convertir les visiteurs en leads via le formulaire de contact.

**Statut :** Site complet, déployé en production.

---

## Stack réelle

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 15.5.14 | App Router, SSG, API routes |
| React | 19.1.0 | UI |
| TypeScript | 5.x | Typage |
| Tailwind CSS | **4.0.7 (pinné)** | Styles — ne pas upgrader en 4.1.x (bug Turbopack) |
| GSAP | 3.14.x | Animations scroll, timelines, SplitText |
| @gsap/react | 2.1.x | Hook `useGSAP()` — toujours utiliser à la place de useEffect |
| Lenis | 1.3.x | Smooth scroll — import `ReactLenis` depuis `lenis/react` |
| motion | 12.x | Transitions de page, micro-interactions (import depuis `motion/react`) |
| shadcn/ui | latest | Composants UI (Dialog, Form, Input) |
| react-hook-form | 7.x | Formulaire de contact |
| zod | 3.x | Validation schéma client + serveur |
| Resend | 6.x | Envoi email API route — instancier DANS le handler, pas au niveau module |
| react-email | 5.x | Templates email React |

**Fonts custom :** Polly (Thin/Light/Regular/Bold) en `.woff2` — chargées via `next/font/local`.

---

## Déploiement

| Cible | URL | Commande |
|-------|-----|---------|
| **Production (Cloudflare Pages)** | https://majeconcept.com | `npm run deploy` |
| Staging (Vercel) | https://maje-website.vercel.app | `vercel --prod` |
| GitHub | https://github.com/majeconcept/maje-website | `git push` |

**Build Cloudflare :**
```bash
npm run build:cf   # next build + @cloudflare/next-on-pages
npm run deploy     # build:cf + wrangler pages deploy
```

**Important Cloudflare :** L'API route `/api/contact` utilise `export const runtime = "edge"`.

---

## Git workflow

- Toujours travailler sur la branche **`dev`**
- **Ne jamais merger ou pusher en `main` sans demande explicite**
- `main` = production Cloudflare Pages

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Page principale (SSG)
│   ├── layout.tsx            # Layout global + fonts + Lenis
│   └── api/contact/route.ts  # Envoi email Resend (Edge runtime)
├── components/
│   ├── sections/             # Sections de la page (Hero, Services, etc.)
│   ├── emails/               # Templates react-email
│   └── ui/                   # Composants shadcn/ui
└── lib/
    └── validations.ts        # Schéma Zod formulaire contact
```

---

## Conventions clés

- **GSAP :** Toujours `useGSAP()` depuis `@gsap/react` — jamais `useEffect` pour les animations
- **Lenis :** Initialisé dans `layout.tsx` via `<ReactLenis root>`
- **Animations :** GSAP pour les séquences scroll complexes, `motion` pour les transitions UI simples
- **Resend :** Instancier `new Resend(process.env.RESEND_API_KEY)` **dans** le handler POST, pas au niveau module (erreur de build sinon)
- **Tailwind :** Config CSS-first (pas de `tailwind.config.js`) — variables dans `globals.css`
- **Images :** `next/image` obligatoire
- **Fonts :** `next/font/local` avec Polly (variable `--font-polly`) — jamais de `<link>` Google Fonts

---

## Variables d'environnement

```env
RESEND_API_KEY=           # Clé API Resend (dans Cloudflare Pages → Settings → Variables)
RESEND_FROM_ADDRESS=      # Ex: noreply@maje-concept.fr
CONTACT_EMAIL=            # Ex: contact@maje-concept.fr
```

---

## Commandes utiles

```bash
npm run dev          # Dev local (Turbopack)
npm run build        # Build standard (Vercel)
npm run build:cf     # Build pour Cloudflare Pages
npm run deploy       # Deploy Cloudflare Pages prod
```
