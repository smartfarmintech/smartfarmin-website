import type { CropCycleStatus } from "@/lib/farmer/constants"
import { label } from "@/lib/farmer/constants"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<CropCycleStatus, string> = {
  planned: "bg-muted text-muted-foreground",
  sowing: "bg-chart-4/20 text-chart-4",
  growing: "bg-primary/15 text-primary",
  flowering: "bg-accent/20 text-accent-foreground",
  maturing: "bg-chart-2/20 text-chart-2",
  harvested: "bg-primary text-primary-foreground",
  failed: "bg-destructive/15 text-destructive",
  abandoned: "bg-muted text-muted-foreground line-through",
}

export function CropStatusBadge({ status }: { status: CropCycleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {label(status)}
    </span>
  )
}
