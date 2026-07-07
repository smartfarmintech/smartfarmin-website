"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    q: "Is SmartFarmin free for farmers?",
    a: "Yes! SmartFarmin is completely free for individual farmers. We offer a freemium model with optional premium features.",
  },
  {
    q: "How do I get started?",
    a: "Download the app from your phone's app store, sign up with your details, and you can start using all features immediately.",
  },
  {
    q: "Do I need internet to use the app?",
    a: "No, SmartFarmin works fully offline. All data syncs automatically when you get back online.",
  },
  {
    q: "What languages is the app available in?",
    a: "We support 12 Indian regional languages including Hindi, Tamil, Telugu, Kannada, Marathi, Gujarati, and more.",
  },
  {
    q: "How accurate is the AI advisory?",
    a: "Our AI has been trained on 10+ years of farm data and gives 85%+ accurate recommendations for crop health.",
  },
  {
    q: "Can I sell on the marketplace without a minimum quantity?",
    a: "Yes! You can list any quantity of produce. We have buyers looking for everything from small lots to bulk orders.",
  },
]

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about SmartFarmin
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-border/70 bg-card transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-muted/50 rounded-2xl transition-colors"
              >
                <h3 className="font-semibold text-foreground text-lg pr-4">{faq.q}</h3>
                <ChevronDown
                  className={`size-5 shrink-0 text-primary transition-transform duration-300 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="border-t border-border/50 px-6 py-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
