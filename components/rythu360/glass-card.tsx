import { cn } from "@/lib/utils"

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-card/60",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
