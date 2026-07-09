import { SiteHeader } from "@/components/site-header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CinematicHero } from "@/components/cinematic-hero"
import { ChallengeMission } from "@/components/challenge-mission"
import { VisionEcosystem } from "@/components/vision-ecosystem"
import { HowItWorksDashboard } from "@/components/how-it-works-dashboard"
import { FarmSnapshot } from "@/components/farm-snapshot"
import { FarmingLifecycle } from "@/components/farming-lifecycle"
import { TechnologyEcosystem } from "@/components/technology-ecosystem"
import { ProductsSection } from "@/components/products-section"
import { SegmentsSection } from "@/components/segments-section"
import { WhyChooseTimeline } from "@/components/why-choose-timeline"
import { TestimonialsImpact } from "@/components/testimonials-impact"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ImpactSection } from "@/components/impact-section"
import { MobilePartners } from "@/components/mobile-partners"
import { FinalCTAFooter } from "@/components/final-cta-footer"
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
        <CinematicHero />

        {/* CHALLENGE & MISSION */}
        <ChallengeMission />

        {/* VISION & ECOSYSTEM */}
        <VisionEcosystem />

        {/* HOW IT WORKS & DASHBOARDS */}
        <HowItWorksDashboard />

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

        {/* TESTIMONIALS & IMPACT */}
        <TestimonialsImpact />

        {/* Farmer Success Stories */}
        <TestimonialsSection />

        {/* Impact Dashboard */}
        <ImpactSection />

        {/* MOBILE APP & PARTNERS */}
        <MobilePartners />

        {/* Mobile Experience */}
        <MobileAppSection />

        {/* Investor Section & Careers */}
        <SegmentsSection />

        {/* Download App */}
        <DownloadAppSection />

        {/* FINAL CTA & PREMIUM FOOTER */}
        <FinalCTAFooter />
      </main>
    </div>
  )
}
