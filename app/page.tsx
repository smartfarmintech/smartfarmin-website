import { SiteHeader } from "@/components/site-header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HeroSection } from "@/components/hero-section"
import { PremiumFeaturesSection } from "@/components/premium-features-section"
import { AICropDoctorShowcase } from "@/components/ai-crop-doctor-section"
import { FarmSnapshot } from "@/components/farm-snapshot"
import { FarmingLifecycle } from "@/components/farming-lifecycle"
import { ProductsSection } from "@/components/products-section"
import { SegmentsSection } from "@/components/segments-section"
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
        <HeroSection />

        {/* PREMIUM FEATURES */}
        <PremiumFeaturesSection />

        {/* AI CROP DOCTOR */}
        <AICropDoctorShowcase />

        {/* Today's Farm Snapshot */}
        <FarmSnapshot />

        {/* Interactive Farming Lifecycle */}
        <FarmingLifecycle />

        {/* Explore the Rythu360 Ecosystem */}
        <ProductsSection />

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
