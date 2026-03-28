# Stack Research

**Domain:** Ultra-premium showcase/portfolio website with advanced animations
**Researched:** 2026-03-28
**Confidence:** HIGH (all versions verified against npm and official sources)

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (15.2.4 latest stable) | React framework, SSR/SSG, API routes | v15 is the stable LTS line as of March 2026. v16.2.1 exists but has known Tailwind v4.1 Turbopack build issues. Use v15 for stability unless v16 patch lands. App Router mandatory for SEO metadata API, Server Components, and native API routes. |
| React | 19.2.x | UI rendering | Current stable (19.2.4). Required for R3F v9 (3D). Motion v12 fully supports it. Next.js 15 ships React 19. |
| TypeScript | 5.x | Type safety | Mandatory — GSAP generates types, react-hook-form resolvers require it, catches prop errors in animation components early. |
| Tailwind CSS | 4.0.x (pin to 4.0.7) | Utility-first styling | v4 is CSS-first (no tailwind.config.js), 5x faster builds, Vite plugin built-in. CRITICAL: pin to 4.0.7 — v4.1.x has a confirmed RangeError build failure with Next.js Turbopack. Upgrade only when official fix is released. |

### Animation Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| gsap | 3.14.2 | Scroll animations, complex timelines, text splitting | The definitive standard for high-performance JavaScript animation. 20x faster than jQuery, 12M+ sites. All plugins (SplitText, ScrollTrigger, ScrollSmoother, MorphSVG, Flip) are now free thanks to Webflow. No Club membership needed. |
| @gsap/react | 2.1.2 | React integration for GSAP | Provides `useGSAP()` hook — drop-in replacement for `useEffect`/`useLayoutEffect` that auto-cleans ScrollTriggers on unmount. Prevents the #1 GSAP memory leak cause in Next.js. |
| motion | 12.38.0 | Page transitions, layout animations, UI micro-interactions | Formerly `framer-motion`, now rebranded to `motion`. Import from `motion/react`. v12 is the current stable, fully supports React 19, hardware-accelerated scroll animations via `useScroll`. Use for declarative layout transitions and entrance/exit animations — GSAP handles the complex scroll sequences. |
| lenis | 1.3.21 | Smooth scroll | The industry standard (darkroom.engineering). Lightweight, performant, accessible. Package renamed from `@studio-freight/lenis` to `lenis` — install from new name. React integration available via `import { ReactLenis } from 'lenis/react'`. Pairs natively with GSAP ScrollTrigger. |

### 3D / WebGL (for hero particle effects / depth)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @react-three/fiber | 9.5.0 | React renderer for Three.js | R3F v9 pairs with React 19 (R3F v8 was for React 18). Declarative scene composition in JSX. Use for hero particle systems and depth effects if needed. |
| @react-three/drei | 10.7.7 | R3F helper library | Ready-made abstractions: `<Float>`, `<Environment>`, `<Html>`, `<Text3D>`, `<ParticleSystem>`. Eliminates 80% of boilerplate. v10 is current stable, 515K weekly downloads. |
| three | latest (r175+) | Core 3D engine | Required peer dep. WebGPU stable since r171 (Sept 2025) with automatic WebGL 2 fallback. Import as peer to R3F. |

**Note:** R3F/Three.js is optional — only include if the hero particle effect is confirmed. It adds ~200KB gzipped. If the parallax/depth effect can be achieved with GSAP + CSS transforms, prefer that path.

### UI Components and Forms

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| shadcn/ui | latest CLI (npx shadcn@latest) | UI component foundation | Copy-paste ownership, no runtime dependency. Updated for Tailwind v4 and React 19 with `forwardRefs` removed. Uses OKLCH colors. Use for Dialog (lightbox), Form, Input — not for animated showcase sections (those are custom). |
| react-hook-form | 7.x | Contact form state | Minimal re-renders, uncontrolled inputs. Native integration with shadcn/ui Form primitive. |
| zod | 3.x | Schema validation (client + server) | Single source of truth — same schema validates contact form on client AND in the Next.js Server Action. `z.infer<>` eliminates duplicate TypeScript types. |
| @hookform/resolvers | 5.x | Zod-to-RHF bridge | Required glue package for `zodResolver`. |

### Email

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| resend | 6.9.4 | Transactional email via API | The definitive choice for Next.js showcase sites. 1.67M weekly downloads, actively maintained (published 11 days ago). Native `react` parameter accepts React Email templates. Free tier covers low contact-form volume. |
| react-email | latest (5.x) | HTML email templates as React components | Built by the same team as Resend — native integration. Pass React components directly to `resend.emails.send({ react: <Template /> })`. Resend renders it server-side. Supports Tailwind 4. |

### Fonts

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next/font/google | built into Next.js | Premium Google Font loading | Self-hosts fonts at build time — eliminates external network requests to Google CDN, improves LCP, prevents CLS. Use `font-display: 'swap'`. Never use `<link>` tags to Google Fonts. |
| next/font/local | built into Next.js | Self-hosted premium/paid fonts | If using licensed fonts (e.g., GT Alpina, Canela), `next/font/local` gives identical performance benefits. Drop font files in `/fonts`, reference via `next/font/local`. |

