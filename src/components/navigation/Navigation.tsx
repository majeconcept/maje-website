"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCursor } from "@/components/providers/CursorProvider";

/**
 * Navigation links — must match section IDs in page.tsx.
 * Phase 2 adds content to these sections; Phase 1 already observes them.
 */
const NAV_LINKS = [
  { label: "Réalisations",  href: "#realisations",  sectionId: "realisations"  },
  { label: "Expertises",    href: "#expertises",    sectionId: "expertises"    },
  { label: "Configurateur", href: "#configurateur", sectionId: "configurateur" },
  { label: "Contact",       href: "#contact",       sectionId: "contact"       },
] as const;

/**
 * Fixed navigation bar with:
 * - Logo (left) + nav links (right) on desktop
 * - Hamburger placeholder (right) on mobile (full mobile menu = Phase 4)
 * - Transparent background → semi-transparent blur after 60px scroll
 * - Active link (brand-gold) driven by IntersectionObserver on section elements
 * - Nav links trigger cursor "hover" variant
 */
export function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const { setVariant } = useCursor();

  useEffect(() => {
    // Track scroll depth for background appearance change
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver: mark section as active when it occupies the center of the viewport.
    // rootMargin "-80px 0px -40% 0px" = only the upper 60% of the viewport counts
    // (excludes nav height at top, and the bottom 40% for smoother transitions)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    // Observe all nav target sections
    NAV_LINKS.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100]",
        "flex items-center justify-between px-8 py-5",
        "transition-all duration-500",
        scrolled
          ? "bg-brand-black/80 backdrop-blur-md border-b border-brand-charcoal/60"
          : "bg-transparent"
      )}
      role="navigation"
      aria-label="Navigation principale"
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center"
        aria-label="Maje Concept — Accueil"
        onMouseEnter={() => setVariant("hover")}
        onMouseLeave={() => setVariant("default")}
      >
        <Image
          src="/LOGO VECTO SOURCE.svg"
          alt="Maje Concept"
          width={120}
          height={36}
          priority
          unoptimized
        />
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-8" role="list">
        {NAV_LINKS.map(({ label, href, sectionId }) => (
          <li key={sectionId}>
            <a
              href={href}
              className={cn(
                "text-xs tracking-[0.2em] uppercase font-medium",
                "transition-colors duration-300",
                activeSection === sectionId
                  ? "text-brand-gold"
                  : "text-brand-cream/50 hover:text-brand-cream"
              )}
              aria-current={activeSection === sectionId ? "true" : undefined}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA desktop */}
      <a
        href="#contact"
        className={cn(
          "hidden md:inline-flex items-center justify-center",
          "px-6 py-2.5",
          "border border-brand-gold text-brand-gold",
          "text-xs tracking-[0.2em] uppercase font-medium",
          "hover:bg-brand-gold hover:text-brand-black",
          "transition-all duration-300"
        )}
        onMouseEnter={() => setVariant("hover")}
        onMouseLeave={() => setVariant("default")}
      >
        Devis gratuit
      </a>

      {/* Mobile hamburger — full implementation in Phase 4 */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Ouvrir le menu"
        aria-expanded="false"
      >
        <span className="block w-6 h-px bg-brand-cream" />
        <span className="block w-4 h-px bg-brand-cream" />
        <span className="block w-5 h-px bg-brand-cream" />
      </button>
    </nav>
  );
}
