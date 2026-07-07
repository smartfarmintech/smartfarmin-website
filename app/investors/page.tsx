import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Users, Globe2, FileText, DollarSign, Target, Award, Zap, ArrowRight, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/animations/premium-animations"
import { GlassCard, GlassGrid, GlassBadge, GlassPanel } from "@/components/glass/glass-components"

export const metadata: Metadata = {
  title: "Investors | Rythu360 - AgriTech Investment Opportunity | SmartFarmin",
  description:
    "Investment opportunity in Rythu360 - the leading AI-powered agricultural technology platform. Strong traction, experienced team, and massive market opportunity in India.",
  keywords: [
    'agritech investment',
    'agricultural technology investment',
    'startup investment opportunity',
    'India agricultural tech',
    'farming technology investor',
    'agritech fundraising',
    'venture capital agritech',
  ],
}

const metrics = [
  { icon: Users, value: "10,000+", label: "Active Farmers", trend: "+100% YoY" },
  { icon: TrendingUp, value: "₹96K+", label: "Monthly Revenue", trend: "+300% QoQ" },
  { icon: Globe2, value: "500+", label: "Villages", trend: "Nationwide" },
  { icon: FileText, value: "3,200+", label: "Transactions", trend: "Monthly" },
]

const financialHighlights = [
  { title: 'CAC Payback', value: '2.1 months', highlight: true },
  { title: 'LTV:CAC Ratio', value: '5.2:1', highlight: true },
  { title: 'Net Revenue Retention', value: '130%', highlight: false },
  { title: 'Gross Margin', value: '72%', highlight: false },
]

const investmentHighlights = [
  'AI-first platform for crop disease detection',
  '10,000+ active users with strong retention',
  'Profitable unit economics and path to profitability',
  'Diversified revenue streams across 5 channels',
  'Experienced founding team with 50+ years combined experience',
  'Operating in $30B+ addressable market',
  '500+ villages across India with expansion roadmap',
  'Enterprise customers and government partnerships',
]

export default function InvestorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="space-y-0">
        <PageHero
          eyebrow="Investment Opportunity"
          title="Backing the digital transformation of Indian agriculture"
          description="Rythu360 is building the operating system for digital agriculture. Trusted by 10,000+ farmers, backed by proven technology, and positioned in a $30B+ addressable market."
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button render={<Link href="/contact" />} nativeButton={false}>
              <span className="flex items-center gap-2">
                Schedule Meeting
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button variant="outline" render={<Link href="/contact" />} nativeButton={false}>
              Download Pitch Deck
            </Button>
          </div>
        </PageHero>

        {/* Key Metrics Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, idx) => (
              <ScrollAnimation key={m.label} delay={idx * 100}>
                <GlassCard variant={idx % 2 === 0 ? "glow-green" : "glow-gold"}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">{m.label}</span>
                      <m.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">{m.value}</div>
                    <div className="text-xs text-emerald-400 font-medium">{m.trend}</div>
                  </div>
                </GlassCard>
              </ScrollAnimation>
            ))}
          </div>

          {/* Financial Highlights */}
          <div className="mt-16 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white">Unit Economics</h2>
              <p className="mt-2 text-slate-400 max-w-2xl">Proven business model with strong fundamentals and path to profitability</p>
            </div>
            
            <GlassGrid columns={4}>
              {financialHighlights.map((item, idx) => (
                <ScrollAnimation key={item.title} delay={idx * 100}>
                  <GlassCard variant={item.highlight ? "glow-green" : "prominent"}>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">{item.title}</div>
                      <div className="text-3xl font-bold text-emerald-400">{item.value}</div>
                    </div>
                  </GlassCard>
                </ScrollAnimation>
              ))}
            </GlassGrid>
          </div>

          {/* Market Opportunity & Model */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-white">The Opportunity</h2>
              <p className="text-slate-300 leading-relaxed">
                Agriculture employs nearly 270M people in India yet remains one of the least digitized sectors. The $30B+ addressable market is experiencing rapid digital transformation with government support and farmer adoption accelerating rapidly.
              </p>
              <ul className="space-y-2">
                {['160M hectares of farmland', '15% digital adoption vs 50% in other sectors', '25% YoY AgriTech spending growth'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-white">Our Model</h2>
              <p className="text-slate-300 leading-relaxed">
                Diversified revenue streams across machinery booking, drone services, marketplace, enterprise solutions, and AI advisory. Each layer reinforces network effects and customer stickiness.
              </p>
              <ul className="space-y-2">
                {['Multi-stakeholder platform', 'Embedded financial services', 'Enterprise contracts', 'Subscription base'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Why Invest */}
          <div className="mt-16 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white">Why Invest in Rythu360</h2>
              <p className="mt-2 text-slate-400">Unique positioning at the intersection of agriculture, technology, and financial services</p>
            </div>

            <GlassGrid columns={2}>
              {investmentHighlights.map((highlight, idx) => (
                <ScrollAnimation key={idx} delay={idx * 80}>
                  <GlassCard variant="prominent" className="h-full">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center mt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-slate-300">{highlight}</p>
                    </div>
                  </GlassCard>
                </ScrollAnimation>
              ))}
            </GlassGrid>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <GlassPanel>
              <div className="flex items-center justify-between gap-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-white mb-2">Ready to explore this opportunity?</h2>
                  <p className="text-slate-300">Schedule a call with our founding team to discuss investment details</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Button render={<Link href="/contact" />} nativeButton={false}>
                    Schedule Call
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
