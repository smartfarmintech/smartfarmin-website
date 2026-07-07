import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { TrustSection } from "@/components/trust-section"
import { ServicesSection } from "@/components/services-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TrustedBySection } from "@/components/trusted-by-section"
import { StatsSection } from "@/components/stats-section"
import { SolutionsSection } from "@/components/solutions-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { MachineryBookingSection } from "@/components/machinery-booking-section"
import { AiCropDoctorSection } from "@/components/ai-crop-doctor-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { EnterpriseSolutionsSection } from "@/components/enterprise-solutions-section"
import { MobileAppSection } from "@/components/mobile-app-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PartnersSection } from "@/components/partners-section"
import { FaqSection } from "@/components/faq-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="space-y-0 overflow-hidden">
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <BenefitsSection />
        <TrustedBySection />
        <StatsSection />
        <SolutionsSection />
        <WhyChooseSection />
        <MachineryBookingSection />
        <AiCropDoctorSection />
        <MarketplaceSection />
        <EnterpriseSolutionsSection />
        <MobileAppSection />
        <TestimonialsSection />
        <PartnersSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
