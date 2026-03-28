// src/components/sections/Footer.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Réalisations", href: "#portfolio" },
  { label: "Expertises", href: "#expertises" },
  { label: "Références", href: "#social-proof" },
  { label: "Configurateur", href: "#configurateur" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/maje-concept",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/majece.concept",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/majece.concept",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    // Newsletter collection — in v1, just show success (no backend)
    // Phase 4 / v2: connect to Mailchimp/Brevo API
    setStatus("success");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {status === "success" ? (
        <p className="font-body text-brand-gold text-sm">
          Inscription confirmée. Merci !
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="votre@email.fr"
              className={cn(
                "flex-1 min-w-0 bg-transparent border px-3 py-2.5 font-body text-sm text-brand-cream placeholder:text-brand-muted/40",
                "focus:outline-none transition-colors duration-200",
                status === "error"
                  ? "border-red-500/50 focus:border-red-400"
                  : "border-brand-cream/15 focus:border-brand-gold"
              )}
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-gold text-brand-black font-body text-xs tracking-[0.1em] uppercase whitespace-nowrap hover:bg-brand-gold/90 transition-colors duration-200"
            >
              S&apos;inscrire
            </button>
          </div>
          {status === "error" && (
            <p className="mt-1.5 font-body text-red-400 text-xs">
              Adresse email invalide.
            </p>
          )}
        </>
      )}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-brand-black border-t border-brand-cream/10">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <p className="font-display text-brand-cream text-xl tracking-tight mb-2">
              Maje Concept
            </p>
            <p className="font-body text-brand-gold text-xs tracking-[0.15em] uppercase mb-6">
              Print &amp; Marquage Textile
            </p>
            <p className="font-body text-brand-muted text-sm leading-relaxed mb-6">
              Spécialiste alsacien du marquage textile et de l&apos;impression sur mesure
              depuis plus de 15 ans. Sérigraphie, broderie, DTF, flocage.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 border border-brand-cream/15 flex items-center justify-center text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="font-body text-brand-cream text-xs tracking-[0.2em] uppercase mb-6">
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-brand-muted text-sm hover:text-brand-cream transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-brand-gold/0 group-hover:bg-brand-gold/60 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p className="font-body text-brand-cream text-xs tracking-[0.2em] uppercase mb-6">
              Coordonnées
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-body text-brand-muted/60 text-xs tracking-[0.1em] uppercase mb-1">Adresse</p>
                <address className="not-italic font-body text-brand-muted text-sm leading-relaxed">
                  10 Rue du Maréchal Foch<br />
                  68000 Colmar<br />
                  Alsace, France
                </address>
              </div>
              <div>
                <p className="font-body text-brand-muted/60 text-xs tracking-[0.1em] uppercase mb-1">Téléphone</p>
                <a
                  href="tel:+33389XXXXXX"
                  className="font-body text-brand-muted text-sm hover:text-brand-cream transition-colors"
                >
                  +33 3 89 XX XX XX
                </a>
              </div>
              <div>
                <p className="font-body text-brand-muted/60 text-xs tracking-[0.1em] uppercase mb-1">Email</p>
                <a
                  href="mailto:contact@maje-concept.fr"
                  className="font-body text-brand-muted text-sm hover:text-brand-cream transition-colors"
                >
                  contact@maje-concept.fr
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <p className="font-body text-brand-cream text-xs tracking-[0.2em] uppercase mb-6">
              Newsletter
            </p>
            <p className="font-body text-brand-muted text-sm leading-relaxed mb-2">
              Tendances print textile, nouveautés techniques et
              offres exclusives — directement dans votre boîte mail.
            </p>
            <NewsletterForm />
            <p className="mt-3 font-body text-brand-muted/40 text-xs">
              Pas de spam. Désinscription à tout moment.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-cream/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-brand-muted/50 text-xs">
            © {new Date().getFullYear()} Maje Concept — Tous droits réservés
          </p>
          <nav className="flex gap-6" aria-label="Liens légaux">
            <a href="#" className="font-body text-brand-muted/50 text-xs hover:text-brand-muted transition-colors">
              Mentions légales
            </a>
            <a href="#" className="font-body text-brand-muted/50 text-xs hover:text-brand-muted transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="font-body text-brand-muted/50 text-xs hover:text-brand-muted transition-colors">
              CGV
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
