"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Mark notification as read
 */
export async function markAsRead(_prev: ActionState, notificationId: string): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)

    if (error) throw error

    revalidatePath("/app/notifications")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null)

    if (error) throw error

    revalidatePath("/app/notifications")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(_prev: ActionState, notificationId: string): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)

    if (error) throw error

    revalidatePath("/app/notifications")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "You must be signed in" }
  }

  try {
    const preferences = {
      emailNotifications: formData.get("emailNotifications") === "on",
      smsNotifications: formData.get("smsNotifications") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      orderNotifications: formData.get("orderNotifications") === "on",
      bookingNotifications: formData.get("bookingNotifications") === "on",
      weatherNotifications: formData.get("weatherNotifications") === "on",
      schemeNotifications: formData.get("schemeNotifications") === "on",
      promotionalNotifications: formData.get("promotionalNotifications") === "on",
    }

    // Update user preferences in metadata or separate table
    const { error } = await supabase
      .from("user_profiles")
      .update({ metadata: preferences })
      .eq("id", user.id)

    if (error) throw error

    revalidatePath("/app/settings/notifications")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Create notification for user
 */
export async function createNotification(
  userId: string,
  {
    title,
    body,
    category,
    channel = "in-app",
    priority = "normal",
    actionUrl = null,
    imageUrl = null,
    data = null,
  }: {
    title: string
    body: string
    category: string
    channel?: string
    priority?: "low" | "normal" | "high" | "urgent"
    actionUrl?: string | null
    imageUrl?: string | null
    data?: Record<string, unknown> | null
  }
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        body,
        category,
        channel,
        priority,
        action_url: actionUrl,
        image_url: imageUrl,
        data,
        status: "delivered",
      })

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Create booking update notification
 */
export async function notifyBookingUpdate(
  userId: string,
  bookingId: string,
  status: "confirmed" | "completed" | "cancelled",
  machineType: string
): Promise<ActionState> {
  const titleMap = {
    confirmed: `Your ${machineType} booking is confirmed`,
    completed: `Your ${machineType} booking is completed`,
    cancelled: `Your ${machineType} booking was cancelled`,
  }

  return createNotification(userId, {
    title: titleMap[status],
    body: `Booking #${bookingId.slice(0, 8)} has been ${status}`,
    category: "booking",
    priority: status === "cancelled" ? "high" : "normal",
    actionUrl: `/farmer/bookings/${bookingId}`,
  })
}

/**
 * Create drone mission notification
 */
export async function notifyDroneMission(
  userId: string,
  missionId: string,
  status: "scheduled" | "in-progress" | "completed" | "failed",
  cropType: string
): Promise<ActionState> {
  const titleMap = {
    scheduled: `Drone mission scheduled for ${cropType}`,
    "in-progress": `Drone mission in progress for ${cropType}`,
    completed: `Drone mission completed for ${cropType}`,
    failed: `Drone mission failed for ${cropType}`,
  }

  return createNotification(userId, {
    title: titleMap[status],
    body: `Mission #${missionId.slice(0, 8)} status: ${status}`,
    category: "drone_mission",
    priority: status === "failed" ? "high" : "normal",
    actionUrl: `/farmer/drone-missions/${missionId}`,
  })
}

/**
 * Create AI report notification
 */
export async function notifyAIReport(
  userId: string,
  reportId: string,
  diseaseDetected: string | null,
  cropType: string
): Promise<ActionState> {
  return createNotification(userId, {
    title: diseaseDetected
      ? `Disease detected in ${cropType}: ${diseaseDetected}`
      : `AI analysis complete for ${cropType}`,
    body: `Report #${reportId.slice(0, 8)} is ready for review`,
    category: "ai_report",
    priority: diseaseDetected ? "high" : "normal",
    actionUrl: `/farmer/ai-reports/${reportId}`,
  })
}

/**
 * Create order notification
 */
export async function notifyOrderUpdate(
  userId: string,
  orderId: string,
  status: "confirmed" | "shipped" | "delivered" | "cancelled",
  productCount: number
): Promise<ActionState> {
  const titleMap = {
    confirmed: `Order #${orderId.slice(0, 8)} confirmed`,
    shipped: `Order #${orderId.slice(0, 8)} shipped`,
    delivered: `Order #${orderId.slice(0, 8)} delivered`,
    cancelled: `Order #${orderId.slice(0, 8)} cancelled`,
  }

  return createNotification(userId, {
    title: titleMap[status],
    body: `${productCount} item${productCount > 1 ? "s" : ""} - Status: ${status}`,
    category: "order",
    priority: "normal",
    actionUrl: `/farmer/marketplace/orders/${orderId}`,
  })
}

/**
 * Create scheme notification
 */
export async function notifySchemeUpdate(
  userId: string,
  applicationId: string,
  status: "submitted" | "approved" | "rejected" | "disbursed",
  schemeName: string
): Promise<ActionState> {
  const titleMap = {
    submitted: `${schemeName} application submitted`,
    approved: `${schemeName} application approved`,
    rejected: `${schemeName} application rejected`,
    disbursed: `${schemeName} funds disbursed`,
  }

  return createNotification(userId, {
    title: titleMap[status],
    body: `Application #${applicationId.slice(0, 8)} - ${status}`,
    category: "scheme",
    priority: status === "rejected" ? "high" : "normal",
    actionUrl: `/farmer/schemes/${applicationId}`,
  })
}

/**
 * Create admin announcement
 */
export async function broadcastAdminAnnouncement(
  title: string,
  body: string,
  targetUserIds: string[],
  actionUrl?: string
): Promise<ActionState> {
  const supabase = await createClient()

  try {
    const notifications = targetUserIds.map((userId) => ({
      user_id: userId,
      title,
      body,
      category: "admin",
      channel: "in-app",
      priority: "high" as const,
      action_url: actionUrl || null,
      status: "delivered" as const,
    }))

    const { error } = await supabase
      .from("notifications")
      .insert(notifications)

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .is("read_at", null)

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Register device for push notifications
 */
export async function registerPushDevice(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const pushToken = formData.get("push_token") as string
    const deviceType = formData.get("device_type") as string

    if (!pushToken) {
      return { ok: false, error: "Push token required" }
    }

    const { error } = await supabase
      .from("user_devices")
      .upsert(
        {
          user_id: user.id,
          push_token: pushToken,
          device_type: deviceType || "web",
          is_active: true,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,push_token" }
      )

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPrefs(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { data: prefs, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") throw error

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get notification history for analytics
 */
export async function getNotificationStats(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { count: total } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)

    const { count: unread } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .is("read_at", null)

    // Get notifications by category
    const { data: byCategory } = await supabase
      .from("notifications")
      .select("category")
      .eq("user_id", user.id)

    const categoryStats: Record<string, number> = {}
    byCategory?.forEach((n) => {
      categoryStats[n.category] = (categoryStats[n.category] || 0) + 1
    })

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Send test notification
 */
export async function sendTestNotification(_prev: ActionState): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title: "Test Notification",
        body: "This is a test notification from SmartFarmin to verify your notification settings.",
        category: "test",
        channel: "in-app",
        priority: "normal",
        status: "delivered",
      })

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
