import { SiteHeader } from "@/components/site-header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HeroSection } from "@/components/hero-section"
import { LiveCounters } from "@/components/live-counters"
import { AnimatedEcosystem } from "@/components/animated-ecosystem"
import { RealityOfAgriculture } from "@/components/reality-of-agriculture"
import { InteractivePoll } from "@/components/interactive-poll"
import { CompanyQuotes } from "@/components/company-quotes"
import { PremiumFeaturesSection } from "@/components/premium-features-section"
import { PremiumServices } from "@/components/premium-services"
import { FarmerServices } from "@/components/farmer-services"
import { NearbyServicesSection } from "@/components/nearby-services-section"
import { TempleInformation } from "@/components/temple-information"
import { AICropDoctorShowcase } from "@/components/ai-crop-doctor-section"
import { GovernmentSchemesSection } from "@/components/government-schemes-section"
import { EnterpriseModulesSection } from "@/components/enterprise-modules-section"
import { PremiumCTASection } from "@/components/premium-cta-section"
import { FarmSnapshot } from "@/components/farm-snapshot"
import { FarmingLifecycle } from "@/components/farming-lifecycle"
import { ProductsSection } from "@/components/products-section"
import { SegmentsSection } from "@/components/segments-section"
import { FarmerSuccessStories } from "@/components/farmer-success-stories"
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

        {/* LIVE COUNTERS */}
        <LiveCounters />

        {/* ECOSYSTEM CIRCLE */}
        {/* <AnimatedEcosystem /> */}

        {/* REALITY OF AGRICULTURE */}
        <RealityOfAgriculture />

        {/* INTERACTIVE POLL */}
        <InteractivePoll />

        {/* COMPANY QUOTES */}
        <CompanyQuotes />

        {/* PREMIUM FEATURES */}
        <PremiumFeaturesSection />

        {/* COMPREHENSIVE FARMER SERVICES (48+) */}
        <FarmerServices />

        {/* PREMIUM SERVICES */}
        <PremiumServices />

        {/* NEARBY SERVICES */}
        <NearbyServicesSection />

        {/* TEMPLE INFORMATION */}
        <TempleInformation />

        {/* AI CROP DOCTOR */}
        <AICropDoctorShowcase />

        {/* GOVERNMENT SCHEMES */}
        <GovernmentSchemesSection />

        {/* ENTERPRISE MODULES */}
        <EnterpriseModulesSection />

        {/* PREMIUM CTA */}
        <PremiumCTASection />

        {/* Today's Farm Snapshot */}
        <FarmSnapshot />

        {/* Interactive Farming Lifecycle */}
        <FarmingLifecycle />

        {/* Explore the AgreeConnect Ecosystem */}
        <ProductsSection />

        {/* For Every Stakeholder */}
        <SegmentsSection />

        {/* Farmer Success Stories */}
        <FarmerSuccessStories />
        
        {/* Testimonials */}
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
