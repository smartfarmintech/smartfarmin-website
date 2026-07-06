import { requireFarmer, getNotifications } from "@/lib/farmer/queries"
import { NotificationsList } from "@/components/farmer/notifications-list"

export const dynamic = "force-dynamic"

export default async function NotificationsPage() {
  await requireFarmer()
  const notifications = await getNotifications(50)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Alerts, reminders, and updates about your farm.</p>
      </header>
      <NotificationsList initial={notifications} />
    </div>
  )
}
