import { HeroSection } from "@/components/sections/HeroSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"

export default function Home() {
  return (
    <main>
      {/* Phase 2 Plan 01 */}
      <HeroSection />

      {/* Phase 2 Plan 02 */}
      <PortfolioSection />

      {/* Phase 2 Plan 03 — placeholder remplacé dans 02-03 */}
      <div id="expertises" className="min-h-screen bg-brand-black" />

      {/* Phase 3 — placeholders nav tracking */}
      <div id="configurateur" className="min-h-screen bg-brand-black" />
      <div id="contact" className="min-h-screen bg-brand-black" />
    </main>
  )
}
