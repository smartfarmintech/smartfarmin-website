import { cn } from "@/lib/utils"

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
