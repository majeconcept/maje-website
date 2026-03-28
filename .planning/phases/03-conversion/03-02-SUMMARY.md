---
phase: 03-conversion
plan: 02
subsystem: ui + api
tags: [react, react-hook-form, zod, resend, react-email, motion, form, email, rate-limiting]

# Dependency graph
requires:
  - phase: 03-conversion
    plan: 01
    provides: ConfiguratorProvider, useConfigurator, getConfigSummary(), hasConfig flag

provides:
  - contactFormSchema (Zod) shared client + server (src/lib/validations.ts)
  - POST /api/contact — rate-limited Route Handler with double Resend send (src/app/api/contact/route.ts)
  - NotificationEmail — full form data + configuratorSummary block (src/components/emails/NotificationEmail.tsx)
  - ConfirmationEmail — branded dark-palette confirmation with firstName greeting (src/components/emails/ConfirmationEmail.tsx)
  - ContactSection — react-hook-form mode=onChange, AnimatePresence success, configurator pre-fill (src/components/sections/ContactSection.tsx)

affects: [page.tsx final assembly]

# Tech tracking
tech-stack:
  added:
    - resend (email sending SDK)
    - react-email (email template framework)
    - "@react-email/components" (Html, Head, Body, Container, Section, Text, Hr, Row, Column, Link, Heading)
    - react-hook-form (form state management, mode=onChange)
    - "@hookform/resolvers" (zodResolver bridge)
  patterns:
    - contactFormSchema Zod shared pattern — single schema validated on client (RHF zodResolver) and server (safeParse)
    - In-memory rate limit Map<ip, {count, resetAt}> — module-level singleton, 3 req/hour/IP, periodic cleanup via setInterval
    - Honeypot field pattern — position absolute left=-9999px, aria-hidden, tabIndex=-1, max(0) Zod constraint
    - AnimatePresence mode=wait key swap — "form" key exits, "success" key enters with animated SVG checkmark
    - AnimatePresence from motion/react — NOT framer-motion (package renamed)
    - react-email JSX templates — renderToBuffer-compatible, inline styles only, dark brand palette (#0A0A0F background)

key-files:
  created:
    - src/lib/validations.ts
    - src/app/api/contact/route.ts
    - src/components/emails/NotificationEmail.tsx
    - src/components/emails/ConfirmationEmail.tsx
    - src/components/sections/ContactSection.tsx
    - .env.local (placeholder values)
  modified:
    - src/app/page.tsx

key-decisions:
  - "useAnimation imported from @/components/providers/AnimationProvider (not @/lib/animationContext as plan interface showed) — consistent with all other section components"
  - "ConfirmationEmail failure is non-blocking — notification email is primary, confirmation is secondary; server returns 200 even if confirmation fails"
  - "RESEND_FROM_ADDRESS env var with onboarding@resend.dev default — no domain verification needed in dev"
  - "setInterval cleanup of rateLimitMap prevents unbounded memory growth in long-running process"

# Metrics
duration: 12min
completed: 2026-03-28
---

# Phase 3 Plan 02: Formulaire de Contact + Resend Summary

**Contact form with real-time Zod validation (react-hook-form mode=onChange), POST Route Handler with in-memory rate limiting + honeypot, double Resend email send (notification + confirmation), and AnimatePresence animated checkmark success state.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-28T20:00:00Z
- **Completed:** 2026-03-28T20:12:00Z
- **Tasks:** 2/2
- **Files modified:** 7

## Accomplishments

### Task 1: Install deps + Zod schema + Route Handler + Email templates

- `npm install resend react-email @react-email/components react-hook-form @hookform/resolvers` — 97 packages added
- `src/lib/validations.ts`: `contactFormSchema` with 9 fields (firstName, lastName, email, phone optional, company optional, needType enum 7 values, message min10, configuratorSummary optional, website honeypot max0)
- `src/app/api/contact/route.ts`: POST handler — IP rate limit 3/hr via module-level Map, honeypot fake-success, Zod server re-validation, two sequential `resend.emails.send()` calls, setInterval cleanup every hour
- `src/components/emails/NotificationEmail.tsx`: full data display — contact block, details grid (email/phone/needType), message block, conditional configuratorSummary with gold left-border accent
- `src/components/emails/ConfirmationEmail.tsx`: firstName greeting, 24h response promise, dark brand palette (#0A0A0F bg, #C9A84C gold headings)
- `.env.local` created with placeholder `RESEND_API_KEY=re_your_api_key_here` and `RESEND_FROM_ADDRESS=onboarding@resend.dev`
- TypeScript: zero errors after task

### Task 2: ContactSection + page.tsx

- `src/components/sections/ContactSection.tsx` (290 lines): all 7 visible form fields + hidden honeypot, `useForm` with `zodResolver` and `mode: "onChange"`, inline `FieldError` component with motion enter animation
- Configurator pre-fill: gold-tinted block rendered when `config.hasConfig=true`, displays `getConfigSummary()` as read-only text, hidden input carries value to submission
- AnimatePresence `mode="wait"`: key="form" exits (opacity 0, y -20), key="success" enters with scale+fade; animated SVG checkmark (circle draws 0.7s, checkmark draws 0.4s at 0.6s delay)
- GSAP entrance: contact-header (y:60 scrollTrigger), contact-form-wrapper (y:40, delay:0.1), contact-info (y:40, delay:0.2), `ctx.revert()` cleanup
- Submit flow: fetch POST /api/contact, handles 200 success (setIsSubmitted), non-200 (setSubmitError from response JSON), network failure (catch block)
- `src/app/page.tsx`: ContactSection import added, placeholder `<div id="contact">` replaced with `<ContactSection />`
- `npm run build` passes: zero TypeScript errors, `/api/contact` listed as Dynamic route

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `673385b` | feat(03-02): install deps + Zod schema + contact Route Handler + email templates |
| 2 | `9cc0528` | feat(03-02): ContactSection with react-hook-form, AnimatePresence success, configurator pre-fill |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected animationContext import path**
- **Found during:** Task 2
- **Issue:** Plan interface snippet showed `import { useAnimation } from "@/lib/animationContext"` but actual project exports `useAnimation` from `@/components/providers/AnimationProvider`
- **Fix:** Used correct import path matching all other section components in the codebase
- **Files modified:** src/components/sections/ContactSection.tsx
- **Commit:** 9cc0528

None other — plan executed as written.

## Known Stubs

None — form fields are fully wired to react-hook-form state, Resend emails send on submission, configuratorSummary reads live from ConfiguratorContext. The only "placeholder" is the phone number in email templates (`+33 3 89 XX XX XX`) which is intentional — real number not provided in project data.

## Self-Check: PASSED
