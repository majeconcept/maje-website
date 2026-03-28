"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCursor } from "@/components/providers/CursorProvider";
import { cn } from "@/lib/utils";

/**
 * Multi-layer custom cursor.
 *
 * Architecture:
 * - Position: managed EXCLUSIVELY by GSAP quickTo (direct DOM writes at 60fps)
 * - Variant: CSS class changes driven by CursorContext (from CursorProvider)
 * - Touch: bails out entirely on pointer:coarse devices (mobile/tablet)
 *
 * Layer structure:
 * 1. dot       — small filled circle, fastest (0.15s ease)
 * 2. ring      — border circle, medium speed (0.2s ease)
 * 3. follower  — large border circle, visible lag (0.6s ease) = depth illusion
 * 4. spotlight — radial gradient, follows mouse via CSS custom properties
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { variant } = useCursor();

  useEffect(() => {
    // Bail out entirely on touch/coarse pointer devices (mobile, tablet)
    // Touch users have no hover intent — the cursor element would be a ghost artifact
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const follower = followerRef.current;
    if (!dot || !ring || !follower) return;

    // Add class to body to suppress native cursor via CSS (.cursor-active * { cursor: none })
    document.body.classList.add("cursor-active");

    // quickTo: returns a function that writes transform directly to the DOM element.
    // This is ~10x faster than gsap.to() for repeated updates and bypasses React entirely.
    // Duration = ease duration (not delay) — higher value = more lag on the follower.
    const moveDotX      = gsap.quickTo(dot,      "x", { duration: 0.15, ease: "power3.out" });
    const moveDotY      = gsap.quickTo(dot,      "y", { duration: 0.15, ease: "power3.out" });
    const moveRingX     = gsap.quickTo(ring,     "x", { duration: 0.20, ease: "power3.out" });
    const moveRingY     = gsap.quickTo(ring,     "y", { duration: 0.20, ease: "power3.out" });
    // Follower: duration 0.6s with power2.out = visible lerp lag (requirement CURS-02)
    const moveFollowerX = gsap.quickTo(follower, "x", { duration: 0.60, ease: "power2.out" });
    const moveFollowerY = gsap.quickTo(follower, "y", { duration: 0.60, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
      moveFollowerX(e.clientX);
      moveFollowerY(e.clientY);

      // Spotlight layer: update CSS custom properties for radial gradient position
      // Using CSS custom properties instead of inline style to avoid React re-renders
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--spotlight-x", `${e.clientX}px`);
        spotlightRef.current.style.setProperty("--spotlight-y", `${e.clientY}px`);
      }
    };

    // passive: true — we never call preventDefault() in this handler
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("cursor-active");
    };
  }, []); // Empty deps — quickTo functions are stable, no need to re-create

  // Variant → CSS class changes (scale, opacity, text content)
  // These only affect visual appearance — position is always handled by quickTo above
  const variantClasses: Record<string, string> = {
    default:    "",
    hover:      "scale-[2]",
    view:       "scale-[3.5]",
    drag:       "scale-[2]",
    crosshair:  "scale-75 rotate-45",
    text:       "scale-[0.3] opacity-50",
    hidden:     "opacity-0 scale-0",
  };

  return (
    <>
      {/* Layer 1: Dot — small filled circle, tracks cursor with minimal lag */}
      <div
        ref={dotRef}
        className={cn(
          "cursor-dot w-2 h-2 -translate-x-1/2 -translate-y-1/2",
          "bg-brand-cream rounded-full mix-blend-difference",
          "transition-transform duration-200 ease-out",
          variantClasses[variant] ?? ""
        )}
        aria-hidden="true"
      />

      {/* Layer 2: Ring — border circle, slightly slower */}
      <div
        ref={ringRef}
        className={cn(
          "cursor-ring w-8 h-8 -translate-x-1/2 -translate-y-1/2",
          "border border-brand-cream rounded-full mix-blend-difference",
          "transition-all duration-300 ease-out"
        )}
        aria-hidden="true"
      />

      {/* Layer 3: Follower — visible lag creates depth illusion (CURS-02) */}
      <div
        ref={followerRef}
        className={cn(
          "cursor-follower w-12 h-12 -translate-x-1/2 -translate-y-1/2",
          "border border-brand-gold/40 rounded-full",
          "transition-transform transition-opacity duration-300 ease-out",
          variantClasses[variant] ?? ""
        )}
        aria-hidden="true"
      />

      {/*
        Layer 4: Spotlight — radial gradient that reveals texture on dark sections (CURS-05)
        Position: CSS custom properties --spotlight-x / --spotlight-y set on mousemove above.
        The spotlight is shown (opacity > 0) only when the cursor is over data-spotlight sections.
        For Phase 1, it starts opacity-0 but the mechanism is wired.
      */}
      <div
        ref={spotlightRef}
        className="cursor-spotlight w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.15]"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.14 82 / 0.12) 0%, transparent 65%)",
          transform: "translate(calc(var(--spotlight-x, -9999px) - 50%), calc(var(--spotlight-y, -9999px) - 50%))",
          left: 0,
          top: 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
