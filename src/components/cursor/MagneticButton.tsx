"use client";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursor } from "@/components/providers/CursorProvider";
import { cn } from "@/lib/utils";
import type { CursorVariant } from "@/components/providers/CursorProvider";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Cursor variant when hovering this button. Default: "hover" */
  cursorVariant?: CursorVariant;
  /** Magnetic strength (0.4 = 40% of cursor distance). Default: 0.4 */
  magnetStrength?: number;
  /** Activation radius in px. Default: 80 */
  magnetRadius?: number;
  /** HTML type attribute. Default: "button" */
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * Primary CTA button with magnetic cursor effect.
 *
 * Wraps any button content. The entire button element shifts toward the cursor
 * within the magnetic radius, creating the premium interaction feel.
 *
 * Usage:
 *   <MagneticButton className="px-8 py-4 bg-brand-gold text-brand-black">
 *     Nos Réalisations
 *   </MagneticButton>
 */
export function MagneticButton({
  children,
  className,
  onClick,
  cursorVariant = "hover",
  magnetStrength = 0.4,
  magnetRadius = 80,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const { ref, onMouseEnter, onMouseMove, onMouseLeave } = useMagnetic({
    strength: magnetStrength,
    radius: magnetRadius,
  });
  const { setVariant } = useCursor();

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center",
        "transition-colors duration-200",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => {
        onMouseEnter();
        setVariant(cursorVariant);
      }}
      onMouseMove={(e) => onMouseMove(e.nativeEvent)}
      onMouseLeave={() => {
        onMouseLeave();
        setVariant("default");
      }}
    >
      {children}
    </button>
  );
}
