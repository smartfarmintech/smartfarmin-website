import { SiteHeader } from "@/components/site-header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HeroSection } from "@/components/hero-section"
import { AgricultureStorySection } from "@/components/agriculture-story-section"
import { EcosystemSection } from "@/components/ecosystem-section"
import { AICropDoctorSection } from "@/components/platform-sections/ai-crop-doctor-section"
import { DroneIntelligenceSection } from "@/components/platform-sections/drone-intelligence-section"
import { MarketplaceSection } from "@/components/platform-sections/marketplace-section"
import { WeatherIntelligenceSection } from "@/components/platform-sections/weather-intelligence-section"
import { JourneyTimelineSection } from "@/components/journey-timeline-section"
import { LivePlatformSection } from "@/components/live-platform-section"
import { TechnologySection } from "@/components/technology-section"
import { FutureRoadmapSection } from "@/components/future-roadmap-section"
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

        {/* Agriculture Story */}
        <AgricultureStorySection />

        {/* Interactive Ecosystem */}
        <EcosystemSection />

        {/* AI Crop Doctor */}
        <AICropDoctorSection />

        {/* Drone Intelligence */}
        <DroneIntelligenceSection />

        {/* Farm Marketplace */}
        <MarketplaceSection />

        {/* Weather Intelligence */}
        <WeatherIntelligenceSection />

        {/* Farmer Journey Timeline */}
        <JourneyTimelineSection />

        {/* Live Platform Dashboards */}
        <LivePlatformSection />

        {/* Technology Stack */}
        <TechnologySection />

        {/* Future Roadmap */}
        <FutureRoadmapSection />

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
