import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ensureFarmerBootstrap } from "@/lib/farmer/actions"
import { getNotifications, getSessionUser, getUserProfile } from "@/lib/farmer/queries"
import { FarmerShell } from "@/components/farmer/farmer-shell"

export const metadata: Metadata = {
  title: "Farmer Dashboard — Rythu360",
  description: "Manage your crops, weather, finances and documents.",
}

export default async function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect("/farmer/login")

  // Ensure the linked farmer/profile/wallet rows exist for this user.
  await ensureFarmerBootstrap()

  const [profile, notifications] = await Promise.all([getUserProfile(), getNotifications(50)])
  const displayName = profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "Farmer"
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  return (
    <FarmerShell displayName={displayName} unreadCount={unreadCount}>
      {children}
    </FarmerShell>
  )
}
