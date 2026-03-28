import dynamic from "next/dynamic"
import { HeroSection } from "@/components/sections/HeroSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"
import { ConfiguratorProvider } from "@/lib/configuratorContext"

// Lazy-load heavy GSAP sections — HTML SSR preserved, JS bundle deferred
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection })),
  { ssr: true }
)

const ExpertiseSection = dynamic(
  () => import("@/components/sections/ExpertiseSection").then((m) => ({ default: m.ExpertiseSection })),
  { ssr: true }
)

const SocialProofSection = dynamic(
  () => import("@/components/sections/SocialProofSection").then((m) => ({ default: m.SocialProofSection })),
  { ssr: true }
)

const ConfiguratorSection = dynamic(
  () => import("@/components/sections/ConfiguratorSection").then((m) => ({ default: m.ConfiguratorSection })),
  { ssr: true }
)

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
