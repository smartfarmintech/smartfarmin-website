import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Pricing | SmartFarmin",
  description:
    "Simple, transparent pricing for farmers, agri-businesses and institutions. Start free and scale as you grow.",
}

const tiers = [
  {
    name: "Rythu Free",
    price: "₹0",
    period: "/forever",
    tagline: "For individual farmers getting started.",
    features: [
      "AgreeConnect super-app access",
      "Weather & mandi price alerts",
      "Community crop advisory",
      "List up to 5 marketplace items",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Rythu Pro",
    price: "₹299",
    period: "/month",
    tagline: "For serious growers who want an edge.",
    features: [
      "Everything in Rythu Free",
      "Akanksha AI crop advisory",
      "Unlimited marketplace listings",
      "Priority drone service booking",
      "Soil & satellite health reports",
    ],
    cta: "Start 30-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For agri-businesses, FPOs & institutions.",
    features: [
      "Bulk sourcing & supply contracts",
      "API & ERP integrations",
      "Dedicated account manager",
      "Custom analytics dashboards",
      "SLA-backed drone fleets",
    ],
    cta: "Talk to sales",
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Pricing"
          title="Pricing that grows with your harvest"
          description="Start free, upgrade when you're ready, and only pay for what moves the needle on your farm or business."
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-primary bg-card shadow-lg ring-1 ring-primary"
                    : "border-border bg-card"
                }`}
              >
                {tier.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {tier.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{tier.tagline}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-semibold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  render={<Link href="/contact" />}
                  nativeButton={false}
                  className="mt-8 w-full"
                  variant={tier.featured ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
