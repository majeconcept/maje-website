"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { useConfigurator } from "@/lib/configuratorContext";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const NEED_OPTIONS = [
  { value: "serigraphie", label: "Sérigraphie" },
  { value: "broderie", label: "Broderie" },
  { value: "dtf", label: "DTF (Impression directe)" },
  { value: "flocage", label: "Flocage" },
  { value: "transfert", label: "Transfert" },
  { value: "marquage-textile", label: "Marquage Textile (autre)" },
  { value: "autre", label: "Autre demande" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 font-body text-xs text-red-400"
    >
      {message}
    </motion.p>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full bg-transparent border px-4 py-3 font-body text-sm text-brand-cream placeholder:text-brand-muted/40",
    "focus:outline-none transition-colors duration-200",
    hasError
      ? "border-red-500/60 focus:border-red-400"
      : "border-brand-cream/15 focus:border-brand-gold hover:border-brand-cream/30"
  );

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isReady } = useAnimation();
  const { config, getConfigSummary } = useConfigurator();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      configuratorSummary: config.hasConfig ? getConfigSummary() : "",
    },
  });

  // GSAP entrance animation — isReady gate
  useGSAP(
    () => {
      if (!isReady) return;
      const ctx = gsap.context(() => {
        gsap.from(".contact-header", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-header",
            start: "top 85%",
            once: true,
          },
        });
        gsap.from(".contact-form-wrapper", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: ".contact-form-wrapper",
            start: "top 80%",
            once: true,
          },
        });
        gsap.from(".contact-info", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".contact-info",
            start: "top 80%",
            once: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    },
    { dependencies: [isReady] }
  );

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Connexion impossible. Vérifiez votre connexion internet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-brand-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Gold accent top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="contact-header text-center mb-16">
          <p className="font-body text-brand-gold tracking-[0.2em] uppercase text-xs mb-4">
            Demande de devis
          </p>
          <h2 className="font-display text-4xl lg:text-6xl text-brand-cream leading-none mb-6">
            Parlons de votre
            <br />
            <span className="text-brand-gold">projet</span>
          </h2>
          <p className="font-body text-brand-muted text-base max-w-2xl mx-auto">
            Décrivez votre besoin et nous vous répondrons sous 24 heures ouvrées
            avec une proposition sur mesure.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          {/* Form with AnimatePresence swap */}
          <div className="contact-form-wrapper">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Honeypot — hidden from humans */}
                    <input
                      type="text"
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-9999px",
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                      }}
                      {...register("website")}
                    />

                    {/* Row 1: Prénom + Nom */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                          Prénom <span className="text-brand-gold">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Marie"
                          className={inputClass(!!errors.firstName)}
                          {...register("firstName")}
                        />
                        <FieldError message={errors.firstName?.message} />
                      </div>
                      <div>
                        <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                          Nom <span className="text-brand-gold">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Dupont"
                          className={inputClass(!!errors.lastName)}
                          {...register("lastName")}
                        />
                        <FieldError message={errors.lastName?.message} />
                      </div>
                    </div>

                    {/* Row 2: Email + Téléphone */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                          Email <span className="text-brand-gold">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="marie@entreprise.fr"
                          className={inputClass(!!errors.email)}
                          {...register("email")}
                        />
                        <FieldError message={errors.email?.message} />
                      </div>
                      <div>
                        <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          placeholder="0612 345 678"
                          className={inputClass(!!errors.phone)}
                          {...register("phone")}
                        />
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>

                    {/* Row 3: Entreprise */}
                    <div className="mb-4">
                      <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                        Entreprise / Organisation
                      </label>
                      <input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        className={inputClass(!!errors.company)}
                        {...register("company")}
                      />
                    </div>

                    {/* Row 4: Type de besoin */}
                    <div className="mb-4">
                      <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                        Type de besoin{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                      <select
                        className={cn(
                          inputClass(!!errors.needType),
                          "cursor-pointer appearance-none"
                        )}
                        {...register("needType")}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Sélectionnez une option
                        </option>
                        {NEED_OPTIONS.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            style={{
                              backgroundColor: "#0A0A0F",
                              color: "#F5F5F0",
                            }}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.needType?.message} />
                    </div>

                    {/* Row 5: Message */}
                    <div className="mb-4">
                      <label className="block font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-2">
                        Message <span className="text-brand-gold">*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Décrivez votre projet, les quantités souhaitées, les délais..."
                        className={cn(inputClass(!!errors.message), "resize-none")}
                        {...register("message")}
                      />
                      <FieldError message={errors.message?.message} />
                    </div>

                    {/* Row 6: Configurator pre-fill (shown only if hasConfig) */}
                    {config.hasConfig && (
                      <div className="mb-6 p-4 border border-brand-gold/20 bg-brand-gold/5">
                        <label className="block font-body text-brand-gold text-xs tracking-[0.1em] uppercase mb-2">
                          Configuration produit pré-remplie
                        </label>
                        <p className="font-body text-brand-cream/80 text-sm">
                          {getConfigSummary()}
                        </p>
                        <input
                          type="hidden"
                          {...register("configuratorSummary")}
                        />
                      </div>
                    )}

                    {/* Submit error */}
                    {submitError && (
                      <div className="mb-4 p-3 border border-red-500/30 bg-red-500/5">
                        <p className="font-body text-red-400 text-sm">
                          {submitError}
                        </p>
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "group relative w-full py-4 font-body text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all duration-300",
                        isSubmitting
                          ? "bg-brand-gold/50 text-brand-black/50 cursor-not-allowed"
                          : "bg-brand-gold text-brand-black hover:bg-brand-gold/90"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="40"
                              strokeDashoffset="10"
                            />
                          </svg>
                          Envoi en cours…
                        </span>
                      ) : (
                        <span className="relative z-10">
                          Envoyer ma demande
                        </span>
                      )}
                      {!isSubmitting && (
                        <span className="absolute inset-0 w-0 bg-brand-cream/20 group-hover:w-full transition-all duration-500 ease-out" />
                      )}
                    </button>
                    <p className="mt-3 text-center font-body text-brand-muted/40 text-xs">
                      Réponse garantie sous 24 heures ouvrées — sans engagement
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-20"
                >
                  {/* Animated checkmark SVG */}
                  <motion.svg
                    viewBox="0 0 52 52"
                    className="w-16 h-16 mx-auto mb-8 text-brand-gold"
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: {
                          pathLength: 1,
                          opacity: 1,
                          transition: { duration: 0.7, ease: "easeOut" },
                        },
                      }}
                    />
                    <motion.path
                      d="M 14 27 L 22 35 L 38 19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0 },
                        visible: {
                          pathLength: 1,
                          transition: {
                            duration: 0.4,
                            delay: 0.6,
                            ease: "easeOut",
                          },
                        },
                      }}
                    />
                  </motion.svg>

                  <h3 className="font-display text-3xl lg:text-4xl text-brand-cream mb-4">
                    Demande envoyée
                  </h3>
                  <p className="font-body text-brand-muted text-base max-w-md mx-auto mb-8">
                    Merci pour votre message. Notre équipe vous répondra sous{" "}
                    <span className="text-brand-gold">24 heures ouvrées</span>.
                  </p>
                  <p className="font-body text-brand-muted/50 text-sm">
                    Un email de confirmation vous a été envoyé.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact info sidebar */}
          <div className="contact-info space-y-8 lg:pt-4">
            <div>
              <p className="font-body text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
                Nos coordonnées
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-1">
                    Adresse
                  </p>
                  <p className="font-body text-brand-cream text-sm leading-relaxed">
                    10 Rue du Maréchal Foch
                    <br />
                    68000 Colmar
                  </p>
                </div>
                <div>
                  <p className="font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-1">
                    Téléphone
                  </p>
                  <a
                    href="tel:+33389XXXXXX"
                    className="font-body text-brand-cream text-sm hover:text-brand-gold transition-colors"
                  >
                    +33 3 89 XX XX XX
                  </a>
                </div>
                <div>
                  <p className="font-body text-brand-muted text-xs tracking-[0.1em] uppercase mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:contact@maje-concept.fr"
                    className="font-body text-brand-cream text-sm hover:text-brand-gold transition-colors"
                  >
                    contact@maje-concept.fr
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-cream/10 pt-8">
              <p className="font-body text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
                Horaires
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-brand-muted text-sm">
                    Lundi – Vendredi
                  </span>
                  <span className="font-body text-brand-cream text-sm">
                    8h – 18h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-brand-muted text-sm">
                    Samedi
                  </span>
                  <span className="font-body text-brand-muted text-sm">
                    Sur RDV
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-cream/10 pt-8">
              <p className="font-body text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
                Réponse garantie
              </p>
              <p className="font-body text-brand-muted text-sm leading-relaxed">
                Nous nous engageons à répondre à toutes les demandes sous 24
                heures ouvrées avec une proposition commerciale détaillée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
