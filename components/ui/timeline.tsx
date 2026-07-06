"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

type TimelineStatus =
  | "complete"
  | "completed"
  | "current"
  | "upcoming"
  | "pending"

export interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  status?: TimelineStatus
  icon?: React.ReactNode
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[]
}

const dotStyles: Record<TimelineStatus, string> = {
  complete: "bg-primary border-primary",
  completed: "bg-primary border-primary",
  current: "bg-background border-primary ring-2 ring-primary/30",
  upcoming: "bg-muted border-border",
  pending: "bg-muted border-border",
}

export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("relative flex flex-col gap-6", className)} {...props}>
      {items.map((item, index) => {
        const status = item.status ?? "upcoming"
        const isLast = index === items.length - 1
        return (
          <li key={index} className="relative flex gap-4 pl-2">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-6 h-full w-px bg-border"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-primary-foreground",
                dotStyles[status],
              )}
            >
              {item.icon}
            </span>
            <div className="flex flex-col gap-0.5 pb-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="text-sm font-medium text-foreground text-pretty">{item.title}</p>
                {item.timestamp && (
                  <time className="text-xs text-muted-foreground">{item.timestamp}</time>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
