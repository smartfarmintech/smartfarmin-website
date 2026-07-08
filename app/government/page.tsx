import type { Metadata } from "next"
import Link from "next/link"
import { Landmark, ShieldCheck, BarChart3, Users, Wheat, MapPinned } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Government Solutions | SmartFarmin",
  description:
    "Digital public infrastructure for agriculture — scheme delivery, crop monitoring and farmer welfare at state scale.",
}

const capabilities = [
  {
    icon: Landmark,
    title: "Scheme delivery",
    desc: "Route subsidies, credit and welfare benefits directly to verified farmers with full audit trails.",
  },
  {
    icon: MapPinned,
    title: "Crop & land monitoring",
    desc: "Satellite-backed acreage estimation and crop-health maps across every district in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Damage & claim assessment",
    desc: "Rapid, evidence-based crop damage assessment for faster, fairer insurance payouts.",
  },
  {
    icon: BarChart3,
    title: "Policy analytics",
    desc: "Dashboards on yields, prices and input usage to guide procurement and MSP decisions.",
  },
  {
    icon: Users,
    title: "Farmer registries",
    desc: "Unified, deduplicated farmer databases linked to land records and bank accounts.",
  },
  {
    icon: Wheat,
    title: "Procurement support",
    desc: "Transparent mandi and procurement workflows that reduce leakage and delays.",
  },
]

const stats = [
  { value: "12", label: "State partnerships" },
  { value: "4.2M", label: "Farmers onboarded" },
  { value: "₹1,800Cr", label: "Benefits disbursed" },
]

export default function GovernmentPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Government"
          title="Digital public infrastructure for agriculture"
          description="SmartFarmin partners with state and central agencies to deliver schemes, monitor crops and improve farmer welfare — transparently and at scale."
        >
          <Button render={<Link href="/contact" />} nativeButton={false}>
            Request a briefing
          </Button>
          <Button render={<Link href="/enterprise" />} nativeButton={false} variant="outline">
            Enterprise solutions
          </Button>
        </PageHero>

        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-serif text-4xl font-semibold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance font-serif text-3xl font-semibold text-foreground">
              Built for governance at population scale
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Interoperable, secure and designed to plug into existing state systems and India Stack rails.
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
      </main>
      <SiteFooter />
    </>
  )
}
