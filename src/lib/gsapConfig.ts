"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

/**
 * Centralized GSAP plugin registration.
 * Called once at module level in LenisProvider (plan 02).
 * The `registered` guard prevents double-registration on Next.js hot reloads.
 */
let registered = false;

export function registerGSAPPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  registered = true;
}
