# Phase 3: Interactivité & Conversion — Research

**Researched:** 2026-03-28
**Domain:** SVG configurator, contact form with Resend, footer, motion animations
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SVG layers inline React components — pas de canvas, pas de Three.js
- Resend 6.x + react-email 5.x pour les emails (deux envois dans le même Route Handler)
- `motion/react` pour les animations (AnimatePresence pour success)
- Route Handler Next.js `/api/contact/route.ts`
- react-hook-form + Zod (validation client + re-validation serveur)
- Pas de backend pour le configurateur — client-side + lookup table
- Rate limiting in-memory Map + honeypot field (pas de service externe)
- Pré-remplissage via React Context (pas URL params)

### Claude's Discretion
- Structure interne des calques SVG (nombre de paths, zones)
- Produits configurateur (t-shirt + polo recommandé minimum)
- Palette de couleurs configurateur
- Grille tarifaire estimation
- Mise en page footer (3 ou 4 colonnes)

### Deferred Ideas (OUT OF SCOPE)
- Configurateur 3D (Three.js / R3F) — V2-04
- Base de données pour stocker les soumissions
- Double opt-in newsletter RGPD
- Validation Turnstile / hCaptcha
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONF-01 | Interface sélection temps réel : matières, couleurs, dimensions, finitions | SVG layer architecture + React state pattern |
| CONF-02 | Preview 2D SVG mis à jour instantanément selon les choix | Inline React SVG avec `fill` dynamique sur chaque calque |
| CONF-03 | Résumé configuration + estimation de prix | Lookup table garment × quantité × technique |
| CONF-04 | Bouton "Demander un devis" pré-remplit le formulaire contact | ConfiguratorContext partagé entre sections |
| CONT-01 | Formulaire : nom, prénom, email, téléphone, entreprise, type de besoin, message, config produit | react-hook-form champs + Zod schema |
| CONT-02 | Validation frontend temps réel avec messages d'erreur élégants | react-hook-form mode="onChange" + zodResolver |
| CONT-03 | API route `/api/contact` → email notification Maje Concept via Resend | Route Handler + resend.emails.send() |
| CONT-04 | Email confirmation automatique au prospect avec template HTML professionnel | react-email template + second resend.emails.send() |
| CONT-05 | Animation de succès satisfaisante après soumission réussie | AnimatePresence mode="wait" key swap |
| FOOT-01 | Footer : navigation, réseaux sociaux, mentions légales, coordonnées, localisation | Dark bg, 3-4 colonnes Tailwind grid |
| FOOT-02 | Formulaire newsletter collecte emails | Input + submit inline, toast confirmation |
</phase_requirements>

---

## Summary

Phase 3 construit le parcours de conversion complet : un visiteur configure visuellement un produit textile, voit son estimation de prix, puis soumet une demande de devis pré-remplie avec sa configuration. La stack est entièrement client-side pour le configurateur et utilise un seul Route Handler Next.js pour les emails.

Le configurateur SVG fonctionne par composition de calques : plusieurs composants React SVG empilés en `position: absolute`, chaque calque recevant une prop `fill` dérivée du state React. Aucune bibliothèque tierce n'est nécessaire — React + Tailwind suffisent pour l'interactivité. La performance est garantie car les mises à jour de `fill` sur un SVG inline sont des mutations DOM directes sans re-layout.

Le formulaire de contact utilise le trio standardisé react-hook-form + zod + @hookform/resolvers, avec validation `mode="onChange"` pour le feedback temps réel. Le Route Handler envoie deux emails séquentiellement via Resend. L'animation de succès utilise `AnimatePresence mode="wait"` avec un key swap (`key="form"` → `key="success"`) pour remplacer le formulaire par un état de confirmation.

**Primary recommendation:** Implémenter le configurateur comme un composant auto-contenu avec son propre Context, que ContactSection écoute pour le pré-remplissage. Éviter le lifting de state jusqu'à page.tsx — un ConfiguratorContext dédié suffit.

---

## Standard Stack

### Core (déjà installé dans le projet)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | AnimatePresence success animation | Déjà installé, import `motion/react` |
| gsap + @gsap/react | 3.14.2 / 2.1.2 | ScrollTrigger entrance animations des sections | Déjà installé, pattern useGSAP établi |
| react-hook-form | 7.x | Form state management | Standard stack décidé en Phase 1 |
| zod | 3.x | Validation schema partagé client/serveur | Standard stack décidé en Phase 1 |
| @hookform/resolvers | 5.x | Bridge zodResolver | Standard stack décidé en Phase 1 |

