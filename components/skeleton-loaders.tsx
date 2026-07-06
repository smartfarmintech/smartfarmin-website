"use client"

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <div className="size-5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="size-10 animate-pulse rounded bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-6 w-12 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-muted" />
        ))}
      </div>
      <div className="border-t border-border pt-3" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="h-4 animate-pulse rounded bg-muted/50" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ cols = 2, count = 4 }: { cols?: number; count?: number }) {
  return (
    <div className={`grid gap-4 grid-cols-${cols}`}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>
      <GridSkeleton cols={4} count={4} />
      <GridSkeleton cols={2} count={2} />
    </div>
  )
}
