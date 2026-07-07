import type { Metadata } from "next"
import Link from "next/link"
import { Landmark, ShieldCheck, BarChart3, Users, Wheat, MapPinned, Shield, Award, CheckCircle2, Lock, Globe, Scale, BookOpen, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/animations/premium-animations"
import { GlassCard, GlassGrid, GlassBadge, GlassPanel } from "@/components/glass/glass-components"

export const metadata: Metadata = {
  title: "Government & Institutions | Rythu360 - Secure Agricultural Platform | SmartFarmin",
  description:
    "Trusted by government agencies and institutions. Rythu360 is built with government-grade security, compliance, and transparency for digital public infrastructure in agriculture.",
  keywords: [
    "government agriculture",
    "secure agricultural platform",
    "data privacy agriculture",
    "DPIIT recognized startup",
    "government digital agriculture",
    "institutional partnership",
  ],
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
      <main className="space-y-0">
        <PageHero
          eyebrow="Government & Institutions"
          title="Digital public infrastructure for agriculture"
          description="SmartFarmin partners with government agencies to deliver schemes, monitor crops and improve farmer welfare — built with government-grade security and transparency."
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button render={<Link href="/contact" />} nativeButton={false}>
              <span className="flex items-center gap-2">
                Schedule Demo
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button render={<Link href="/enterprise" />} nativeButton={false} variant="outline">
              Enterprise solutions
            </Button>
          </div>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-background">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, idx) => (
              <ScrollAnimation key={stat.label} delay={idx * 100}>
                <GlassCard variant={idx % 2 === 0 ? "glow-green" : "glow-gold"}>
                  <div className="text-center space-y-2">
                    <div className="font-serif text-4xl font-semibold text-emerald-400">{stat.value}</div>
                    <div className="text-sm text-slate-300">{stat.label}</div>
                  </div>
                </GlassCard>
              </ScrollAnimation>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="space-y-12">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-3xl font-semibold text-white">
                Built for governance at population scale
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-slate-300">
                Interoperable, secure and designed to plug into existing state systems and India Stack rails with government-grade compliance.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, idx) => (
                <ScrollAnimation key={item.title} delay={idx * 80}>
                  <GlassCard variant="prominent" className="h-full">
                    <div className="space-y-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <item.icon className="size-5" />
                      </span>
                      <h3 className="font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-300">{item.desc}</p>
                    </div>
                  </GlassCard>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Certifications */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-background to-slate-900/50">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl font-bold text-white">Security & Certifications</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Enterprise-grade security with government compliance and institutional certifications
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  category: "Government Recognition",
                  items: ["DPIIT Recognized Startup", "Startup India Approved", "Ministry of Agriculture Partner"],
                },
                {
                  category: "Security & Compliance",
                  items: ["ISO 27001 Certified", "ISO 9001 Certified", "GDPR Compliant", "Data Protection Act"],
                },
                {
                  category: "Data Protection",
                  items: ["AES-256 Encryption", "On-Shore Data Storage", "Zero Personal Data Collection", "Regular Audits"],
                },
              ].map((cert) => (
                <div key={cert.category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Certificate className="w-5 h-5 text-emerald-400" />
                    {cert.category}
                  </h3>
                  <div className="space-y-2">
                    {cert.items.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Privacy */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <GlassPanel>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-8 h-8 text-emerald-400" />
                  Data Privacy & Security
                </h2>
                <p className="text-slate-300">Your agricultural data is protected with enterprise-grade security measures meeting all government standards</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Encryption", description: "AES-256 encryption for all data in transit and at rest" },
                  { title: "Access Control", description: "Role-based access control with multi-factor authentication" },
                  { title: "Compliance", description: "Full compliance with GDPR and government data regulations" },
                  { title: "Auditing", description: "Complete audit trails of all data access and modifications" },
                  { title: "Reliability", description: "99.9% uptime SLA with redundant backup systems" },
                  { title: "Support", description: "24/7 security monitoring and incident response" },
                ].map((item) => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <GlassPanel>
            <div className="text-center space-y-6">
              <h2 className="font-serif text-3xl font-bold text-white">Ready to partner?</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Contact our government relations team to discuss custom implementations for your department
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button render={<Link href="/contact" />} nativeButton={false}>
                  <span className="flex items-center gap-2">
                    Schedule Call
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
                  Learn More
                </Button>
              </div>
            </div>
          </GlassPanel>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