### À installer
| Library | Version | Purpose | Installation |
|---------|---------|---------|-------------|
| resend | 6.x | Envoi emails transactionnels | `npm install resend` |
| react-email | 5.x | Templates HTML emails React | `npm install react-email @react-email/components` |
| @hookform/resolvers | 5.x | zodResolver | `npm install @hookform/resolvers` |

**Note:** Vérifier si react-hook-form et zod sont déjà dans package.json. Si non, installer avec `npm install react-hook-form zod @hookform/resolvers`.

**Version verification:**
```bash
npm view resend version          # 6.x
npm view react-email version     # 5.x
npm view @react-email/components version
npm view react-hook-form version # 7.x
npm view zod version             # 3.x
```

**Installation:**
```bash
npm install resend react-email @react-email/components
npm install react-hook-form zod @hookform/resolvers
```

---

## Architecture Patterns

### Recommended File Structure (Phase 3 additions)
```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # POST handler: Zod → Resend × 2
│   └── page.tsx                  # Remplacer les placeholders Phase 3
├── components/
│   ├── sections/
│   │   ├── ConfiguratorSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   └── emails/
│       ├── NotificationEmail.tsx  # Email à Maje Concept
│       └── ConfirmationEmail.tsx  # Email au prospect
├── data/
│   └── configurator.ts           # PRODUCTS, PRICE_TABLE, COLORS, TECHNIQUES
└── lib/
    └── validations.ts            # contactFormSchema (Zod) — partagé client + serveur
```

### Pattern 1: SVG Layer Architecture (CONF-01, CONF-02)

**What:** Plusieurs composants SVG React empilés en `absolute`, chaque calque recevant sa couleur en prop.

**Structure recommandée — t-shirt avec 4 calques:**
```
<div className="relative w-full aspect-square">
  {/* Calque 1 — base silhouette (fond uni, couleur principale) */}
  <TshirtBase fill={config.color} className="absolute inset-0 w-full h-full" />

  {/* Calque 2 — ombres/plis (opacité fixe, blend mode multiply) */}
  <TshirtShadows className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply" />

  {/* Calque 3 — zone de marquage (rectangle/zone avec bordure pointillée) */}
  <TshirtMarkingZone
    technique={config.technique}
    className="absolute inset-0 w-full h-full"
  />

  {/* Calque 4 — logo placeholder (texte MC centré dans la zone) */}
  <TshirtLogoPlaceholder className="absolute inset-0 w-full h-full" />
</div>
```

**Règle clé:** Chaque composant SVG reçoit `fill` comme prop React. La mise à jour est synchrone et ne cause pas de re-layout — uniquement une mutation d'attribut SVG.

**Exemple de composant SVG calque:**
```typescript
// Source: pattern SVG React standard
interface TshirtBaseProps {
  fill: string;
  className?: string;
}

export function TshirtBase({ fill, className }: TshirtBaseProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Silhouette t-shirt simplifiée — les paths exacts sont à dessiner */}
      <path
        d="M100,60 L60,100 L80,120 L140,90 L140,340 L260,340 L260,90 L320,120 L340,100 L300,60 L240,40 C240,40 220,60 200,60 C180,60 160,40 160,40 Z"
        fill={fill}
        stroke="none"
      />
    </svg>
  );
}
```

**Source:** Pattern standard SVG React inline — confiance HIGH (documentation React officielle).

### Pattern 2: Configurator State Architecture (CONF-01, CONF-03, CONF-04)

**What:** React Context dédié `ConfiguratorContext` partagé entre ConfiguratorSection et ContactSection.

**Pourquoi Context et pas URL params:**
- Le site est un SPA single-page — tout est en mémoire
- URL params survivent au refresh (non nécessaire ici)
- Context est plus simple, pas de parsing/encoding nécessaire
- L'état configurateur n'a pas besoin d'être partageable en lien

```typescript
// Source: pattern React Context standard
// src/lib/configuratorContext.tsx (ou dans providers/)

export interface ConfiguratorState {
  productType: 'tshirt' | 'polo' | 'sweat';
  color: string;             // hex color
  colorName: string;         // "Noir profond", "Blanc cassé", etc.
  technique: 'serigraphie' | 'broderie' | 'dtf' | 'flocage';
  quantity: 10 | 25 | 50 | 100 | 250 | 500;
  size: 'XS-XL' | 'XS-3XL';
  estimatedPrice: number;    // calculé via lookup table
  hasConfig: boolean;        // true si l'utilisateur a fait au moins un choix
}

interface ConfiguratorContextValue {
  config: ConfiguratorState;
  updateConfig: (updates: Partial<ConfiguratorState>) => void;
  resetConfig: () => void;
}

export const ConfiguratorContext = createContext<ConfiguratorContextValue>(...)
```

