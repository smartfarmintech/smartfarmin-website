import { Metadata } from "next"
import { NotificationCenterClient } from "@/components/farmer/notification-center-client"
import { getNotifications, getUnreadCount } from "@/lib/notifications/queries"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
}

export default async function NotificationsPage() {
  const [notifications, unreadCount] = await Promise.all([
    getNotifications({ limit: 50 }),
    getUnreadCount(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <NotificationCenterClient 
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
      />
    </div>
  )
}
