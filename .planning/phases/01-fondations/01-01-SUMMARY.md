---
phase: 01-fondations
plan: 01
subsystem: ui
tags: [nextjs, tailwind, gsap, lenis, motion, shadcn, typescript, fonts]

# Dependency graph
requires: []
provides:
  - Next.js 15.5.14 project scaffold with TypeScript strict mode
  - Tailwind v4.0.7 pinned (hard pin via overrides) with @theme brand palette
  - OKLCH brand tokens (black, charcoal, gold, gold-light, cream, muted) in globals.css
  - Söhne Breit font loaded via next/font/local (400+700 weights, --font-sohne-breit variable)
  - GSAP 3.14.2 with ScrollTrigger, SplitText, Flip registered via registerGSAPPlugins()
  - cn() utility from src/lib/utils.ts
  - shadcn/ui initialized with button component
  - public/fonts/TestSohneBreit-Buch.otf and TestSohneBreit-Dreiviertelfett.otf
  - public/logo.svg (Maje Concept logo)
affects:
  - 01-02 (LenisProvider imports registerGSAPPlugins, CursorProvider uses cn())
  - 01-03 (AnimationProvider, Preloader, Navigation all consume brand tokens and fonts)
  - All Phase 2 sections (design tokens, font-display class, cn() utility)

# Tech tracking
tech-stack:
  added:
    - next@15.5.14
    - react@19.1.0
    - tailwindcss@4.0.7 (pinned)
    - "@tailwindcss/postcss@4.0.7"
    - gsap@3.14.2
    - "@gsap/react@2.1.2"
    - motion@12.38.0 (not framer-motion — renamed)
    - lenis@1.3.21 (not @studio-freight/lenis — renamed)
    - clsx@2.1.1
    - tailwind-merge@3.5.0
    - shadcn@4.1.1 (CLI, installs shadcn/ui components)
    - lucide-react@1.7.0
    - prettier + prettier-plugin-tailwindcss
  patterns:
    - "@theme {} in globals.css — no tailwind.config.ts (Tailwind v4 pattern)"
    - "next/font/local for proprietary OTF fonts with CSS variable injection"
    - "GSAP plugin registration guarded by `registered` boolean (prevents double-registration on HMR)"
    - "cn() = twMerge(clsx()) — standard shadcn/ui pattern for class merging"

key-files:
  created:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/lib/gsapConfig.ts
    - src/lib/utils.ts
    - public/fonts/TestSohneBreit-Buch.otf
    - public/fonts/TestSohneBreit-Dreiviertelfett.otf
    - public/logo.svg
    - package.json
    - tsconfig.json
  modified:
    - tsconfig.json (forceConsistentCasingInFileNames: false for GSAP Flip macOS fix)

key-decisions:
  - "Tailwind 4.0.7 hard pinned via package.json overrides AND exact devDependency version — prevents accidental upgrade to 4.1.x (Turbopack RangeError)"
  - "tsconfig.json: forceConsistentCasingInFileNames=false — GSAP ships Flip.js but flip.d.ts (case mismatch); macOS HFS+ resolves both to same file causing TS error without this flag"
  - "shadcn@latest init used — generates components.json, src/components/ui/button.tsx, and merges utils.ts correctly"
  - "Font path in localFont: ../../public/fonts/ (relative from src/app/ to project root public/)"
  - "Logo copied to public/logo.svg (not 'LOGO VECTO SOURCE.svg') — cleaner import path for next/image"

patterns-established:
  - "Brand colors accessed as Tailwind utilities: bg-brand-black, text-brand-gold, etc. (generated from @theme)"
  - "Font activated on body via font-display class (maps to --font-display CSS var)"
  - "All animation libraries imported but NOT initialized here — LenisProvider (plan 02) calls registerGSAPPlugins() at module level"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03]

# Metrics
duration: 25min
completed: 2026-03-28
---

# Phase 1 Plan 01: Scaffold Next.js 15 + Design System Summary

**Next.js 15.5.14 scaffold with Tailwind v4.0.7 hard-pinned, OKLCH brand palette @theme tokens, Söhne Breit via next/font/local, and GSAP 3.14 plugin registry**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-28T15:30:00Z
- **Completed:** 2026-03-28T16:40:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Next.js 15.5.14 project scaffolded with TypeScript strict mode, App Router, src/ directory structure
- Tailwind v4.0.7 pinned via both exact devDependency and npm overrides; @theme block with 6 brand OKLCH colors, 4 easing curves, and section spacing token
- Söhne Breit font (400 + 700 weight) loaded via next/font/local with --font-sohne-breit CSS variable injected on `<html>`
- GSAP 3.14.2 installed with all plugins (ScrollTrigger, SplitText, Flip) registered via guarded registerGSAPPlugins() utility
- shadcn/ui initialized — button component, utils.ts cn() helper, components.json config
- `npm run build` passes cleanly via Turbopack — no RangeError, no type errors

