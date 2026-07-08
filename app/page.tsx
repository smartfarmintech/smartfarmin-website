import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { SolutionsSection } from "@/components/solutions-section"
import { SegmentsSection } from "@/components/segments-section"
import { CtaSection } from "@/components/cta-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ImpactSection } from "@/components/impact-section"
import { MobileAppSection } from "@/components/mobile-app-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <SolutionsSection />
        <ProductsSection />
        <SegmentsSection />
        <TestimonialsSection />
        <ImpactSection />
        <MobileAppSection />
        <FAQSection />
        <ContactSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