**Où placer ce Context:** Dans `layout.tsx` ou en wrapper dans `page.tsx` — doit être accessible à la fois par ConfiguratorSection et ContactSection.

### Pattern 3: Price Estimation Lookup Table (CONF-03)

**What:** Table de prix client-side, pas de backend. Fourchettes de prix réalistes pour le print textile alsacien.

```typescript
// src/data/configurator.ts
// Source: Connaissance métier print textile — confidence MEDIUM (vérifier avec client)

export const PRICE_TABLE: Record<
  ConfiguratorState['productType'],
  Record<ConfiguratorState['technique'],
    Record<ConfiguratorState['quantity'], number>>
> = {
  tshirt: {
    serigraphie: {
      10: 18, 25: 14, 50: 11, 100: 9, 250: 7.5, 500: 6.5
    },
    broderie: {
      10: 22, 25: 18, 50: 15, 100: 13, 250: 11, 500: 10
    },
    dtf: {
      10: 16, 25: 13, 50: 10, 100: 8.5, 250: 7, 500: 6
    },
    flocage: {
      10: 15, 25: 12, 50: 9.5, 100: 8, 250: 6.5, 500: 5.5
    }
  },
  polo: { /* same structure, ~20% higher */ },
  sweat: { /* same structure, ~40% higher */ }
};

export function estimatePrice(config: ConfiguratorState): number {
  return PRICE_TABLE[config.productType][config.technique][config.quantity];
}
```

**Note:** Afficher comme "À partir de X€/pièce" — ce sont des fourchettes, pas des prix fermes. L'invitation à demander un devis reste l'appel à l'action principal.

### Pattern 4: Contact Form — react-hook-form + Zod (CONT-01, CONT-02)

**What:** Schéma Zod partagé entre client (zodResolver) et serveur (Route Handler). Validation `mode="onChange"` pour feedback temps réel.

```typescript
// Source: react-hook-form official docs + zod official docs — confidence HIGH
// src/lib/validations.ts

import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (min. 2 caractères)"),
  lastName: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  needType: z.enum([
    "serigraphie",
    "broderie",
    "dtf",
    "flocage",
    "marquage-textile",
    "autre"
  ], { required_error: "Veuillez sélectionner un type de besoin" }),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
  // Pré-remplissage depuis configurateur (optionnel)
  configuratorSummary: z.string().optional(),
  // Honeypot — doit rester vide
  website: z.string().max(0, "Champ invalide").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

**Usage dans ContactSection.tsx:**
```typescript
// Source: react-hook-form docs — confidence HIGH
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

const form = useForm<ContactFormData>({
  resolver: zodResolver(contactFormSchema),
  mode: "onChange",  // Validation à chaque keystroke — feedback temps réel
  defaultValues: {
    // Pré-remplissage depuis ConfiguratorContext
    configuratorSummary: config.hasConfig
      ? `${config.colorName} ${config.productType} × ${config.quantity} — ${config.technique}`
      : "",
  }
});
```

### Pattern 5: Route Handler Next.js avec Resend (CONT-03, CONT-04)

**What:** `/api/contact/route.ts` — POST handler avec Zod re-validation serveur, deux envois Resend, rate limiting in-memory.

```typescript
// Source: resend.com/docs/send-with-nextjs — confidence HIGH
// src/app/api/contact/route.ts
"use server" // implicite pour route handlers, mais pas nécessaire d'annoter

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations";
import { NotificationEmail } from "@/components/emails/NotificationEmail";
import { ConfirmationEmail } from "@/components/emails/ConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── In-memory rate limiting ──
// Réinitialise si le process redémarre (acceptable pour v1 faible volume)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;      // 3 soumissions
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // par heure

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

// Nettoyage périodique — prévient la croissance mémoire illimitée
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetAt) rateLimitMap.delete(key);
  }
}, 60 * 60 * 1000); // toutes les heures

