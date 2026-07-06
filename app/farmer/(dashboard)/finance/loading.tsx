import { StatCardSkeleton, CardSkeleton, TableSkeleton } from "@/components/skeleton-loaders"

export default function FinanceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <CardSkeleton />
      <TableSkeleton rows={5} />
    </div>
  )
}
