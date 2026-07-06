"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck } from "lucide-react"
import { markAllNotificationsRead, markNotificationRead } from "@/lib/farmer/actions"
import { relativeTime } from "@/lib/farmer/format"
import { label } from "@/lib/farmer/constants"
import type { NotificationItem } from "@/lib/farmer/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive",
  high: "bg-amber-500/10 text-amber-600",
  normal: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
}

export function NotificationsList({ initial }: { initial: NotificationItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [isPending, startTransition] = useTransition()

  const unread = items.filter((n) => n.status === "unread")

  function handleRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)))
    startTransition(async () => {
      await markNotificationRead(id)
      router.refresh()
    })
  }

  function handleReadAll() {
    setItems((prev) => prev.map((n) => ({ ...n, status: "read" })))
    startTransition(async () => {
      await markAllNotificationsRead()
      router.refresh()
    })
  }

  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 p-10 text-center">
        <Bell className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No notifications</p>
        <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {unread.length > 0 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unread.length} unread notification{unread.length === 1 ? "" : "s"}
          </p>
          <Button variant="outline" size="sm" onClick={handleReadAll} disabled={isPending}>
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        </div>
      ) : null}

      <Card className="divide-y divide-border overflow-hidden">
        {items.map((n) => {
          const isUnread = n.status === "unread"
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => isUnread && handleRead(n.id)}
              className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <span
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  PRIORITY_STYLES[n.priority] ?? PRIORITY_STYLES.normal
                }`}
              >
                <Bell className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                  {isUnread ? <span className="size-2 shrink-0 rounded-full bg-primary" /> : null}
                </div>
                {n.body ? <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p> : null}
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {label(n.category)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{relativeTime(n.created_at)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </Card>
    </div>
  )
}
