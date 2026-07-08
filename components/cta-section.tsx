import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ready to grow smarter this season?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Join thousands of farmers, enterprises and institutions building the
            future of Indian agriculture with SmartFarmin.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2">
              Get started free
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact sales
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Available in 12 languages.
          </p>
        </div>
      </div>
    </section>
  )
}
