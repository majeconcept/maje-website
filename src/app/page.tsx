import { HeroSection } from "@/components/sections/HeroSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { ExpertiseSection } from "@/components/sections/ExpertiseSection"
import { SocialProofSection } from "@/components/sections/SocialProofSection"
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"
import { ConfiguratorProvider } from "@/lib/configuratorContext"

export default function Home() {
  return (
    <ConfiguratorProvider>
      <main>
        {/* Phase 2 */}
        <HeroSection />
        <PortfolioSection />
        <ExpertiseSection />
        <SocialProofSection />

        {/* Phase 3 */}
        <ConfiguratorSection />
        <ContactSection />
        <Footer />
      </main>
    </ConfiguratorProvider>
  )
}
