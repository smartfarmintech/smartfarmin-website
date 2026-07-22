"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqCategories = [
  {
    title: "For Farmers",
    items: [
      {
        q: "How do I book machinery on AgreeConnect?",
        a: "Download the app, sign up with your phone number, choose the machinery or service you need, select a date, and confirm the booking. Payment is made securely through the app.",
      },
      {
        q: "What is the cost per booking?",
        a: "Costs vary by machinery type and region. You can see all pricing in the app before booking. We offer competitive rates compared to traditional channels.",
      },
      {
        q: "How does the AI crop advisory work?",
        a: "Our AI analyzes your soil, weather, crop history, and market data to provide personalized recommendations on planting, irrigation, fertilization, and pest management.",
      },
    ],
  },
  {
    title: "For Machinery Owners",
    items: [
      {
        q: "How do I register my machinery?",
        a: "Sign up on the platform, add your machinery details, set your availability and pricing. Our team verifies your information and you're ready to receive bookings.",
      },
      {
        q: "How do I get paid?",
        a: "Payments are processed instantly after service completion. You can withdraw to your bank account anytime with zero processing fees.",
      },
      {
        q: "What support do you provide?",
        a: "We provide dedicated operator support, training, real-time booking notifications, and a community forum to connect with other operators.",
      },
    ],
  },
  {
    title: "Bookings & Payments",
    items: [
      {
        q: "Can I cancel a booking?",
        a: "Yes, you can cancel up to 24 hours before the scheduled service time and receive a full refund.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods including UPI, credit/debit cards, net banking, and wallet services.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes, all payments are encrypted and processed through secure gateways. Your financial information is never stored on our servers.",
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-border/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-card/50 hover:bg-card/70 transition-colors"
      >
        <span className="text-left font-medium text-foreground">{q}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 bg-muted/30 text-muted-foreground border-t border-border/50">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about AgreeConnect
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {faqCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === index
                  ? "bg-primary text-white"
                  : "bg-card/50 text-muted-foreground hover:bg-card"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {faqCategories[activeTab].items.map((item, index) => (
            <FAQItem key={index} q={item.q} a={item.a} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
