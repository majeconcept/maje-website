"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useAnimation } from "@/components/providers/AnimationProvider"
import { MagneticButton } from "@/components/cursor/MagneticButton"
import { cn } from "@/lib/utils"
import { HERO_CONTENT } from "@/data/hero"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return
    if (!titleRef.current || !sectionRef.current) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions!

        if (isDesktop && !reduceMotion) {
          // ── ENTRANCE TIMELINE ────────────────────────────────────────────
          const tl = gsap.timeline()

          // Badge fade in
          tl.from(badgeRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          })

          // Eyebrow line
          tl.from(eyebrowRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          }, "-=0.3")

          // SplitText title — new API, mask:"lines" for clean clip reveal
          SplitText.create(titleRef.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              tl.from(self.lines, {
                yPercent: 100,
                opacity: 0,
                duration: 1.1,
                stagger: 0.1,
                ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                onComplete: () => self.revert(),
              }, "-=0.5")
            },
          })

          // Subtitle + CTAs stagger
          tl.from([subtitleRef.current, ctasRef.current], {
            opacity: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.08,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          }, "-=0.6")

          // ── SCROLL PARALLAX ──────────────────────────────────────────────
          // Uses `y` property — ScrollTrigger scrubs position as user scrolls
          const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", sectionRef.current)

          layers.forEach((layer) => {
            const depth = parseFloat(layer.dataset.depth || "0.2")
            gsap.to(layer, {
              y: () => -(window.innerHeight * depth * 0.5),
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
          })

          // ── MOUSEMOVE PARALLAX ───────────────────────────────────────────
          // Uses `xPercent`/`yPercent` to avoid conflicting with scroll `y` above
          const mouseSetters = layers.map((layer) => {
            const depth = parseFloat(layer.dataset.depth || "0.2")
            return {
              x: gsap.quickTo(layer, "xPercent", { duration: 0.8, ease: "power3.out" }),
              y: gsap.quickTo(layer, "yPercent", { duration: 0.8, ease: "power3.out" }),
              depth,
            }
          })

          const onMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2
            const cy = window.innerHeight / 2
            const dx = (e.clientX - cx) / cx
            const dy = (e.clientY - cy) / cy
            mouseSetters.forEach(({ x, y, depth }) => {
              x(dx * 4 * depth)
              y(dy * 2 * depth)
            })
          }

          const section = sectionRef.current
          section?.addEventListener("mousemove", onMouseMove, { passive: true })

          return () => {
            section?.removeEventListener("mousemove", onMouseMove)
            ScrollTrigger.getAll().forEach((st) => {
              if (st.trigger === sectionRef.current) st.kill()
            })
          }
        } else {
          // Simplified: instant reveal — no animation on mobile or reduced-motion
          gsap.set(
            [badgeRef.current, eyebrowRef.current, titleRef.current, subtitleRef.current, ctasRef.current],
            { opacity: 1, y: 0 }
          )
        }

        return () => mm.revert()
      }
    )
  }, { scope: sectionRef, dependencies: [isReady] })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-brand-black flex items-center"
    >
      {/* ── PARALLAX LAYER 0.1 — background grain/texture ── */}
      <div
        data-depth="0.1"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Noise texture overlay via CSS */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
        {/* Gradient vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 120% 80% at 50% 60%, transparent 40%, oklch(0.10 0.008 250) 100%)" }}
        />
      </div>

      {/* ── PARALLAX LAYER 0.3 — geometric accent ── */}
      <div
        data-depth="0.3"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Diagonal gold line — brand geometric accent */}
        <div
          className="absolute top-[15%] right-[8%] w-px h-[35vh] bg-brand-gold/20 origin-top"
          style={{ transform: "rotate(15deg)" }}
        />
        <div
          className="absolute top-[20%] right-[12%] w-px h-[20vh] bg-brand-gold/10 origin-top"
          style={{ transform: "rotate(15deg)" }}
        />
        {/* Bottom left accent */}
        <div className="absolute bottom-[25%] left-[6%] w-24 h-px bg-brand-gold/25" />
        <div className="absolute bottom-[28%] left-[6%] w-12 h-px bg-brand-gold/15" />
      </div>

      {/* ── PARALLAX LAYER 0.5 — main content (foreground) ── */}
      <div
        data-depth="0.5"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-24"
      >
        {/* Badge */}
        <div ref={badgeRef}>
          <span className="inline-block text-brand-gold/70 font-body text-xs tracking-[0.2em] uppercase border border-brand-gold/20 px-4 py-2 mb-8">
            {HERO_CONTENT.badge}
          </span>
        </div>

        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="font-body text-brand-muted text-sm tracking-[0.25em] uppercase mb-6"
        >
          {HERO_CONTENT.eyebrow}
        </p>

        {/* Title — SplitText target */}
        <h1
          ref={titleRef}
          className="font-display text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] text-brand-cream mb-10 max-w-4xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {HERO_CONTENT.titleLines.join(" ")}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-brand-muted text-base lg:text-lg leading-relaxed max-w-xl mb-12"
        >
          {HERO_CONTENT.subtitle}
        </p>

        {/* CTAs */}
        <div ref={ctasRef} className="flex flex-col sm:flex-row gap-4 items-start">
          <MagneticButton
            className={cn(
              "px-8 py-4 bg-brand-gold text-brand-black font-body text-sm tracking-[0.15em] uppercase",
              "hover:bg-brand-cream transition-colors duration-300 cursor-none"
            )}
            onClick={() => {
              document.getElementById("realisations")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {HERO_CONTENT.ctaPrimary.label}
          </MagneticButton>

          <MagneticButton
            className={cn(
              "px-8 py-4 border border-brand-cream/30 text-brand-cream font-body text-sm tracking-[0.15em] uppercase",
              "hover:border-brand-gold hover:text-brand-gold transition-colors duration-300 cursor-none"
            )}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {HERO_CONTENT.ctaSecondary.label}
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-4 sm:left-8 lg:left-16 flex items-center gap-3 text-brand-muted/50">
          <div className="w-px h-12 bg-brand-muted/30 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-brand-gold/60"
              style={{ height: "40%", animation: "scrollIndicator 2s ease-in-out infinite" }}
            />
          </div>
          <span className="font-body text-xs tracking-[0.2em] uppercase">Défiler</span>
        </div>
      </div>
    </section>
  )
}
