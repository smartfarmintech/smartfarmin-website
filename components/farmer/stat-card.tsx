import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: "primary" | "accent" | "muted"
}) {
  const toneClass =
    tone === "accent"
      ? "bg-accent/15 text-accent-foreground"
      : tone === "muted"
        ? "bg-muted text-muted-foreground"
        : "bg-primary/10 text-primary"

  return (
    <Card className="[--card-spacing:--spacing(4)]">
      <div className="flex items-start justify-between gap-3 px-(--card-spacing)">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md", toneClass)}>
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </Card>
  )
}
