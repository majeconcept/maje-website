"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { useCursor } from "@/components/providers/CursorProvider";
import { useConfigurator, type ConfiguratorState } from "@/lib/configuratorContext";
import {
  PRODUCTS,
  COLORS,
  TECHNIQUES,
  QUANTITIES,
  type ProductType,
  type TechniqueType,
  type QuantityType,
} from "@/data/configurator";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// GarmentSVG — 4 stacked layers:
//   Layer 1: base silhouette with dynamic fill color
//   Layer 2: shadow/fold overlays (fixed)
//   Layer 3: product-specific details (collar, hood, zipper)
//   Layer 4: marking zone placeholder (dashed gold rect)
// ---------------------------------------------------------------------------
function GarmentSVG({ config }: { config: ConfiguratorState }) {
  const { colorHex, productType } = config;
  return (
    <svg
      viewBox="0 0 400 440"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Layer 1 — Base silhouette */}
      <path
        d="M 160,20 C 155,15 145,10 130,10 C 110,10 95,25 80,35 L 10,75 L 35,145 L 90,120 L 90,420 L 310,420 L 310,120 L 365,145 L 390,75 L 320,35 C 305,25 290,10 270,10 C 255,10 245,15 240,20 C 235,35 225,50 200,50 C 175,50 165,35 160,20 Z"
        fill={colorHex}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* Layer 2 — Shadows/folds (fixed, overlay) */}
      <path
        d="M 90,120 L 90,420 Q 145,410 145,380 L 145,120 Z"
        fill="rgba(0,0,0,0.12)"
      />
      <path
        d="M 310,120 L 310,420 Q 255,410 255,380 L 255,120 Z"
        fill="rgba(0,0,0,0.08)"
      />

      {/* Layer 3 — Product-specific details */}
      {productType === 'polo' && (
        <rect x="175" y="50" width="50" height="30" rx="4" fill="rgba(0,0,0,0.25)" />
      )}
      {productType === 'sweat' && (
        <path
          d="M 145,10 Q 200,0 255,10 Q 230,45 200,50 Q 170,45 145,10 Z"
          fill="rgba(0,0,0,0.2)"
        />
      )}
      {productType === 'veste' && (
        <line
          x1="200"
          y1="55"
          x2="200"
          y2="420"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
        />
      )}

      {/* Layer 4 — Marking zone placeholder */}
      <rect
        x="155"
        y="140"
        width="90"
        height="90"
        rx="4"
        fill="none"
        stroke="rgba(201,168,76,0.6)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <text
        x="200"
        y="192"
        textAnchor="middle"
        fill="rgba(201,168,76,0.8)"
        fontSize="11"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.05em"
      >
        MC
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ConfiguratorSection
// ---------------------------------------------------------------------------
export function ConfiguratorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isReady } = useAnimation();
  const { setVariant } = useCursor();
  const { config, updateConfig } = useConfigurator();

  // GSAP entrance animation — isReady gate (same pattern as all sections)
  useGSAP(
    () => {
      if (!isReady) return;
      gsap.from(".config-header", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".config-header",
          start: "top 85%",
          once: true,
        },
      });
      gsap.from(".config-panel", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".config-panel",
          start: "top 80%",
          once: true,
        },
      });
      gsap.from(".config-preview", {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".config-preview",
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [isReady] }
  );

  function handleDemanderDevis() {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Format price for display — fr-FR locale
  const priceFormatted = new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(config.estimatedPrice);

  const totalFormatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(config.estimatedPrice * config.quantity);

  return (
    <section
      ref={sectionRef}
      id="configurateur"
      className="relative bg-brand-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,168,76,0.5) 39px, rgba(201,168,76,0.5) 40px)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="config-header text-center mb-16">
          <p className="font-body text-brand-gold tracking-[0.2em] uppercase text-xs mb-4">
            Configurateur produit
          </p>
          <h2 className="font-display text-4xl lg:text-6xl text-brand-cream leading-none mb-6">
            Visualisez votre<br />
            <span className="text-brand-gold">création</span>
          </h2>
          <p className="font-body text-brand-muted text-base max-w-2xl mx-auto">
            Sélectionnez votre produit, coloris et technique de marquage.
            Obtenez une estimation instantanée et demandez votre devis personnalisé.
          </p>
        </div>

        {/* Main layout: controls left, preview right */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Controls panel */}
          <div className="config-panel space-y-6">

            {/* Product type */}
            <div>
              <label className="block font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-3">
                Type de produit
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCTS.map(product => (
                  <button
                    key={product.id}
                    onClick={() => updateConfig({ productType: product.id as ProductType })}
                    className={cn(
                      "p-3 text-left border transition-all duration-200",
                      config.productType === product.id
                        ? "border-brand-gold bg-brand-gold/10 text-brand-cream"
                        : "border-brand-cream/10 text-brand-muted hover:border-brand-cream/30 hover:text-brand-cream"
                    )}
                  >
                    <p className="font-body text-sm font-medium">{product.label}</p>
                    <p className="font-body text-xs opacity-60 mt-0.5">{product.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-3">
                Coloris —{" "}
                <span className="text-brand-cream normal-case tracking-normal">
                  {config.colorName}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() =>
                      updateConfig({
                        colorId: color.id,
                        colorName: color.label,
                        colorHex: color.hex,
                      })
                    }
                    title={color.label}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-all duration-150",
                      config.colorId === color.id
                        ? "border-brand-gold scale-110 shadow-lg shadow-brand-gold/20"
                        : "border-transparent hover:border-brand-cream/40"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Technique */}
            <div>
              <label className="block font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-3">
                Technique de marquage
              </label>
              <div className="space-y-1.5">
                {TECHNIQUES.map(technique => (
                  <button
                    key={technique.id}
                    onClick={() => updateConfig({ technique: technique.id as TechniqueType })}
                    className={cn(
                      "w-full flex items-center justify-between p-3 border text-left transition-all duration-200",
                      config.technique === technique.id
                        ? "border-brand-gold bg-brand-gold/10"
                        : "border-brand-cream/10 hover:border-brand-cream/30"
                    )}
                  >
                    <span
                      className={cn(
                        "font-body text-sm",
                        config.technique === technique.id
                          ? "text-brand-cream"
                          : "text-brand-muted"
                      )}
                    >
                      {technique.label}
                    </span>
                    <span className="font-body text-xs text-brand-muted/60">
                      {technique.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-3">
                Quantité —{" "}
                <span className="text-brand-cream normal-case tracking-normal">
                  {config.quantity} pièces
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {QUANTITIES.map(qty => (
                  <button
                    key={qty}
                    onClick={() => updateConfig({ quantity: qty as QuantityType })}
                    className={cn(
                      "px-4 py-2 border font-body text-sm transition-all duration-150",
                      config.quantity === qty
                        ? "border-brand-gold bg-brand-gold/10 text-brand-cream"
                        : "border-brand-cream/10 text-brand-muted hover:border-brand-cream/30 hover:text-brand-cream"
                    )}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Size range */}
            <div>
              <label className="block font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-3">
                Gamme de tailles
              </label>
              <div className="flex gap-2">
                {(["XS-XL", "XS-3XL"] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => updateConfig({ sizeRange: size })}
                    className={cn(
                      "px-6 py-2 border font-body text-sm transition-all duration-150",
                      config.sizeRange === size
                        ? "border-brand-gold bg-brand-gold/10 text-brand-cream"
                        : "border-brand-cream/10 text-brand-muted hover:border-brand-cream/30 hover:text-brand-cream"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview + Estimation + CTA */}
          <div className="config-preview flex flex-col gap-6">

            {/* SVG Preview */}
            <div
              className="relative aspect-square bg-brand-cream/5 border border-brand-cream/10 flex items-center justify-center p-8 cursor-crosshair"
              onMouseEnter={() => setVariant("crosshair")}
              onMouseLeave={() => setVariant("default")}
            >
              <div className="w-full max-w-[300px] mx-auto">
                <GarmentSVG config={config} />
              </div>
              {/* Technique badge */}
              <div className="absolute top-4 right-4 px-2 py-1 bg-brand-gold/10 border border-brand-gold/30">
                <span className="font-body text-brand-gold text-[10px] tracking-[0.15em] uppercase">
                  {TECHNIQUES.find(t => t.id === config.technique)?.label}
                </span>
              </div>
            </div>

            {/* Price estimation card */}
            <div className="border border-brand-cream/10 bg-brand-cream/[0.02] p-6">
              <p className="font-body text-brand-muted text-xs tracking-[0.15em] uppercase mb-4">
                Estimation indicative
              </p>
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="font-display text-brand-cream text-3xl">
                    {priceFormatted}€
                    <span className="font-body text-brand-muted text-base ml-1">/pièce</span>
                  </p>
                  <p className="font-body text-brand-muted text-sm mt-1">
                    soit {totalFormatted} pour {config.quantity} pièces
                  </p>
                </div>
                <p className="font-body text-brand-muted/50 text-xs text-right max-w-[120px]">
                  Prix indicatif,<br />devis sur mesure
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-cream/10 text-xs font-body text-brand-muted space-y-1">
                <p>Produit : {PRODUCTS.find(p => p.id === config.productType)?.label}</p>
                <p>Coloris : {config.colorName}</p>
                <p>Technique : {TECHNIQUES.find(t => t.id === config.technique)?.label}</p>
                <p>Tailles : {config.sizeRange}</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleDemanderDevis}
              className="group relative w-full py-4 bg-brand-gold text-brand-black font-body text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all duration-300 hover:bg-brand-gold/90"
            >
              <span className="relative z-10">Demander un devis</span>
              <span className="absolute inset-0 w-0 bg-brand-cream/20 group-hover:w-full transition-all duration-500 ease-out" />
            </button>
            <p className="text-center font-body text-brand-muted/50 text-xs">
              Réponse sous 24 heures ouvrées — sans engagement
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
