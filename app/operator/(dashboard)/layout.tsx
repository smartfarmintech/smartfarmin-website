import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ensureOwnerBootstrap } from "@/lib/operator/actions"
import { getNotifications, getSessionUser, getUserProfile } from "@/lib/operator/queries"
import { OperatorShell } from "@/components/operator/operator-shell"

export const metadata: Metadata = {
  title: "Operator Dashboard — Rythu360",
  description: "Manage your machines, bookings, operators and pricing.",
}

export default async function OperatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect("/operator/login")

  // Ensure the linked profile row exists for this owner.
  await ensureOwnerBootstrap()

  const [profile, notifications] = await Promise.all([getUserProfile(), getNotifications(50)])
  const displayName = profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "Owner"
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  return (
    <OperatorShell displayName={displayName} unreadCount={unreadCount}>
      {children}
    </OperatorShell>
  )
}
