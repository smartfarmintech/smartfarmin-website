import { StatCardSkeleton, CardSkeleton, GridSkeleton } from "@/components/skeleton-loaders"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