export async function POST(request: NextRequest) {
  // 1. Rate limiting par IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  // 2. Parse + validation serveur (re-validation — jamais faire confiance au client)
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const data = parsed.data;

  // 3. Vérification honeypot (doit être vide si humain)
  if (data.website) {
    // Simuler un succès pour ne pas révéler la détection au bot
    return NextResponse.json({ success: true });
  }

  // 4. Envoi email notification à Maje Concept
  const { error: notifError } = await resend.emails.send({
    from: "Site Maje Concept <noreply@maje-concept.fr>",
    to: ["contact@maje-concept.fr"],
    subject: `Nouvelle demande de devis — ${data.firstName} ${data.lastName}`,
    react: NotificationEmail({ data }),
  });

  if (notifError) {
    console.error("Resend notification error:", notifError);
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }

  // 5. Envoi email confirmation au prospect
  await resend.emails.send({
    from: "Maje Concept <noreply@maje-concept.fr>",
    to: [data.email],
    subject: "Votre demande de devis a bien été reçue — Maje Concept",
    react: ConfirmationEmail({ firstName: data.firstName }),
  });

  return NextResponse.json({ success: true });
}
```

**Note importante:** L'adresse `from` doit utiliser un domaine vérifié dans Resend. En développement, `onboarding@resend.dev` fonctionne. En production, vérifier le domaine `maje-concept.fr` dans le tableau de bord Resend.

### Pattern 6: react-email Templates (CONT-04)

**What:** Composants React rendus côté serveur par Resend en HTML email. Importer depuis `@react-email/components`.

```typescript
// Source: react-email 5.x docs — confidence HIGH
// src/components/emails/ConfirmationEmail.tsx

import {
  Html, Head, Body, Container, Section,
  Heading, Text, Hr, Link
} from "@react-email/components";

interface ConfirmationEmailProps {
  firstName: string;
}

