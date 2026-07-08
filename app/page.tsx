import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { SolutionsSection } from "@/components/solutions-section"
import { SegmentsSection } from "@/components/segments-section"
import { CtaSection } from "@/components/cta-section"
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
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
