import { HeroSection } from "@/components/sections/HeroSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { ExpertiseSection } from "@/components/sections/ExpertiseSection"
import { SocialProofSection } from "@/components/sections/SocialProofSection"

export default function Home() {
  return (
    <main>
      {/* Phase 2 — Plan 01 */}
      <HeroSection />

      {/* Phase 2 — Plan 02 */}
      <PortfolioSection />

      {/* Phase 2 — Plan 03 */}
      <ExpertiseSection />

      {/* Phase 2 — Plan 04 */}
      <SocialProofSection />

      {/* Phase 3 placeholders — navigation IDs must be present */}
      <div id="configurateur" className="min-h-screen bg-brand-black" />
      <div id="contact" className="min-h-screen bg-brand-black" />
    </main>
  )
}
