import { cn } from "@/lib/utils"
import { label } from "@/lib/operator/constants"

type Tone = "neutral" | "success" | "warning" | "danger" | "info"

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
}

const STATUS_TONES: Record<string, Tone> = {
  // machine_status
  draft: "neutral",
  active: "success",
  booked: "info",
  under_maintenance: "warning",
  inactive: "neutral",
  retired: "neutral",
  // booking_state
  requested: "warning",
  confirmed: "info",
  operator_assigned: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "danger",
  rejected: "danger",
  no_show: "danger",
  // payment_status
  unpaid: "danger",
  advance_paid: "warning",
  pending: "warning",
  paid: "success",
  partially_refunded: "warning",
  refunded: "neutral",
  failed: "danger",
  // availability
  available: "success",
  blocked: "danger",
  maintenance: "warning",
  // verification / review
  verified: "success",
  published: "success",
  expired: "danger",
  hidden: "neutral",
  // maintenance_status
  scheduled: "info",
  cancelled_m: "danger",
  // operator status
  suspended: "danger",
}

export function StatusBadge({
  value,
  tone,
  className,
}: {
  value: string
  tone?: Tone
  className?: string
}) {
  const resolvedTone = tone ?? STATUS_TONES[value] ?? "neutral"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[resolvedTone],
        className,
      )}
    >
      {label(value)}
    </span>
  )
}
