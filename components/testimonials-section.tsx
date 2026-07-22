"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "AgreeConnect has transformed how I manage my farm. The AI recommendations save me thousands every season.",
    author: "Ramesh Yadav",
    role: "Farmer, Andhra Pradesh",
    rating: 5,
  },
  {
    quote: "Booking machinery has never been easier. The platform connects me with farmers who need my services instantly.",
    author: "Suresh Kumar",
    role: "Machinery Owner, Karnataka",
    rating: 5,
  },
  {
    quote: "As a drone operator, AgreeConnect opened new income opportunities. The booking system is seamless and payments are instant.",
    author: "Priya Singh",
    role: "Drone Operator, Punjab",
    rating: 5,
  },
  {
    quote: "The weather intelligence and crop advisory features are incredibly accurate. Saved my entire harvest from pest attack.",
    author: "Arjun Patel",
    role: "Farmer, Gujarat",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Loved by Farmers
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Trusted by thousands across India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real farmers, real results. See how AgreeConnect is transforming agriculture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:bg-card/80 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
