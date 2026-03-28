import { MagneticButton } from "@/components/cursor/MagneticButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section
        id="hero-placeholder"
        className="flex min-h-screen flex-col items-center justify-center gap-8 px-8"
      >
        <h1 className="text-5xl font-bold text-brand-gold tracking-tight text-center">
          Maje Concept
        </h1>
        <p className="text-xl text-brand-cream/70 text-center max-w-lg">
          Impression &amp; Marquage Textile Premium — Alsace
        </p>

        {/* MagneticButton test — vérifier l'effet magnétique en approchant le curseur */}
        <div className="flex gap-6">
          <MagneticButton className="px-8 py-4 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold-light">
            Nos Réalisations
          </MagneticButton>
          <MagneticButton
            className="px-8 py-4 border border-brand-cream/30 text-brand-cream tracking-widest uppercase text-sm hover:border-brand-cream"
            cursorVariant="hover"
          >
            Nous Contacter
          </MagneticButton>
        </div>

        <p className="text-brand-muted text-sm text-center">
          Approcher le curseur des boutons à ~80px pour voir l&apos;effet magnétique
        </p>

        {/* Sections placeholder avec IDs pour tester l'IntersectionObserver (plan 03) */}
        <div id="realisations" className="h-screen w-full flex items-center justify-center">
          <span className="text-brand-muted">Section Réalisations (placeholder)</span>
        </div>
        <div id="expertises" className="h-screen w-full flex items-center justify-center">
          <span className="text-brand-muted">Section Expertises (placeholder)</span>
        </div>
        <div id="configurateur" className="h-screen w-full flex items-center justify-center">
          <span className="text-brand-muted">Section Configurateur (placeholder)</span>
        </div>
        <div id="contact" className="h-screen w-full flex items-center justify-center">
          <span className="text-brand-muted">Section Contact (placeholder)</span>
        </div>
      </section>
    </main>
  );
}
