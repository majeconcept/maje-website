"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * Cursor semantic variant — drives CSS class changes (scale, text content).
 * NEVER drives position. Position is managed exclusively by GSAP quickTo in CustomCursor.tsx.
 *
 * Variants used by Phase 2 components:
 * - "view"       → portfolio card hover (enlarges with "Voir" text)
 * - "drag"       → carousel hover (drag indicator)
 * - "crosshair"  → configurator canvas (Phase 3)
 */
export type CursorVariant =
  | "default"
  | "hover"
  | "view"
  | "drag"
  | "crosshair"
  | "text"
  | "hidden";

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (v: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextValue>({
  variant: "default",
  setVariant: () => {},
});

/**
 * Access cursor variant state.
 * Usage: const { variant, setVariant } = useCursor()
 *
 * On interactive elements:
 *   onMouseEnter={() => setVariant("view")}
 *   onMouseLeave={() => setVariant("default")}
 */
export function useCursor(): CursorContextValue {
  return useContext(CursorContext);
}

interface CursorProviderProps {
  children: React.ReactNode;
}

export function CursorProvider({ children }: CursorProviderProps) {
  const [variant, setVariantState] = useState<CursorVariant>("default");

  // useCallback prevents unnecessary re-renders when setVariant is passed down
  const setVariant = useCallback((v: CursorVariant) => {
    setVariantState(v);
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {children}
    </CursorContext.Provider>
  );
}
