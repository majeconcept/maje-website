"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Preloader } from "@/components/ui/Preloader";

interface AnimationContextValue {
  /**
   * true after the preloader has completed its exit animation.
   * Phase 2 section entrance animations MUST check isReady before firing.
   *
   * Pattern in sections:
   *   const { isReady } = useAnimation()
   *   useGSAP(() => {
   *     if (!isReady) return
   *     // ... entrance animation
   *   }, { dependencies: [isReady] })
   */
  isReady: boolean;
  /** Exposed for Preloader to call — normally not used directly by sections */
  onPreloaderComplete: () => void;
}

const AnimationContext = createContext<AnimationContextValue>({
  isReady: false,
  onPreloaderComplete: () => {},
});

/**
 * Access the animation readiness state.
 * isReady === true means the preloader has finished and entrance animations may fire.
 */
export function useAnimation(): AnimationContextValue {
  return useContext(AnimationContext);
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const onPreloaderComplete = useCallback(() => {
    // Set isReady immediately — sections can start preparing animations
    setIsReady(true);
    // Remove preloader from DOM after exit animation completes (0.6s exit + 200ms buffer)
    // Keeping it in DOM during the exit would cause z-index conflicts
    setTimeout(() => setShowPreloader(false), 800);
  }, []);

  return (
    <AnimationContext.Provider value={{ isReady, onPreloaderComplete }}>
      {/* Preloader renders above all content (z-[10000]) */}
      {showPreloader && <Preloader onComplete={onPreloaderComplete} />}
      {children}
    </AnimationContext.Provider>
  );
}
