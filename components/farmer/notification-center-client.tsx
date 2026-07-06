"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  AlertCircle,
  Award,
  Bell,
  CheckCheck,
  Cloud,
  Filter,
  Leaf,
  Plane,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Trash2,
  Wallet,
  Wrench,
  X,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/notifications/actions"
import { NOTIFICATION_CATEGORIES, type Notification, type NotificationCategory } from "@/lib/notifications/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  booking: Wrench,
  order: ShoppingCart,
  drone_booking: Plane,
  drone_mission: AlertCircle,
  ai_report: Leaf,
  scheme: Award,
  admin: AlertCircle,
  marketplace: Store,
  wallet: Wallet,
  weather: Cloud,
  system: Settings,
}

interface NotificationCenterClientProps {
  initialNotifications: Notification[]
  initialUnreadCount: number
}

export function NotificationCenterClient({
  initialNotifications,
  initialUnreadCount,
}: NotificationCenterClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "all">("all")

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedCategory !== "all" && n.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [notifications, selectedCategory, searchQuery])

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      Today: [],
      "This Week": [],
      Earlier: [],
    }

    const now = new Date()
    filtered.forEach((n) => {
      const createdDate = new Date(n.created_at)
      const diffMs = now.getTime() - createdDate.getTime()
      const diffMins = diffMs / (1000 * 60)

      if (diffMins < 1440) groups["Today"].push(n)
      else if (diffMins < 1440 * 7) groups["This Week"].push(n)
      else groups["Earlier"].push(n)
    })

    return Object.fromEntries(
      Object.entries(groups).filter(([, items]) => items.length > 0)
    )
  }, [filtered])

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      startTransition(async () => {
        const result = await markAsRead(null, notificationId)
        if (result?.ok) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId
                ? { ...n, read_at: new Date().toISOString() }
                : n
            )
          )
          setUnreadCount((prev) => Math.max(0, prev - 1))
          router.refresh()
        }
      })
    },
    [router]
  )

  const handleMarkAllAsRead = useCallback(() => {
    startTransition(async () => {
      const result = await markAllAsRead(null)
      if (result?.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read_at: n.read_at || new Date().toISOString(),
          }))
        )
        setUnreadCount(0)
        router.refresh()
      }
    })
  }, [router])

  const handleDelete = useCallback(
    (notificationId: string) => {
      startTransition(async () => {
        const result = await deleteNotification(null, notificationId)
        if (result?.ok) {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
          const deleted = notifications.find((n) => n.id === notificationId)
          if (deleted && !deleted.read_at) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
          router.refresh()
        }
      })
    },
    [notifications, router]
  )

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (!notification.read_at) {
        handleMarkAsRead(notification.id)
      }
      if (notification.action_url) {
        router.push(notification.action_url)
      }
    },
    [handleMarkAsRead, router]
  )

  const categories = [
    { value: "all" as const, label: "All" },
    { value: "booking" as const, label: "Machinery" },
    { value: "drone_mission" as const, label: "Drone" },
    { value: "ai_report" as const, label: "AI Reports" },
    { value: "order" as const, label: "Orders" },
    { value: "scheme" as const, label: "Schemes" },
    { value: "admin" as const, label: "Admin" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              variant="outline"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {notifications.length === 0
              ? "No notifications yet"
              : "No notifications match your search"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([groupLabel, items]) => (
            <div key={groupLabel}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {groupLabel}
              </h3>
              <div className="space-y-2">
                {items.map((notification) => {
                  const Icon = CATEGORY_ICONS[notification.category] || Bell
                  const meta = NOTIFICATION_CATEGORIES[notification.category]

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "flex gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                        !notification.read_at
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white",
                          meta.color
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.body}
                            </p>
                          </div>
                          {!notification.read_at && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {meta.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true }
                            )}
                          </span>
                          {notification.priority !== "normal" && (
                            <Badge
                              variant={
                                notification.priority === "urgent"
                                  ? "destructive"
                                  : "default"
                              }
                              className="text-xs"
                            >
                              {notification.priority}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notification.id)
                        }}
                        disabled={isPending}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
