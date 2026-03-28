"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAPPlugins } from "@/lib/gsapConfig";

// Register GSAP plugins once at module level
registerGSAPPlugins();

const LenisContext = createContext<Lenis | null>(null);

/**
 * Access the Lenis instance from any child component.
 * Used by Phase 2 sections that need to pause/resume scroll.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,        // CRITICAL: GSAP ticker drives the RAF loop, not Lenis
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    // Without this, ScrollTrigger calculates positions against native scroll
    // while Lenis intercepts events — triggers fire at wrong positions
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker drives Lenis — ONE animation loop, not two
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Prevent GSAP from throttling when tab is backgrounded — causes scroll stutter on return
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // Note: lenisRef.current is null on first render (before useEffect).
  // Components that need Lenis should handle null gracefully.
  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
