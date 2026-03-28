"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

interface MagneticOptions {
  /** Displacement strength — 0.4 means 40% of cursor distance. Default: 0.4 */
  strength?: number;
  /** Activation radius in px. Default: 80 */
  radius?: number;
}

interface MagneticHandlers {
  ref: React.RefObject<HTMLElement | null>;
  onMouseEnter: () => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic displacement effect for CTA buttons.
 *
 * Usage:
 *   const { ref, onMouseEnter, onMouseMove, onMouseLeave } = useMagnetic()
 *   <button ref={ref} onMouseEnter={onMouseEnter} onMouseMove={(e) => onMouseMove(e.nativeEvent)} onMouseLeave={onMouseLeave}>
 *
 * The button element physically moves via GSAP — not a transform trick on a child.
 * On mouseLeave: spring return to original position (power3.out, 0.4s).
 */
export function useMagnetic({
  strength = 0.4,
  radius = 80,
}: MagneticOptions = {}): MagneticHandlers {
  const ref = useRef<HTMLElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  const onMouseEnter = useCallback(() => {
    // Cache bounds on enter — getBoundingClientRect is expensive, don't call it on every mousemove
    boundsRef.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || !boundsRef.current) return;

      const { left, top, width, height } = boundsRef.current;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      // Only apply magnetic when within the activation radius
      if (dist < radius) {
        gsap.to(ref.current, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    [strength, radius]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    // Spring return to original position (CURS-04 requirement)
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    boundsRef.current = null;
  }, []);

  return { ref, onMouseEnter, onMouseMove, onMouseLeave };
}
