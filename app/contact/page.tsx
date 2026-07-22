import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact | Akanksha AgreeTech",
  description:
    "Get in touch with the Akanksha AgreeTech team for farmer support, enterprise, government or press inquiries.",
}

const channels = [
  { icon: Mail, label: "Email", value: "hello@smartfarmin.in" },
  { icon: Phone, label: "Farmer helpline", value: "1800-120-3600" },
  { icon: MapPin, label: "Head office", value: "HITEC City, Hyderabad, Telangana" },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Let's talk"
          description="Whether you're a farmer, a business or a government partner, our team is here to help you grow."
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Reach us directly
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Prefer to talk? Use any of the channels below and we&apos;ll route you to the
                right team.
              </p>
              <ul className="mt-8 space-y-6">
                {channels.map((c) => (
                  <li key={c.label} className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <c.icon className="size-5" />
                    </span>
                    <div>
                      <div className="text-sm text-muted-foreground">{c.label}</div>
                      <div className="font-medium text-foreground">{c.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
