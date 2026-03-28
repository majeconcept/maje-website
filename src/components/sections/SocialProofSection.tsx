"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useAnimation } from "@/components/providers/AnimationProvider"
import { useCursor } from "@/components/providers/CursorProvider"
import { LogoCarousel } from "@/components/ui/LogoCarousel"
import { CLIENT_LOGOS, TESTIMONIALS } from "@/data/social-proof"
import { cn } from "@/lib/utils"

export function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const { isReady } = useAnimation()
  const { setVariant } = useCursor()

  useGSAP(
    () => {
      if (!isReady) return

      // Header entrance
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

      // Testimonials stagger entrance
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          once: true,
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      })
    },
    { scope: sectionRef, dependencies: [isReady] }
  )

  return (
    <section
      id="social-proof"
      ref={sectionRef}
      className="bg-brand-black overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-24 lg:pt-32 pb-16">
        <div ref={headerRef}>
          <p className="font-body text-brand-muted text-xs tracking-[0.25em] uppercase mb-4">
            Ils nous font confiance
          </p>
          <h2
            className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-cream leading-[0.95] max-w-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Des références<br />
            <span className="text-brand-gold">qui parlent</span><br />
            d'elles-mêmes.
          </h2>
        </div>
      </div>

      {/* ── Logo Carousel ── */}
      <div className="border-y border-brand-cream/10 mb-24">
        <LogoCarousel logos={CLIENT_LOGOS} />
      </div>

      {/* ── Testimonials Bento ── */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-24 lg:pb-32">
        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-brand-cream/10 border border-brand-cream/10"
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className={cn(
                "testimonial-card bg-brand-black p-8 lg:p-10 cursor-none",
                "relative group overflow-hidden",
                "transition-colors duration-300 hover:bg-brand-charcoal/80",
                i === 0 && "lg:border-r lg:border-brand-cream/10"
              )}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
            >
              {/* Gold accent bar — left, reveals on hover */}
              <div className="absolute left-0 top-0 w-px h-0 bg-brand-gold group-hover:h-full transition-all duration-500" />

              {/* Quote mark */}
              <div
                className="font-display text-[5rem] text-brand-gold/15 leading-none mb-4 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <blockquote className="font-body text-brand-cream/80 text-sm leading-relaxed mb-8">
                {testimonial.quote}
              </blockquote>

              {/* Attribution */}
              <div className="border-t border-brand-cream/10 pt-6">
                <p
                  className="font-display text-brand-cream text-base"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {testimonial.author}
                </p>
                <p className="font-body text-brand-gold/70 text-xs tracking-[0.1em] uppercase mt-1">
                  {testimonial.role}
                </p>
                <p className="font-body text-brand-muted text-xs mt-1">
                  {testimonial.company}
                </p>
                <p className="font-body text-brand-muted/50 text-xs tracking-widest uppercase mt-2">
                  {testimonial.sector}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