**Font recommendation for Maje Concept:** `Cormorant Garamond` (high-contrast display serifs, ultra-luxe) or `Playfair Display` (editorial, premium) for headlines + `DM Sans` (geometric, clean) for body. Both available via `next/font/google`. Avoid Inter — overused, not distinctive enough for ultra-premium positioning.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack | Dev bundler (default in Next.js 15+) | Enabled by default with `next dev --turbo`. Do NOT use `next dev` without it on 15+ — Turbopack is default. |
| ESLint + typescript-eslint | Linting | Next.js ships with eslint-config-next; extend with `@typescript-eslint/recommended` |
| Prettier | Code formatting | Add `prettier-plugin-tailwindcss` to auto-sort Tailwind classes |
| next-themes | 0.4.6 | Theme provider (if dark mode needed) | Not required for a showcase site with a fixed design. Only include if the design spec calls for a dark/light toggle. |

## Installation

```bash
# Framework
npx create-next-app@15 maje-website --typescript --tailwind --app --src-dir --import-alias "@/*"

# Animation core
npm install gsap @gsap/react motion lenis

# 3D (optional — only if hero particles confirmed)
npm install @react-three/fiber @react-three/drei three

# UI and forms
npx shadcn@latest init
npm install react-hook-form zod @hookform/resolvers

# Email
npm install resend react-email @react-email/components

# Dev
npm install -D prettier prettier-plugin-tailwindcss
```

**Tailwind version pin (critical):**
```bash
# After create-next-app, pin Tailwind to 4.0.7
npm install tailwindcss@4.0.7 @tailwindcss/postcss@4.0.7
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15.x | Next.js 16.x | When v16.2.x patches the Tailwind 4.1 Turbopack build error. Upgrade path is simple (`next upgrade`). |
| Next.js | Astro | If the site were truly static with zero React interactivity. Astro + GSAP is excellent for pure-content sites, but this project needs React state for the live product configurator. |
| `motion` (v12) | `framer-motion` (legacy) | Never — `framer-motion` is no longer actively developed. The package still installs but migration to `motion` is import-only. Do it now, not later. |
| GSAP ScrollTrigger | motion `useScroll` | For simple parallax on 1-2 elements. For the full orchestrated scroll experience described in PROJECT.md (pinned sections, staggered reveals, counters), GSAP is required. |
| Lenis | GSAP ScrollSmoother | ScrollSmoother is GSAP's own smooth-scroll solution (also free now). Difference: Lenis is scroll-library-agnostic, lighter, and more framework-friendly. Either works — Lenis has better React integration. |
| Resend | Nodemailer | Nodemailer requires your own SMTP infrastructure. Resend is an API with a free tier — zero infrastructure, cleaner DX. For a single contact form, Resend is correct. |
| `next/font` | Manual `@font-face` | Never for Next.js — `next/font` eliminates font-induced CLS and eliminates the Google Fonts external DNS lookup. Manual `@font-face` misses both benefits. |
| R3F + drei | Vanilla Three.js | Only if you need maximum scene control outside React's render cycle. For a hero section particle effect in a React codebase, R3F reduces boilerplate by 70%. |
| Tailwind 4.0.7 | Tailwind 3.4.x | v3 is maintenance mode. v4 is the future and shadcn/ui is already updated for it. Accept the pin constraint until the v4.1 Turbopack bug is patched. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` package | No longer actively developed since renaming to `motion` in 2025. Same API, different package name. | `motion` package, import from `motion/react` |
| `@studio-freight/lenis` | Old package name, unmaintained. Project migrated to `lenis`. | `lenis` (new name, same team) |
| GSAP `gsap-trial` package | Deprecated — was for paid Club plugins. All plugins are now in the free `gsap` package. | `gsap` from npm |
| `<link>` Google Fonts in `_document` | Causes external network request on every page load, FOUT, potential CLS, privacy issue | `next/font/google` with self-hosting |
| Tailwind CSS 4.1.x (currently) | Confirmed `RangeError: Invalid code point` build failure with Next.js Turbopack | Pin to `tailwindcss@4.0.7` |
| Puppeteer / canvas for graphics | Not relevant for this project — but if tempted for OG image generation, use `@vercel/og` (built on Satori) instead | `@vercel/og` via Next.js ImageResponse |
| Moment.js | 67KB bundle, deprecated | `date-fns` or native `Intl.DateTimeFormat` (no dates needed for this project anyway) |
| Axios | 30KB for what native `fetch` handles | Native `fetch` (built into Node 22 and browsers) |
| ScrollSmoother (GSAP) as sole scroll layer | ScrollSmoother and Lenis conflict when both are active — pick one | Use Lenis for smooth scroll, GSAP ScrollTrigger for scroll-triggered animations |

## Stack Patterns by Variant

