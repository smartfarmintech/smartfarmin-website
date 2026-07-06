import Link from "next/link"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------- brand */

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Leaf className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Rythu<span className="text-primary">360</span>
      </span>
    </span>
  )
}

/* ------------------------------------------------------------- skeleton */

/** A single shimmering placeholder block. */
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />
}

/**
 * A full dashboard-shaped skeleton that mirrors the AppShell layout
 * (sidebar + topbar + stat cards + charts) so route transitions feel
 * instant and structured rather than blank.
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* sidebar */}
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-4 border-r border-border/70 bg-sidebar/60 px-3 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <SkeletonBlock className="size-9 rounded-2xl" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
          <SkeletonBlock className="h-14 w-full rounded-2xl" />
          <div className="mt-2 flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* topbar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <SkeletonBlock className="hidden h-10 w-72 rounded-full sm:block" />
            <div className="ml-auto flex items-center gap-2">
              <SkeletonBlock className="size-9 rounded-full" />
              <SkeletonBlock className="size-9 rounded-full" />
              <SkeletonBlock className="h-9 w-32 rounded-full" />
            </div>
          </header>

          {/* content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <SkeletonBlock className="h-8 w-56" />
              <SkeletonBlock className="mt-2 h-4 w-80" />

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-border/70 bg-card/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <SkeletonBlock className="size-9 rounded-2xl" />
                      <SkeletonBlock className="h-5 w-14 rounded-full" />
                    </div>
                    <SkeletonBlock className="mt-3 h-7 w-24" />
                    <SkeletonBlock className="mt-2 h-4 w-20" />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
                <div className="rounded-3xl border border-border/70 bg-card/50 p-5 lg:col-span-2">
                  <SkeletonBlock className="h-5 w-40" />
                  <SkeletonBlock className="mt-4 h-56 w-full rounded-2xl" />
                </div>
                <div className="rounded-3xl border border-border/70 bg-card/50 p-5">
                  <SkeletonBlock className="h-5 w-32" />
                  <div className="mt-4 flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonBlock key={i} className="h-12 w-full rounded-2xl" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- spinner */

/**
 * Centered branded splash used for lightweight route-level loading
 * (marketing pages, standalone screens).
 */
export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-primary/20" />
        <span className="relative flex size-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
          <Leaf className="size-7" />
        </span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
