"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useAnimation } from "@/components/providers/AnimationProvider"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  target: number
  suffix?: string
  label: string
  description?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = "",
  label,
  description,
  duration = 2.2,
  className,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLDivElement>(null)
  const displayRef = useRef<HTMLSpanElement>(null)
  const { isReady } = useAnimation()

  useGSAP(() => {
    if (!isReady) return
    if (!displayRef.current) return

    // Proxy object pattern — GSAP tweens a number, not a formatted string
    const proxy = { val: 0 }

    gsap.to(proxy, {
      val: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: counterRef.current,
        start: "top 80%",
        once: true,
      },
      onUpdate: () => {
        if (displayRef.current) {
          // Format with fr-FR locale for thousands separator if > 999
          const formatted =
            target >= 1000
              ? new Intl.NumberFormat("fr-FR").format(Math.round(proxy.val))
              : Math.round(proxy.val).toString()
          displayRef.current.textContent = formatted + suffix
        }
      },
    })
  }, { scope: counterRef, dependencies: [isReady] })

  return (
    <div ref={counterRef} className={cn("", className)}>
      <div
        className="font-display text-[clamp(2.5rem,5vw,4rem)] text-brand-gold leading-none tabular-nums"
        style={{ letterSpacing: "-0.03em" }}
      >
        <span ref={displayRef}>
          0{suffix}
        </span>
      </div>
      <p className="font-body text-brand-cream text-sm tracking-[0.18em] uppercase mt-3 mb-2">
        {label}
      </p>
      {description && (
        <p className="font-body text-brand-muted text-xs leading-relaxed max-w-[200px]">
          {description}
        </p>
      )}
    </div>
  )
}
