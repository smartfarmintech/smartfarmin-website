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
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-3 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  )
}
