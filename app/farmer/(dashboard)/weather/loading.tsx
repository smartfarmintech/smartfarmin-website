import { CardSkeleton, GridSkeleton } from "@/components/skeleton-loaders"

export default function WeatherLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
