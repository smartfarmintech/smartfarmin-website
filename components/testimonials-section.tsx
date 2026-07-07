const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Sugarcane Farmer",
    location: "Karnataka",
    quote: "SmartFarmin's AI advisor helped me increase yield by 35% and saved ₹50,000 this season. Best investment ever!",
    avatar: "🌾",
  },
  {
    name: "Priya Singh",
    role: "Wheat Farmer",
    location: "Punjab",
    quote: "The machinery rental service is game-changing. I no longer need to buy expensive equipment. Saving ₹25,000 per season!",
    avatar: "🌱",
  },
  {
    name: "Vikram Patel",
    role: "Vegetable Farmer",
    location: "Maharashtra",
    quote: "Fair marketplace prices mean I keep more profit. No middlemen taking my money. The transparency is incredible.",
    avatar: "🥬",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Success Stories from Real Farmers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Hear from farmers who have transformed their agriculture with SmartFarmin
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-card dark:hover:border-white/20 dark:hover:bg-black/50"
            >
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
                <blockquote className="text-base leading-relaxed text-foreground font-medium">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/20 pt-4 dark:border-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
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
    </section>
  )
}
