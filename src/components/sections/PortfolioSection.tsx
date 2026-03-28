"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"
import { useAnimation } from "@/components/providers/AnimationProvider"
import { useCursor } from "@/components/providers/CursorProvider"
import { Lightbox } from "@/components/ui/Lightbox"
import { PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES, type PortfolioFilter } from "@/data/portfolio"
import { cn } from "@/lib/utils"

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>("Tous")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { isReady } = useAnimation()
  const { setVariant } = useCursor()

  // ── ENTRANCE ANIMATION ─────────────────────────────────────────────
  useGSAP(() => {
    if (!isReady) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    })

    tl.from(headerRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    })

    tl.from(".portfolio-card", {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    }, "-=0.5")
  }, { scope: sectionRef, dependencies: [isReady] })

  // ── GSAP FLIP FILTER ───────────────────────────────────────────────
  const handleFilter = (filter: PortfolioFilter) => {
    if (isAnimating.current || filter === activeFilter) return
    isAnimating.current = true

    const grid = gridRef.current
    if (!grid) return

    // Capture positions BEFORE DOM change
    const state = Flip.getState(grid.querySelectorAll("[data-flip-id]"))

    // React state mutation → DOM update
    setActiveFilter(filter)

    // After React commits, animate from captured to new positions
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.65,
        ease: "power2.inOut",
        stagger: 0.04,
        absolute: true,
        onComplete: () => { isAnimating.current = false },
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" }),
      })
    })
  }

  // Open lightbox at index within ALL projects (not filtered)
  const handleCardClick = (projectId: string) => {
    const index = PORTFOLIO_PROJECTS.findIndex((p) => p.id === projectId)
    if (index !== -1) setLightboxIndex(index)
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="realisations"
        className="py-24 lg:py-32 bg-brand-black"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16">

          {/* ── Header ── */}
          <div ref={headerRef} className="mb-16">
            <p className="font-body text-brand-muted text-xs tracking-[0.25em] uppercase mb-4">
              Nos réalisations
            </p>
            <h2
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-brand-cream leading-[0.95] mb-8"
              style={{ letterSpacing: "-0.02em" }}
            >
              Du tissu à<br />la réalité.
            </h2>

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-1 mt-10">
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  onMouseEnter={() => setVariant("hover")}
                  onMouseLeave={() => setVariant("default")}
                  className={cn(
                    "px-5 py-2 font-body text-xs tracking-[0.18em] uppercase transition-all duration-200 cursor-none",
                    activeFilter === cat
                      ? "text-brand-gold border-b border-brand-gold"
                      : "text-brand-muted hover:text-brand-cream border-b border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Masonry Grid ── */}
          <div
            ref={gridRef}
            className="grid grid-cols-12 gap-3 auto-rows-[180px] lg:auto-rows-[220px]"
          >
            {PORTFOLIO_PROJECTS.map((project) => {
              const isVisible = activeFilter === "Tous" || project.category === activeFilter
              return (
                <div
                  key={project.id}
                  data-flip-id={project.id}
                  className={cn(
                    "portfolio-card relative overflow-hidden cursor-none group",
                    project.colSpan,
                    project.rowSpan,
                    !isVisible && "hidden"
                  )}
                  onClick={() => handleCardClick(project.id)}
                  onMouseEnter={() => setVariant("view")}
                  onMouseLeave={() => setVariant("default")}
                  data-cursor="view"
                  role="button"
                  tabIndex={0}
                  aria-label={`Voir le projet ${project.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCardClick(project.id)
                  }}
                >
                  {/* Background gradient */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ background: project.color }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-colors duration-400" />

                  {/* Content — visible on hover */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="font-body text-brand-gold text-xs tracking-[0.2em] uppercase mb-2">
                      {project.category}
                    </span>
                    <h3 className="font-display text-brand-cream text-lg lg:text-xl leading-tight">
                      {project.title}
                    </h3>
                    <p className="font-body text-brand-cream/60 text-xs mt-2 line-clamp-2">
                      {project.client}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-body text-brand-gold text-xs tracking-[0.15em] uppercase">
                        Voir le projet
                      </span>
                      <span className="text-brand-gold text-xs">→</span>
                    </div>
                  </div>

                  {/* Category badge — always visible */}
                  <div className="absolute top-4 right-4 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="font-body text-xs text-brand-cream/40 tracking-widest uppercase border border-brand-cream/10 px-2 py-0.5">
                      {project.category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* Lightbox — rendered outside section to avoid stacking context issues */}
      <Lightbox
        projects={PORTFOLIO_PROJECTS}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
