import { HeroSection } from "@/components/sections/HeroSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { ExpertiseSection } from "@/components/sections/ExpertiseSection"
import { SocialProofSection } from "@/components/sections/SocialProofSection"
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection"
import { ConfiguratorProvider } from "@/lib/configuratorContext"

export default function Home() {
  return (
    <ConfiguratorProvider>
      <main>
        {/* Phase 2 — Plan 01 */}
        <HeroSection />

        {/* Phase 2 — Plan 02 */}
        <PortfolioSection />

        {/* Phase 2 — Plan 03 */}
        <ExpertiseSection />

        {/* Phase 2 — Plan 04 */}
        <SocialProofSection />

        {/* Phase 3 — Plan 01: Configurateur produit SVG */}
        <ConfiguratorSection />

        {/* Phase 3 placeholder — navigation ID must be present */}
        <div id="contact" className="min-h-screen bg-brand-black" />
      </main>
    </ConfiguratorProvider>
  )
}
