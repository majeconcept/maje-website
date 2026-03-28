"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useAnimation } from "@/components/providers/AnimationProvider"
import { useCursor } from "@/components/providers/CursorProvider"
import { AnimatedCounter } from "@/components/ui/AnimatedCounter"
import { IconSerigraphie } from "@/components/icons/IconSerigraphie"
import { IconBroderie } from "@/components/icons/IconBroderie"
import { IconDTF } from "@/components/icons/IconDTF"
import { IconFlocage } from "@/components/icons/IconFlocage"
import { EXPERTISE_DOMAINS, KPI_STATS } from "@/data/expertise"
import { cn } from "@/lib/utils"

// Map icon strings to components
const ICON_MAP = {
  serigraphie: IconSerigraphie,
  broderie: IconBroderie,
  dtf: IconDTF,
  flocage: IconFlocage,
  transfert: IconDTF, // transfert uses same icon as DTF
} as const

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const kpiRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { isReady } = useAnimation()
  const { setVariant } = useCursor()

  useGSAP(() => {
    if (!isReady) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions!

        if (isDesktop && !reduceMotion) {
          // ── Header entrance ──────────────────────────────────────────────
          gsap.from(headerRef.current, {
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              once: true,
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          })

          // ── KPI strip entrance ───────────────────────────────────────────
          gsap.from(".kpi-item", {
            scrollTrigger: {
              trigger: kpiRef.current,
              start: "top 80%",
              once: true,
            },
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          })

          // ── Expertise grid entrance ──────────────────────────────────────
          gsap.from(".expertise-card", {
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              once: true,
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          })
        } else {
          // Instant reveal — no animation on mobile or reduced-motion
          gsap.set(headerRef.current, { opacity: 1, y: 0 })
          gsap.set(".kpi-item", { opacity: 1, y: 0 })
          gsap.set(".expertise-card", { opacity: 1, y: 0 })
        }

        return () => mm.revert()
      }
    )
  }, { scope: sectionRef, dependencies: [isReady] })

  return (
    <section
      ref={sectionRef}
      id="expertises"
      className="py-24 lg:py-32 bg-brand-charcoal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-20">
          <p className="font-body text-brand-muted text-xs tracking-[0.25em] uppercase mb-4">
            Notre expertise
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2
              className="font-display text-[clamp(2rem,6vw,5rem)] text-brand-cream leading-[0.95]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Le savoir-faire<br />
              <span className="text-brand-gold">au service</span><br />
              de votre image.
            </h2>
            <p className="font-body text-brand-muted text-sm leading-relaxed max-w-sm lg:text-right">
              Depuis 2013, Maje Concept réunit sous un même toit les cinq techniques majeures du marquage textile — pour un interlocuteur unique, quelle que soit la complexité de votre projet.
            </p>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div
          ref={kpiRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brand-cream/10 border border-brand-cream/10 mb-20"
        >
          {KPI_STATS.map((kpi, i) => (
            <div
              key={i}
              className={cn(
                "kpi-item bg-brand-charcoal p-6 lg:p-10",
                "relative overflow-hidden group"
              )}
            >
              {/* Hover gold accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-500" />
              <AnimatedCounter
                target={kpi.target}
                suffix={kpi.suffix}
                label={kpi.label}
                description={kpi.description}
              />
            </div>
          ))}
        </div>

        {/* ── Expertise Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-cream/10"
        >
          {EXPERTISE_DOMAINS.map((domain) => {
            const IconComponent = ICON_MAP[domain.icon]
            return (
              <div
                key={domain.id}
                className={cn(
                  "expertise-card bg-brand-charcoal p-8 lg:p-10 cursor-none",
                  "relative overflow-hidden group",
                  "transition-colors duration-300 hover:bg-brand-black/60"
                )}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
              >
                {/* Gold border on hover — bottom reveal */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-500" />

                {/* Icon */}
                <div className="mb-6">
                  <IconComponent
                    size={40}
                    className="text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300"
                  />
                </div>

                {/* Content */}
                <h3
                  className="font-display text-xl text-brand-cream mb-3 group-hover:text-brand-gold transition-colors duration-300"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {domain.title}
                </h3>
                <p className="font-body text-brand-muted text-sm leading-relaxed mb-4">
                  {domain.description}
                </p>
                <p className="font-body text-brand-gold/60 text-xs tracking-wide group-hover:text-brand-gold/80 transition-colors duration-300">
                  {domain.detail}
                </p>

                {/* Arrow — appears on hover */}
                <div className="absolute top-8 right-8 text-brand-gold/0 group-hover:text-brand-gold/60 transition-colors duration-300 text-xl">
                  →
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
