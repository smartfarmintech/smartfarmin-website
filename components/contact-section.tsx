"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"

const contactChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@smartfarmin.com",
    link: "mailto:support@smartfarmin.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak to our team",
    contact: "+91 (040) 4741-0000",
    link: "tel:+910404741000",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Hyderabad, India",
    contact: "SmartFarmin HQ",
    link: "#",
  },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1000)
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Our team is here to help you succeed with AgreeConnect.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                  placeholder="Your message..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 gap-2"
              >
                <Send size={18} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactChannels.map((channel, index) => {
              const Icon = channel.icon
              return (
                <motion.a
                  key={index}
                  href={channel.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon size={24} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {channel.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {channel.description}
                      </p>
                      <p className="font-medium text-primary group-hover:underline">
                        {channel.contact}
                      </p>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
