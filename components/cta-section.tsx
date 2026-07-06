import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section id="cta" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 sm:py-32">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse duration-7000" />
        <div className="absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse duration-5000 delay-1000" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/40 bg-white/60 px-8 py-16 text-center backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:px-12 sm:py-20 lg:px-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm mb-6">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Join the Agricultural Revolution</span>
          </div>

          {/* Heading */}
          <h2 className="mx-auto max-w-3xl text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ready to grow smarter this season?
          </h2>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Join 250K+ farmers and enterprises building the future of Indian agriculture with SmartFarmin
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center items-center">
            <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
              Get Started Free
              <ArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-primary/20 hover:bg-primary/5">
              Schedule Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-muted-foreground font-medium">
            ✓ No credit card required • ✓ Available in 12 languages • ✓ Free forever plan available
          </p>
        </div>
      </div>
    </section>
  )
}
