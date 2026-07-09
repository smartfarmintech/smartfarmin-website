import { SiteHeader } from "@/components/site-header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { PremiumHero } from "@/components/premium-hero"
import { FarmSnapshot } from "@/components/farm-snapshot"
import { FarmingLifecycle } from "@/components/farming-lifecycle"
import { TechnologyEcosystem } from "@/components/technology-ecosystem"
import { ProductsSection } from "@/components/products-section"
import { SegmentsSection } from "@/components/segments-section"
import { WhyChooseTimeline } from "@/components/why-choose-timeline"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ImpactSection } from "@/components/impact-section"
import { MobileAppSection } from "@/components/mobile-app-section"
import { DownloadAppSection } from "@/components/download-app-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        {/* HERO EXPERIENCE */}
        <PremiumHero />

        {/* Today's Farm Snapshot */}
        <FarmSnapshot />

        {/* Interactive Farming Lifecycle */}
        <FarmingLifecycle />

        {/* Technology Ecosystem */}
        <TechnologyEcosystem />

        {/* Explore the Rythu360 Ecosystem */}
        <ProductsSection />

        {/* Why Choose Rythu360 Timeline */}
        <WhyChooseTimeline />

        {/* For Every Stakeholder */}
        <SegmentsSection />

        {/* Farmer Success Stories */}
        <TestimonialsSection />

        {/* Impact Dashboard */}
        <ImpactSection />

        {/* Mobile Experience */}
        <MobileAppSection />

        {/* Investor Section & Careers */}
        <SegmentsSection />

        {/* Download App */}
        <DownloadAppSection />
      </main>
      <SiteFooter />
    </div>
  )
}
