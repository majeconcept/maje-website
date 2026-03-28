export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section placeholder — active les tokens @theme pour vérification visuelle */}
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
        <div className="flex gap-4">
          {/* Bouton de test MagneticButton — sera remplacé en Phase 2 */}
          <button className="px-8 py-4 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold-light transition-colors duration-200">
            Nos Réalisations
          </button>
          <button className="px-8 py-4 border border-brand-cream/30 text-brand-cream tracking-widest uppercase text-sm hover:border-brand-cream transition-colors duration-200">
            Nous Contacter
          </button>
        </div>

        {/* Token smoke test — masqué visuellement mais confirme que les classes compilent */}
        <div className="hidden">
          <div className="bg-brand-black bg-brand-charcoal bg-brand-gold bg-brand-gold-light bg-brand-cream bg-brand-muted" />
          <div className="text-brand-black text-brand-charcoal text-brand-gold text-brand-cream text-brand-muted" />
          <div className="border-brand-charcoal border-brand-gold" />
        </div>
      </section>
    </main>
  );
}
