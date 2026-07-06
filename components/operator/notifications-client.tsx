"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"
import { markAllNotificationsRead, markNotificationRead } from "@/lib/operator/actions"
import { relativeTime } from "@/lib/operator/format"
import { label } from "@/lib/operator/constants"
import type { NotificationItem } from "@/lib/operator/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { EmptyState } from "./empty-state"

export function NotificationsClient({ initialItems }: { initialItems: NotificationItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const unreadCount = initialItems.filter((n) => n.status === "unread").length

  function markOne(id: string) {
    startTransition(async () => {
      const res = await markNotificationRead(id)
      if (res?.ok) router.refresh()
    })
  }

  function markAll() {
    startTransition(async () => {
      const res = await markAllNotificationsRead()
      if (res?.ok) router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAll} disabled={isPending}>
            <CheckCheck className="size-4" aria-hidden /> Mark all read
          </Button>
        )}
      </div>

      {initialItems.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="Booking requests, payments, and maintenance reminders will appear here."
        />
      ) : (
        <Card className="divide-y divide-border p-0">
          {initialItems.map((n) => {
            const unread = n.status === "unread"
            return (
              <div
                key={n.id}
                className={cn("flex items-start gap-3 px-4 py-3", unread && "bg-primary/5")}
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    unread ? "bg-primary" : "bg-transparent",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("text-sm", unread ? "font-semibold text-foreground" : "font-medium text-card-foreground")}>
                      {n.title}
                    </p>
                    <StatusBadge value={n.category} tone="info" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{relativeTime(n.created_at)}</span>
                    {n.action_url ? (
                      <Link href={n.action_url} className="text-xs font-medium text-primary hover:underline">
                        View
                      </Link>
                    ) : null}
                    <span className="text-xs text-muted-foreground">· {label(n.priority)} priority</span>
                  </div>
                </div>
                {unread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 shrink-0 px-2 text-xs"
                    onClick={() => markOne(n.id)}
                    disabled={isPending}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}
