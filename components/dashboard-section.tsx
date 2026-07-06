import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardSection({
  title,
  description,
  action,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
