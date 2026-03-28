"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

interface PreloaderProps {
  /** Called after exit animation completes — triggers isReady in AnimationProvider */
  onComplete: () => void;
}

/**
 * Fullscreen preloader that gates Phase 2 entrance animations.
 *
 * Design:
 * - Full-screen brand-black overlay sits ABOVE all content
 * - Logo fades in with upward translate (fadeInUp keyframe from globals.css)
 * - Progress bar animates from 0% to 100% over ~2.2s (GSAP, ease power1.inOut)
 * - Hard timeout at 2800ms — NEVER blocks longer (prevents bounce rate damage)
 * - Exit: opacity fade + slight upward movement (0.6s), then calls onComplete
 *
 * Important: The preloader is cosmetic — it hides FOUT and orchestrates timing.
 * All HTML content renders underneath it. It is NOT a content gate.
 */

const MAX_DURATION_MS = 2800; // Hard cap — user sees content before 3s guaranteed

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef({ value: 0 });
  const hasCompletedRef = useRef(false);

  const complete = () => {
    // Guard: only complete once (prevents double-call from timeout + onComplete racing)
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (!containerRef.current) {
      onComplete();
      return;
    }

    // Exit animation: fade out + slight upward movement
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete,
    });
  };

  useGSAP(
    () => {
      // Hard timeout — always exit before 3s regardless of asset state
      const timeout = setTimeout(complete, MAX_DURATION_MS);

      // Animate progress bar 0 → 100 over 2.2s
      gsap.to(progressValueRef.current, {
        value: 100,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate: function () {
          const bar = containerRef.current?.querySelector<HTMLDivElement>(
            "[data-progress-bar]"
          );
          if (bar) {
            bar.style.width = `${progressValueRef.current.value}%`;
          }
        },
        onComplete: () => {
          clearTimeout(timeout);
          // Brief pause at 100% before exiting — feels intentional, not abrupt
          setTimeout(complete, 200);
        },
      });

      return () => clearTimeout(timeout);
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-brand-black flex flex-col items-center justify-center"
      role="status"
      aria-label="Chargement de Maje Concept"
    >
      {/* Logo — fades in upward using CSS keyframe from globals.css */}
      <div
        className="mb-16 opacity-0"
        style={{
          animation: "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
        }}
      >
        <Image
          src="/LOGO VECTO SOURCE.svg"
          alt="Maje Concept"
          width={160}
          height={48}
          priority
          unoptimized // SVG — next/image optimization adds no value for SVG
        />
      </div>

      {/* Progress bar container */}
      <div
        className="opacity-0"
        style={{
          animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards",
        }}
      >
        <div className="w-48 h-px bg-brand-charcoal overflow-hidden">
          <div
            data-progress-bar
            className="h-full bg-brand-gold"
            style={{ width: "0%", transition: "none" }}
          />
        </div>

        {/* Label */}
        <p className="text-brand-muted text-xs tracking-[0.3em] uppercase mt-4 text-center">
          Chargement
        </p>
      </div>
    </div>
  );
}
