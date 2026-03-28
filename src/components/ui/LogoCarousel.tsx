"use client"

import { useRef } from "react"
import { useCursor } from "@/components/providers/CursorProvider"
import type { ClientLogo } from "@/data/social-proof"
import { cn } from "@/lib/utils"

interface LogoCarouselProps {
  logos: ClientLogo[]
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { setVariant } = useCursor()

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused"
    }
    setVariant("drag")
  }

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running"
    }
    setVariant("default")
  }

  return (
    <div
      className="overflow-hidden cursor-none"
      data-cursor="drag"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex gap-0 items-stretch whitespace-nowrap will-change-transform logo-marquee"
      >
        {/* Render logos TWICE for seamless loop — CSS marquee moves -50% */}
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.id}-${i}`}
            className={cn(
              "flex-shrink-0 flex flex-col justify-center px-10 py-6",
              "border-r border-brand-cream/10 min-w-[200px]",
              "transition-all duration-300",
              "hover:bg-brand-cream/5"
            )}
          >
            <span className="font-body text-brand-cream/50 text-sm tracking-[0.1em] block hover:text-brand-cream/80 transition-colors duration-300">
              {logo.name}
            </span>
            <span className="font-body text-brand-muted/40 text-xs tracking-widest uppercase mt-1">
              {logo.sector}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
