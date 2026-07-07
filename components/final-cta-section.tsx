import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse duration-7000" />
        <div className="absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse duration-5000 delay-1000" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-card px-8 py-16 text-center sm:px-12 sm:py-24 lg:px-16">
          <h2 className="mx-auto max-w-3xl text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Join the Agricultural Revolution Today
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Don&apos;t wait for next season. Start using SmartFarmin today and see the difference in your harvest
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center items-center">
            <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold">
              Download App Now
              <ArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-primary/20 hover:bg-primary/5">
              Learn More
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground font-medium">
            ✓ 25 MB • ✓ Works offline • ✓ 12 languages • ✓ Free forever plan
          </p>
        </div>
      </div>
    </section>
  )
}
