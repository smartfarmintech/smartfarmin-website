import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardKPIProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
  }
  hint?: string
  tone?: "default" | "accent" | "muted"
}

export function DashboardKPI({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  tone = "default",
}: DashboardKPIProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-primary/5",
    muted: "bg-muted/50",
  }[tone]

  const iconClass = {
    default: "text-muted-foreground",
    accent: "text-primary",
    muted: "text-muted-foreground",
  }[tone]

  return (
    <Card className={bgClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${iconClass}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={`text-xs ${
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
