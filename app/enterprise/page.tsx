import type { Metadata } from "next"
import Link from "next/link"
import { Boxes, LineChart, Handshake, Plug, Truck, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Enterprise Solutions | SmartFarmin",
  description:
    "Source, trace and finance agricultural supply chains with SmartFarmin's enterprise platform for agri-businesses and FPOs.",
}

const capabilities = [
  {
    icon: Boxes,
    title: "Bulk sourcing",
    desc: "Aggregate quality produce from verified farmer networks with contract-farming tools.",
  },
  {
    icon: Truck,
    title: "Supply-chain traceability",
    desc: "Track every lot from farm to warehouse with quality grades and provenance records.",
  },
  {
    icon: Plug,
    title: "API & ERP integration",
    desc: "Connect SmartFarmin data to your existing ERP, CRM and procurement systems.",
  },
  {
    icon: LineChart,
    title: "Demand forecasting",
    desc: "AI-driven yield and price forecasts to plan procurement and lock in margins.",
  },
  {
    icon: Handshake,
    title: "Embedded finance",
    desc: "Offer input credit and invoice financing to your grower network at the point of trade.",
  },
  {
    icon: ShieldCheck,
    title: "Quality assurance",
    desc: "Standardized grading and drone-backed field audits for consistent supply quality.",
  },
]

export default function EnterprisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Enterprise"
          title="The operating system for agri-supply chains"
          description="Agri-businesses, exporters and FPOs use SmartFarmin to source reliably, trace quality and finance growers — all from one platform."
        >
          <Button render={<Link href="/contact" />} nativeButton={false}>
            Talk to sales
          </Button>
          <Button render={<Link href="/pricing" />} nativeButton={false} variant="outline">
            View pricing
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance font-serif text-3xl font-semibold text-foreground">
              From field to enterprise, connected
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Everything you need to run a modern, transparent and resilient agricultural business.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-2xl font-semibold text-foreground">
                Ready to build a more resilient supply chain?
              </h2>
              <p className="mt-2 text-pretty text-muted-foreground">
                Let&apos;s design a solution tailored to your crops, regions and volumes.
              </p>
            </div>
            <Button render={<Link href="/contact" />} nativeButton={false} size="lg">
              Book a demo
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
