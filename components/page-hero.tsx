import type { ReactNode } from "react"

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-sm">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/5 to-transparent blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {eyebrow}
          </span>
          <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            {title}
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-slate-300 max-w-2xl">
            {description}
          </p>
          {children && <div className="pt-2 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  )
}