export function ConfirmationEmail({ firstName }: ConfirmationEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Body style={{ backgroundColor: "#0A0A0F", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          {/* Logo / nom */}
          <Heading style={{ color: "#C9A84C", fontSize: "24px", letterSpacing: "-0.02em" }}>
            Maje Concept
          </Heading>

          <Text style={{ color: "#F5F5F0", fontSize: "16px", lineHeight: "1.6" }}>
            Bonjour {firstName},
          </Text>

          <Text style={{ color: "#F5F5F0", fontSize: "16px", lineHeight: "1.6" }}>
            Votre demande de devis a bien été reçue. Notre équipe l'examinera
            dans les meilleurs délais et vous contactera sous 24 heures ouvrées.
          </Text>

          <Hr style={{ borderColor: "#C9A84C30", margin: "32px 0" }} />

          <Text style={{ color: "#8A8A8A", fontSize: "13px" }}>
            Maje Concept — Spécialiste du Print &amp; Marquage Textile en Alsace
            <br />
            <Link href="https://maje-concept.fr" style={{ color: "#C9A84C" }}>
              maje-concept.fr
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

**Note:** react-email 5.x supporte Tailwind 4 mais il est plus sûr d'utiliser les styles inline pour les emails — la compatibilité des clients email (Outlook, Gmail) est meilleure avec styles inline qu'avec classes CSS.

### Pattern 7: AnimatePresence Success Animation (CONT-05)

**What:** Remplacer le formulaire par un état de succès avec animation. Key swap avec `mode="wait"`.

```typescript
// Source: motion.dev/docs/react-animate-presence — confidence HIGH
// Import OBLIGATOIRE depuis motion/react (pas framer-motion)
import { AnimatePresence, motion } from "motion/react";

// State dans ContactSection
const [isSubmitted, setIsSubmitted] = useState(false);

// Dans le JSX
<AnimatePresence mode="wait">
  {!isSubmitted ? (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* champs du formulaire */}
      </form>
    </motion.div>
  ) : (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-16"
    >
      {/* Icône checkmark animée (motion.svg path draw) */}
      <motion.svg
        viewBox="0 0 52 52"
        className="w-16 h-16 mx-auto mb-6 text-brand-gold"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="26" cy="26" r="25"
          fill="none" stroke="currentColor" strokeWidth="2"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        />
        <motion.path
          d="M14 27 L22 35 L38 19"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { duration: 0.4, delay: 0.5, ease: "easeOut" } }
          }}
        />
      </motion.svg>

      <h3 className="font-display text-3xl text-brand-cream mb-4">
        Demande envoyée
      </h3>
      <p className="font-body text-brand-muted">
        Nous vous répondrons sous 24 heures ouvrées.
      </p>
    </motion.div>
  )}
</AnimatePresence>
```

**Règle motion/react:** Ne jamais importer depuis `framer-motion`. Toujours `import { AnimatePresence, motion } from "motion/react"`.

### Pattern 8: Honeypot Field (protection anti-spam)

**What:** Champ invisible pour humains, rempli automatiquement par les bots.

```typescript
// Dans le formulaire JSX — invisible pour les humains
<div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
  <label htmlFor="website">
    Ne pas remplir ce champ
    <input
      id="website"
      type="text"
      tabIndex={-1}
      autoComplete="off"
      {...register("website")}
    />
  </label>
</div>
```

**Ne pas utiliser `display: none`** — certains bots le détectent. Utiliser `position: absolute` hors écran.

### Pattern 9: Footer Layout (FOOT-01, FOOT-02)

**What:** 4 colonnes sur desktop, empilé sur mobile. Background `brand-charcoal`, séparateur gold subtil en haut.

**Structure recommandée (4 colonnes):**
```
Col 1: Logo + tagline + réseaux sociaux (Facebook, Instagram, LinkedIn)
Col 2: Navigation (liens vers sections #hero #portfolio #expertises #configurateur #contact)
Col 3: Coordonnées (adresse Alsace, téléphone, email)
Col 4: Newsletter (input email + bouton)
```

```tsx
// Pattern Layout Tailwind v4
<footer className="bg-brand-charcoal border-t border-brand-gold/20">
  <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
    {/* 4 colonnes */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
      {/* Col 1 — Brand */}
      {/* Col 2 — Navigation */}
      {/* Col 3 — Contact */}
      {/* Col 4 — Newsletter */}
    </div>

    {/* Bottom bar */}
    <div className="border-t border-brand-cream/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between gap-4">
      <p className="font-body text-brand-muted text-xs">
        © 2026 Maje Concept — Tous droits réservés
      </p>
      <nav className="flex gap-6">
        <a href="/mentions-legales" className="font-body text-brand-muted text-xs hover:text-brand-gold transition-colors">
          Mentions légales
        </a>
        <a href="/politique-confidentialite" className="font-body text-brand-muted text-xs hover:text-brand-gold transition-colors">
          Politique de confidentialité
        </a>
      </nav>
    </div>
  </div>
</footer>
```

### Anti-Patterns to Avoid

- **Importer depuis `framer-motion`:** La dépendance n'est pas installée — importer depuis `motion/react` uniquement.
- **Stocker la position du curseur dans React state:** Déjà établi Phase 1 — utiliser `setVariant("crosshair")` sur le configurateur, pas de state position.
- **Appeler `resend.emails.send()` côté client:** Resend ne doit être appelé que dans le Route Handler (côté serveur). La clé API ne doit jamais être exposée au browser.
- **Validation uniquement côté client:** Toujours re-valider avec Zod dans le Route Handler — le body de la requête peut être forgé.
- **Mutater ConfiguratorState directement:** Utiliser `updateConfig(partial)` du Context — toujours immutable.
- **SVG avec `<img src="...svg">`:** Le SVG doit être inline (JSX) pour que les props `fill` fonctionnent dynamiquement.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Validation formulaire | Validation manuelle avec `onChange` handlers | react-hook-form + zodResolver | Gestion d'état complexe (touched, dirty, errors), mode onChange, reset() |
| Email templating | Chaînes de template literals HTML | react-email components | Compatibilité Gmail/Outlook, responsive, preview dev server |
| Animation exit | CSS transitions manuelles sur `display: none` | AnimatePresence | Exit animations impossibles avec CSS seul sur unmount |
| Schema partagé | Types TypeScript dupliqués client/serveur | `z.infer<typeof schema>` | Zod génère les types TypeScript automatiquement |
| SVG color fills | Canvas API ou CSS filter: hue-rotate | SVG `fill` prop inline | Plus précis, plus simple, pas de conversion de couleurs |

**Key insight:** La composition SVG inline React est la bonne approche ici — c'est exactement ce pour quoi React a été conçu (données → rendu). La mise à jour d'un attribut `fill` SVG est une mutation DOM directe, non un repaint complet.

---

## Common Pitfalls

### Pitfall 1: RESEND_API_KEY non définie côté serveur
**What goes wrong:** `TypeError: Cannot read properties of undefined` au premier appel Resend en production.
**Why it happens:** `.env.local` n'est pas commité, la variable n'est pas définie dans l'environnement de déploiement.
**How to avoid:** Vérifier explicitement au démarrage du Route Handler: `if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set")`. Documenter la variable requise.
**Warning signs:** Erreur 500 sur le formulaire, pas de log d'erreur Resend visible.

### Pitfall 2: SVG `fill` ignoré si défini en CSS
**What goes wrong:** La couleur ne change pas malgré les bonnes props React.
**Why it happens:** Un `fill` défini en CSS (ex: `fill: currentColor`) a une priorité plus haute que l'attribut SVG `fill`.
**How to avoid:** Ne jamais mettre `fill` dans le CSS des composants SVG calques. Passer `fill` uniquement en attribut prop. Vérifier que le SVG source n'a pas `fill` hardcodé.
**Warning signs:** La couleur reste la même quelle que soit la sélection.

### Pitfall 3: `setInterval` dans un module Next.js
**What goes wrong:** En développement avec HMR, le `setInterval` de nettoyage du rate limiter se multiplie à chaque hot reload.
**Why it happens:** Le module est ré-évalué à chaque HMR mais l'intervalle précédent n'est pas nettoyé.
**How to avoid:** Utiliser une variable module-level avec garde: `if (!(global as any).__rateLimitCleanupStarted) { setInterval(...); (global as any).__rateLimitCleanupStarted = true; }`. En production ce n'est pas un problème.
**Warning signs:** Logs de nettoyage en doublon dans la console de dev.

### Pitfall 4: AnimatePresence sans clé unique
**What goes wrong:** L'animation de sortie ne se joue pas — React réutilise le même nœud DOM.
**Why it happens:** AnimatePresence détecte les changements par key prop. Sans key différente, React ne considère pas qu'un composant est sorti.
**How to avoid:** Toujours définir `key="form"` et `key="success"` explicitement. Ne jamais omettre les keys dans AnimatePresence.
**Warning signs:** Le formulaire disparaît sans animation, le succès apparaît brutalement.

### Pitfall 5: ConfiguratorContext en dehors du Provider
**What goes wrong:** `useConfiguratorContext()` retourne les valeurs par défaut (hasConfig: false) même après configuration.
**Why it happens:** Le Context n'est pas wrappé assez haut dans l'arbre — ConfiguratorSection et ContactSection doivent être sous le même Provider.
**How to avoid:** Placer `<ConfiguratorProvider>` dans `page.tsx` (ou `layout.tsx`) comme wrappeur de `<main>`. Vérifier que les deux sections sont dans le subtree.
**Warning signs:** Le formulaire ne se pré-remplit jamais malgré la configuration.

### Pitfall 6: react-email + Tailwind dans les emails
**What goes wrong:** Les classes Tailwind ne s'appliquent pas dans les emails — Outlook et certains clients ignorent les `<style>` embeds.
**Why it happens:** Les clients email ne supportent pas les feuilles de style — ils supportent uniquement les styles inline.
**How to avoid:** Utiliser les styles inline dans les templates react-email (`style={{ color: "#C9A84C" }}`). Réserver les classes Tailwind pour la prévisualisation web uniquement.
**Warning signs:** L'email s'affiche sans styles dans Outlook.

### Pitfall 7: Cursor variant sur le configurateur
**What goes wrong:** Le curseur reste en état "default" sur l'interface de sélection du configurateur.
**Why it happens:** `setVariant("crosshair")` n'est pas appelé sur les éléments interactifs du configurateur.
**How to avoid:** Appeler `setVariant("crosshair")` sur `onMouseEnter` de la zone preview SVG, `setVariant("hover")` sur les sélecteurs de couleur/technique, `setVariant("default")` sur `onMouseLeave`.

---

## Code Examples

### Configurator: Mise à jour instantanée du preview SVG
```typescript
// Source: pattern React standard — confidence HIGH
// Dans ConfiguratorSection.tsx

const [config, setConfig] = useState<ConfiguratorState>(DEFAULT_CONFIG);

// Sélecteur de couleur
<div className="flex gap-3 flex-wrap">
  {COLORS.map((color) => (
    <button
      key={color.value}
      onClick={() => setConfig(prev => ({ ...prev, color: color.value, colorName: color.name }))}
      onMouseEnter={() => setVariant("hover")}
      onMouseLeave={() => setVariant("default")}
      className={cn(
        "w-8 h-8 rounded-full border-2 transition-all duration-200",
        config.color === color.value
          ? "border-brand-gold scale-110"
          : "border-transparent hover:border-brand-cream/40"
      )}
      style={{ backgroundColor: color.value }}
      aria-label={color.name}
      aria-pressed={config.color === color.value}
    />
  ))}
</div>

// Preview — mise à jour immédiate via prop
<div
  className="relative aspect-square max-w-sm mx-auto"
  onMouseEnter={() => setVariant("crosshair")}
  onMouseLeave={() => setVariant("default")}
>
  <TshirtBase fill={config.color} className="absolute inset-0 w-full h-full" />
  <TshirtShadows className="absolute inset-0 w-full h-full" />
  <TshirtMarkingZone technique={config.technique} className="absolute inset-0 w-full h-full" />
</div>
```

### Contact Form: Pré-remplissage depuis le configurateur
```typescript
// Source: pattern React Context + react-hook-form — confidence HIGH
// Dans ContactSection.tsx

const { config } = useConfigurator(); // Context partagé

// reset() react-hook-form quand la config change
useEffect(() => {
  if (config.hasConfig) {
    form.setValue(
      "configuratorSummary",
      `${config.colorName} ${config.productType} × ${config.quantity} — ${config.technique} (≈ ${config.estimatedPrice}€/pièce)`
    );
  }
}, [config, form]);
```

### Route Handler: Double envoi Resend
```typescript
// Source: resend.com/docs/send-with-nextjs — confidence HIGH
// Les deux envois sont séquentiels — si le premier échoue, on retourne 500
// Si le second échoue, on log mais on retourne success (la notification principale est passée)

const { error: notifError } = await resend.emails.send({
  from: "Site Maje Concept <noreply@maje-concept.fr>",
  to: ["contact@maje-concept.fr"],
  subject: `Nouvelle demande — ${data.firstName} ${data.lastName}`,
  react: NotificationEmail({ data }),
});

if (notifError) {
  return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
}

// Confirmation prospect — erreur non-bloquante
const { error: confirmError } = await resend.emails.send({
  from: "Maje Concept <noreply@maje-concept.fr>",
  to: [data.email],
  subject: "Votre demande de devis a bien été reçue",
  react: ConfirmationEmail({ firstName: data.firstName }),
});

if (confirmError) {
  console.error("Confirmation email failed (non-blocking):", confirmError);
  // Ne pas bloquer — la notification principale est envoyée
}

return NextResponse.json({ success: true });
```

### Footer: Newsletter input inline
```typescript
// Pattern simple — pas de validation complexe, juste collecte email
// RGPD: ajouter une case à cocher consentement ou mention "En vous inscrivant vous acceptez..."
const [newsletterEmail, setNewsletterEmail] = useState("");
const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");

const handleNewsletter = async (e: React.FormEvent) => {
  e.preventDefault();
  // Pour v1 : envoyer via /api/contact avec type="newsletter" ou stocker en local
  // Pour v2 : Mailchimp / Brevo API
  setNewsletterStatus("success");
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` | 2024 (rebranding) | Import path change, API identique |
| GSAP Club plugins (payants) | `gsap` npm public (gratuit) | Post-Webflow acquisition | Tous les plugins gratuits |
| `import Resend from "resend"` | `import { Resend } from "resend"` | v6.x | Named export |
| react-email avec Tailwind CSS classes | react-email avec styles inline | Toujours recommandé | Compatibilité email clients |
| `framer-motion` AnimatePresence | `motion/react` AnimatePresence | 2024 | Même API, nouveau nom de package |

**Deprecated/outdated:**
- `framer-motion` package: Renommé en `motion`. Ne pas installer `framer-motion` — le package `motion` est installé dans ce projet.
- `@studio-freight/lenis`: Renommé en `lenis`. Déjà corrigé dans ce projet.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Resend API calls, Route Handler | ✓ | 22.x | — |
| resend (npm) | CONT-03, CONT-04 | A installer | 6.x | — (requis) |
| react-email (npm) | CONT-03, CONT-04 | A installer | 5.x | Nodemailer + HTML string (non recommandé) |
| react-hook-form (npm) | CONT-01, CONT-02 | A installer | 7.x | — (requis) |
| zod (npm) | CONT-01, CONT-02 | A installer | 3.x | — (requis) |
| RESEND_API_KEY (.env.local) | CONT-03, CONT-04 | ✗ (à configurer) | — | Domaine resend.dev pour tests |
| Domaine email vérifié Resend | Envoi depuis domaine Maje | ✗ (à vérifier) | — | `onboarding@resend.dev` pour dev |

**Missing dependencies with no fallback:**
- `RESEND_API_KEY` en `.env.local` — le formulaire ne fonctionnera pas sans. Action Wave 0: créer `.env.local` avec la clé.

**Missing dependencies with fallback:**
- Domaine vérifié Resend: utiliser `onboarding@resend.dev` en développement.

---

## Validation Architecture

> nyquist_validation non explicitement défini — traité comme activé.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Non configuré dans ce projet (package.json sans test runner) |
| Config file | Aucun — à créer en Wave 0 si tests requis |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONF-01 | Sélection couleur met à jour le state | unit | Non configuré | ❌ Wave 0 |
| CONF-02 | SVG fill change avec le state | unit | Non configuré | ❌ Wave 0 |
| CONF-03 | estimatePrice(config) retourne un nombre > 0 | unit | Non configuré | ❌ Wave 0 |
| CONT-02 | Zod validation rejette email invalide | unit | Non configuré | ❌ Wave 0 |
| CONT-03 | Route Handler POST retourne 200 avec données valides | integration | Non configuré | ❌ Wave 0 |
| CONT-03 | Route Handler POST retourne 400 avec données invalides | integration | Non configuré | ❌ Wave 0 |
| CONT-03 | Route Handler POST retourne 429 après rate limit | integration | Non configuré | ❌ Wave 0 |

**Recommandation:** Étant donné que le projet n'a pas de framework de test configuré, les tests sont à valider manuellement pour Phase 3. Si des tests automatisés sont souhaités, ajouter Vitest en Wave 0. Les critères de succès des plans serviront de checklist de validation manuelle.

### Wave 0 Gaps
- [ ] Aucun framework de test configuré — validation manuelle via checklist dans chaque plan
- [ ] `.env.local` avec `RESEND_API_KEY` — à créer avant Wave 1
- [ ] Domaine Resend vérifié (ou `onboarding@resend.dev` pour dev)

---

## Open Questions

1. **Domaines SVG du t-shirt**
   - What we know: SVG inline React avec fill dynamique est la bonne approche
   - What's unclear: Les paths SVG exacts du t-shirt, polo — doivent être dessinés ou trouvés (SVG public domain t-shirt outline)
   - Recommendation: Rechercher "t-shirt SVG outline free" ou utiliser une forme simplifiée géométrique crédible pour v1. L'essentiel est la démonstration du concept.

2. **from: adresse email Resend en production**
   - What we know: Resend exige un domaine vérifié pour l'envoi en production
   - What's unclear: Si `maje-concept.fr` est accessible et peut être vérifié dans Resend
   - Recommendation: Utiliser `onboarding@resend.dev` en dev. Documenter dans Wave 0 que la mise en prod nécessite la vérification du domaine dans le dashboard Resend.

3. **Newsletter: backend de stockage**
   - What we know: FOOT-02 requiert un formulaire newsletter
   - What's unclear: Où stocker les emails collectés (pas de base de données dans ce projet)
   - Recommendation: Pour v1, envoyer l'email newsletter comme une soumission de contact avec type="newsletter" via `/api/contact`. Stocker via Resend contacts API (si disponible) ou simplement logger. Documenter comme "v2 Mailchimp/Brevo".

---

## Sources

### Primary (HIGH confidence)
- [resend.com/docs/send-with-nextjs](https://resend.com/docs/send-with-nextjs) — Route Handler pattern, react parameter, API key
- [motion.dev/docs/react-animate-presence](https://motion.dev/docs/react-animate-presence) — AnimatePresence mode="wait", key swap pattern
- [react-hook-form official docs](https://react-hook-form.com/docs) — useForm, mode="onChange", setValue
- [zod official docs](https://zod.dev) — safeParse, z.infer, email validation
- Documentation projet: ARCHITECTURE.md, STACK.md — patterns établis Phases 1-2
- Codebase: SocialProofSection.tsx, CursorProvider.tsx, AnimationProvider.tsx — patterns réels en usage

### Secondary (MEDIUM confidence)
- [freecodecamp.org — In-Memory Rate Limiter Next.js](https://www.freecodecamp.org/news/how-to-build-an-in-memory-rate-limiter-in-nextjs/) — Map-based TTL pattern
- [react-email 5.x blog](https://resend.com/blog/react-email-5) — Tailwind 4 support, inline styles recommendation
- Pricing estimates (PRICE_TABLE) — basé sur connaissance métier print textile, à valider avec le client

### Tertiary (LOW confidence)
- SVG paths t-shirt: à créer manuellement ou trouver une source libre — non vérifié

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — packages vérifiés npm, déjà partiellement installés dans le projet
- Architecture: HIGH — patterns établis dans les phases précédentes, coherents avec codebase existant
- SVG Layer Design: MEDIUM — approche technique certaine, paths SVG exacts à créer
- Price Table: MEDIUM — fourchettes réalistes mais à valider avec Maje Concept
- Pitfalls: HIGH — basé sur documentation officielle et codebase existante

**Research date:** 2026-03-28
**Valid until:** 2026-05-28 (stable — les APIs Resend, motion/react, react-hook-form ne changeront pas de façon incompatible dans 2 mois)