## Task Commits

1. **Task 1: Scaffold + pin Tailwind + install deps** — committed in `efbbdc6` (initial commit, pre-existing)
2. **Task 2: globals.css + layout.tsx + page.tsx + gsapConfig.ts** — `d012a86` (feat)

## Files Created/Modified

- `src/app/globals.css` — @theme brand palette (OKLCH), easing tokens, cursor layer CSS, scrollbar reset, fadeInUp keyframe
- `src/app/layout.tsx` — next/font/local Söhne Breit (400+700), fr lang, bg-brand-black/text-brand-cream body
- `src/app/page.tsx` — placeholder hero with brand-gold heading + token smoke test (hidden div exercising all brand classes)
- `src/lib/gsapConfig.ts` — registerGSAPPlugins() with ScrollTrigger, SplitText, Flip; HMR-safe `registered` guard
- `src/lib/utils.ts` — cn() = twMerge(clsx()) utility (generated by shadcn init)
- `tsconfig.json` — added forceConsistentCasingInFileNames: false (GSAP Flip macOS fix)
- `package.json` — dependencies + overrides for Tailwind 4.0.7 pin
- `public/fonts/TestSohneBreit-Buch.otf` — 400-weight font file
- `public/fonts/TestSohneBreit-Dreiviertelfett.otf` — 700-weight font file
- `public/logo.svg` — Maje Concept vector logo

## Decisions Made

- Tailwind 4.0.7 pinned in both devDependencies (exact `"4.0.7"`) and `"overrides"` — belt-and-suspenders to prevent accidental upgrade breaking Turbopack
- `forceConsistentCasingInFileNames: false` in tsconfig — GSAP 3.14.2 ships `Flip.js` but types reference `flip.d.ts` (lowercase). macOS HFS+ is case-insensitive so TypeScript sees a conflict when strict casing is enforced. This flag resolves it without `@ts-ignore` comments.
- Logo renamed to `public/logo.svg` for cleaner `next/image` usage (original filename had spaces)
- Font path `../../public/fonts/` — relative from `src/app/layout.tsx` to project root `public/` directory

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] GSAP Flip import case conflict on macOS**
- **Found during:** Task 2 (gsapConfig.ts build verification)
- **Issue:** `import { Flip } from "gsap/Flip"` caused TypeScript error: "File name 'Flip.d.ts' differs from already included file name 'flip.d.ts' only in casing." GSAP ships `Flip.js` (uppercase) but the type declaration is `flip.d.ts` (lowercase). On case-insensitive macOS HFS+, TypeScript strict casing enforcement sees a collision.
- **Fix:** Added `"forceConsistentCasingInFileNames": false` to tsconfig.json. This is the standard fix documented by GSAP for macOS development environments.
- **Files modified:** tsconfig.json
- **Verification:** `npm run build` passes with `✓ Compiled successfully` — no RangeError, no type errors
- **Committed in:** d012a86

**2. [Rule 3 - Blocking] create-next-app refused directory name with uppercase letters**
- **Found during:** Task 1 (scaffold step)
- **Issue:** `npx create-next-app@15 .` failed with "name can no longer contain capital letters" because the directory is named `MAJE-WEBSITE`
- **Fix:** Scaffolded into `/tmp/maje-website` then rsync'd all files to the actual project directory (excluding .git)
- **Files modified:** All scaffold files
- **Verification:** Full scaffold present, package.json name is "maje-website" (lowercase)
- **Committed in:** efbbdc6

---

**Total deviations:** 2 auto-fixed (1 Bug, 1 Blocking)
**Impact on plan:** Both fixes necessary to produce a working build. No scope creep.

## Issues Encountered

- shadcn init initially failed with `npm error EOVERRIDE` — the devDependency had `"tailwindcss": "^4.0.7"` (caret range) while overrides had `"tailwindcss": "4.0.7"` (exact). npm rejects when an override contradicts a direct dependency. Fixed by making the devDependency exact (`"4.0.7"` without caret).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **01-02 (LenisProvider + CursorProvider + CustomCursor):** Ready. gsapConfig.ts exports registerGSAPPlugins(), cn() available at @/lib/utils, brand tokens in CSS.
- **01-03 (AnimationProvider + Preloader + Navigation):** Ready after 01-02 completes.
- **Design tokens stable:** All @theme variables are locked. Renaming after Phase 2 starts is costly — do not rename brand-* tokens.

## Known Stubs

- `src/app/page.tsx` — Placeholder hero section with hardcoded text. Intentional stub. Phase 2 (hero section, portfolio) will replace this with the full page layout.

---
*Phase: 01-fondations*
*Completed: 2026-03-28*