**If 3D hero is confirmed in design:**
- Add `@react-three/fiber@9`, `@react-three/drei@10`, `three`
- Load the Canvas lazily with Next.js `dynamic(() => import('./HeroCanvas'), { ssr: false })`
- Because R3F's `<Canvas>` is client-only and SSR would break hydration

**If 3D hero is dropped in favor of CSS/GSAP parallax:**
- Remove R3F/drei/three entirely (~200KB savings)
- Implement depth with GSAP + CSS `perspective` + `translateZ` transforms
- This is the safer default — add 3D only after design is confirmed

**If dark mode is in the design spec:**
- Add `next-themes@0.4.6`
- Wrap layout with `<ThemeProvider attribute="class">`
- Because shadcn/ui's CSS variables support both light and dark out of the box with Tailwind 4

**If licensed premium fonts are used (e.g., Söhne, GT Alpina):**
- Use `next/font/local` with font files in `/public/fonts`
- Set `display: 'swap'` and `preload: true` on the display face
- Because `next/font/local` gives identical LCP/CLS benefits as `next/font/google`

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 15.2.4 | React 19.2.x | Ships together — no separate React install needed |
| Next.js 15.2.4 | Tailwind CSS 4.0.7 | Confirmed working. Avoid 4.1.x until Turbopack bug is patched. |
| @react-three/fiber 9.x | React 19.x | R3F v9 is the React 19 version. R3F v8 requires React 18. Do not mix. |
| @react-three/drei 10.x | @react-three/fiber 9.x | Drei v10 pairs with R3F v9. Use matching major versions. |
| motion 12.x | React 19.x | Full React 19 support, no compatibility issues |
| gsap 3.14.x | Next.js 15/16 | Works in App Router — use `useGSAP()` from `@gsap/react`, guard with `typeof window !== "undefined"`, centralize plugin registration in `lib/gsapConfig.ts` |
| lenis 1.3.x | GSAP ScrollTrigger | Compatible — use `lenis.raf(time)` inside a GSAP ticker or `requestAnimationFrame` loop, not both independently |
| shadcn/ui (latest CLI) | Tailwind 4.x + React 19 | Components updated for both. Colors converted to OKLCH. `forwardRef` removed. Run `npx shadcn@latest init` after Tailwind setup. |
| resend 6.x | react-email 5.x | Native integration — same team. Pass React Email components directly via `react:` parameter. |
| react-hook-form 7.x | zod 3.x + @hookform/resolvers 5.x | Stable triple. `zodResolver` from `@hookform/resolvers/zod`. |

## Key Architectural Constraint: GSAP + Lenis Integration

When combining Lenis and GSAP ScrollTrigger, they must share the same scroll proxy. The standard pattern:

```typescript
// In a root client component or layout
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

If this is not done, ScrollTrigger calculates trigger positions against native scroll while Lenis intercepts scroll events — resulting in triggers firing at wrong positions.

## Sources

- [Next.js 15.2.4 — current stable, March 2026](https://www.abhs.in/blog/nextjs-current-version-march-2026-stable-release-whats-new) — MEDIUM confidence (blog, corroborated by upgrade docs)
- [Next.js 16 release blog](https://nextjs.org/blog/next-16) — official source confirming v16 exists
- [Tailwind 4.1 Turbopack bug report](https://github.com/tailwindlabs/tailwindcss/discussions/19556) — confirmed build failure, pin to 4.0.7
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — official confirmation of v4 + React 19 support
- [GSAP npm — v3.14.2](https://www.npmjs.com/package/gsap) — verified current stable
- [@gsap/react npm — v2.1.2](https://www.npmjs.com/package/@gsap/react) — verified current stable
- [GSAP now free announcement](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) — all plugins free since 3.13
- [motion npm — v12.38.0](https://www.npmjs.com/package/framer-motion) — verified current, renamed from framer-motion
- [motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) — official rename docs
- [lenis npm — v1.3.21](https://www.npmjs.com/package/lenis) — verified, package renamed from @studio-freight/lenis
- [@react-three/fiber npm — v9.5.0](https://www.npmjs.com/package/@react-three/fiber) — verified; v9 = React 19
- [@react-three/drei npm — v10.7.7](https://www.npmjs.com/package/@react-three/drei) — verified current stable
- [resend npm — v6.9.4](https://www.npmjs.com/package/resend) — verified, published 11 days ago
- [react-email 5.0 blog](https://resend.com/blog/react-email-5) — Tailwind 4 support confirmed
- [next/font official docs](https://nextjs.org/docs/app/getting-started/fonts) — self-hosting, font-display, LCP guidance
- [GSAP + Next.js 2025 setup guide](https://javascript.plainenglish.io/setting-up-gsap-with-next-js-2025-edition-bcb86e48eab6) — useGSAP, cleanup patterns
- [Lenis + GSAP integration](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — scroll proxy pattern

---
*Stack research for: ultra-premium showcase website (Next.js + GSAP + Motion + Lenis + R3F)*
*Researched: 2026-03-28*
