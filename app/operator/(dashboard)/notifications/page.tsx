import { requireOwner, getNotifications } from "@/lib/operator/queries"
import { NotificationsClient } from "@/components/operator/notifications-client"

export default async function OperatorNotificationsPage() {
  await requireOwner()
  const items = await getNotifications()

  return <NotificationsClient initialItems={items} />
}
