import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Users, Globe2, FileText } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Investors | Akanksha AgreeTech",
  description:
    "Investing in the digital backbone of Indian agriculture. Explore Akanksha AgreeTech's traction, mission and opportunity.",
}

const metrics = [
  { icon: Users, value: "6.5M+", label: "Farmers on platform" },
  { icon: TrendingUp, value: "3.4x", label: "YoY GMV growth" },
  { icon: Globe2, value: "12", label: "States operating" },
  { icon: FileText, value: "₹1,800Cr", label: "Benefits enabled" },
]

export default function InvestorsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Investors"
          title="Backing the future of agriculture"
          description="We're building the digital backbone for the world's most important industry. Here's why long-term investors are partnering with Akanksha AgreeTech."
        >
          <Button render={<Link href="/contact" />} nativeButton={false}>
            Request investor deck
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <m.icon className="size-5" />
                </span>
                <div className="mt-4 font-serif text-3xl font-semibold text-foreground">
                  {m.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">The opportunity</h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Agriculture employs nearly half of India&apos;s workforce yet remains one of the
                least digitized sectors. Akanksha AgreeTech sits at the intersection of data, financial
                services and commerce — a durable, compounding position across the entire value
                chain.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Our model</h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                We monetize through subscriptions, marketplace take-rates, embedded finance and
                enterprise contracts — a diversified revenue base that grows with every farmer,
                trade and acre we serve.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
