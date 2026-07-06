"use client"

import { Users, Award, MapPin, TrendingUp } from "lucide-react"

interface TrustedByMetric {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

const metrics: TrustedByMetric[] = [
  { 
    icon: <Users className="size-6" />, 
    value: "250K+", 
    label: "Active Farmers", 
    description: "Growing community of successful farmers"
  },
  { 
    icon: <Award className="size-6" />, 
    value: "4.9★", 
    label: "Average Rating", 
    description: "Trusted by farmers across regions"
  },
  { 
    icon: <MapPin className="size-6" />, 
    value: "18+", 
    label: "States Covered", 
    description: "Operating across major agricultural zones"
  },
  { 
    icon: <TrendingUp className="size-6" />, 
    value: "35%", 
    label: "Avg Yield Growth", 
    description: "Verified improvement in farmer productivity"
  },
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Sugarcane Farmer",
    location: "Karnataka",
    quote: "SmartFarmin's AI insights helped me increase my yield by 35% and save on pesticides",
    avatar: "🌾",
  },
  {
    name: "Priya Sharma",
    role: "Wheat & Cotton Farmer",
    location: "Punjab",
    quote: "The machinery rental service saved me ₹50,000 per season. No more expensive equipment!",
    avatar: "🌱",
  },
  {
    name: "Vikram Patel",
    role: "Vegetable Farmer",
    location: "Maharashtra",
    quote: "Fair marketplace prices mean I keep more profit. Worth every rupee invested",
    avatar: "🥬",
  },
]

export function TrustedBySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/30 to-background py-20 sm:py-32 dark:via-black/30">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Trusted by Farmers Across India
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join 250K+ farmers who are growing their income with smarter decisions and better tools
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-white/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/10 group-hover:to-accent/10 group-hover:opacity-100" />

              <div className="relative space-y-3">
                <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
                  {metric.icon}
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                    {metric.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="mb-8 text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
            What Farmers Are Saying
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/40 bg-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/70 dark:border-white/10 dark:bg-black/30 dark:hover:border-white/20 dark:hover:bg-black/50 hover:-translate-y-1"
              >
                {/* Corner accent */}
                <div className="absolute -right-1 -top-1 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative space-y-4">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg text-accent">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base leading-relaxed text-foreground">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-white/20 pt-4 dark:border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="rounded-2xl border border-white/40 bg-gradient-to-r from-white/50 via-white/40 to-white/50 p-8 backdrop-blur-xl dark:from-black/30 dark:via-black/40 dark:to-black/30">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">99.9%</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Uptime Guarantee</p>
            </div>
            <div className="text-center border-t border-white/20 pt-6 sm:border-l sm:border-t-0 sm:pl-8 dark:border-white/10">
              <p className="text-2xl font-bold text-primary sm:text-3xl">24/7</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Farmer Support</p>
            </div>
            <div className="text-center border-t border-white/20 pt-6 sm:border-l sm:border-t-0 sm:pl-8 dark:border-white/10">
              <p className="text-2xl font-bold text-primary sm:text-3xl">₹0</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Setup Fee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
