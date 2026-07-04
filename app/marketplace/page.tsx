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

        <section className="border-b border-border bg-card py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <MarketplaceListings />
      </main>
      <SiteFooter />
    </div>
  )
}
