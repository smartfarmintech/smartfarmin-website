import type { Metadata } from "next"
import { HandCoins, Truck, ShieldCheck, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { MarketplaceListings } from "@/components/marketplace-listings"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Marketplace — Buy & Sell Farm Produce | SmartFarmin",
  description:
    "Sell your harvest directly to verified buyers at fair prices and source seeds, inputs and equipment on the SmartFarmin Marketplace.",
}

const benefits = [
  {
    icon: HandCoins,
    title: "Fair prices",
    desc: "Sell directly to buyers and skip the middlemen who erode your margins.",
  },
  {
    icon: ShieldCheck,
    title: "Verified partners",
    desc: "Trade with confidence thanks to KYC-verified buyers and sellers.",
  },
  {
    icon: Truck,
    title: "Logistics built in",
    desc: "Book transport and track deliveries without leaving the platform.",
  },
  {
    icon: Users,
    title: "FPO friendly",
    desc: "Tools for farmer producer organisations to aggregate and sell at scale.",
  },
]

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Marketplace"
          title="Buy and sell farm produce, the fair way"
          description="A trusted, transparent marketplace connecting farmers directly with buyers, and giving them easy access to quality seeds, inputs and equipment."
        >
          <Button size="lg">Start selling</Button>
          <Button size="lg" variant="outline">
            Browse listings
          </Button>
        </PageHero>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
            <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <div key={i} className="animate-pulse rounded-lg bg-muted h-64" />)}</div>}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Browse All Products</h2>
            <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(12)].map((_, i) => <div key={i} className="animate-pulse rounded-lg bg-muted h-64" />)}</div>}>
              <AllProducts />
            </Suspense>
          </div>
        </section>

        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-12">Why trust SmartFarmin?</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="size-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
