"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type NotificationChannel = "push" | "email" | "sms" | "whatsapp" | "in-app"
export type NotificationCategory =
  | "booking_alert"
  | "marketplace_alert"
  | "drone_alert"
  | "ai_report"
  | "scheme_alert"
  | "payment"
  | "system"

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  category: NotificationCategory
  channel: NotificationChannel
  priority: "low" | "normal" | "high" | "urgent"
  actionUrl?: string
  imageUrl?: string
  data?: Record<string, any>
  read: boolean
  sentAt: string
  deliveredAt?: string
  failedAt?: string
  failureReason?: string
}

export interface NotificationPreference {
  userId: string
  bookingAlerts: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  marketplaceAlerts: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  droneAlerts: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  aiReports: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  schemeAlerts: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  paymentNotifications: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
}

/**
 * Send booking alert notification
 */
export async function sendBookingAlert(
  userId: string,
  bookingId: string,
  status: "confirmed" | "started" | "completed" | "cancelled",
  machineType: string,
  farmerName: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const titleMap = {
      confirmed: `Booking Confirmed - ${machineType}`,
      started: `${farmerName} has started your ${machineType}`,
      completed: `${machineType} booking completed`,
      cancelled: `Booking cancelled - ${machineType}`,
    }

    const bodyMap = {
      confirmed: `Your booking for ${machineType} on ${new Date().toLocaleDateString()} is confirmed.`,
      started: `${farmerName} started using your ${machineType} at ${new Date().toLocaleTimeString()}.`,
      completed: `${machineType} booking completed. Rate your experience.`,
      cancelled: `Your ${machineType} booking has been cancelled. Full refund will be processed.`,
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: titleMap[status],
      body: bodyMap[status],
      category: "booking_alert",
      channel: "push",
      priority: status === "cancelled" ? "high" : "normal",
      actionUrl: `/operator/bookings/${bookingId}`,
      data: { bookingId, machineType, status },
      read: false,
      sentAt: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notification)
    if (error) throw error

    // Queue for multi-channel delivery
    await queueMultiChannelNotification(userId, notification, "booking_alert")

    revalidatePath("/farmer/dashboard")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Send marketplace alert
 */
export async function sendMarketplaceAlert(
  userId: string,
  orderId: string,
  status: "order_placed" | "confirmed" | "shipped" | "delivered" | "cancelled",
  itemCount: number,
  totalAmount: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const titleMap = {
      order_placed: "Order Placed Successfully",
      confirmed: "Your Order is Confirmed",
      shipped: "Your Order is On the Way",
      delivered: "Order Delivered",
      cancelled: "Order Cancelled",
    }

    const bodyMap = {
      order_placed: `Order #${orderId.slice(0, 8)} with ${itemCount} items placed for Rs. ${totalAmount}`,
      confirmed: `Order #${orderId.slice(0, 8)} confirmed. Expected delivery in 2-3 days.`,
      shipped: `Order #${orderId.slice(0, 8)} shipped. Track your package.`,
      delivered: `Order #${orderId.slice(0, 8)} delivered. Thank you for your purchase.`,
      cancelled: `Order #${orderId.slice(0, 8)} cancelled. Refund initiated.`,
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: titleMap[status],
      body: bodyMap[status],
      category: "marketplace_alert",
      channel: "push",
      priority: status === "cancelled" ? "high" : "normal",
      actionUrl: `/farmer/marketplace/orders/${orderId}`,
      data: { orderId, status, itemCount, totalAmount },
      read: false,
      sentAt: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notification)
    if (error) throw error

    await queueMultiChannelNotification(userId, notification, "marketplace_alert")

    revalidatePath("/farmer/marketplace")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Send drone service alert
 */
export async function sendDroneAlert(
  userId: string,
  missionId: string,
  status: "scheduled" | "in_progress" | "completed" | "failed",
  cropType: string,
  acresCovered?: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const titleMap = {
      scheduled: `Drone Mission Scheduled - ${cropType}`,
      in_progress: `Drone Spraying in Progress`,
      completed: `Drone Mission Completed - ${cropType}`,
      failed: `Drone Mission Failed - ${cropType}`,
    }

    const bodyMap = {
      scheduled: `Drone mission scheduled for ${cropType}. Check details and reschedule if needed.`,
      in_progress: `Drone is currently spraying your ${cropType} field. Live tracking available.`,
      completed: `Successfully sprayed ${acresCovered || 0} acres of ${cropType}. View report.`,
      failed: `Drone mission failed due to weather. Will retry tomorrow. View details.`,
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: titleMap[status],
      body: bodyMap[status],
      category: "drone_alert",
      channel: "push",
      priority: status === "failed" ? "high" : "normal",
      actionUrl: `/farmer/drone-missions/${missionId}`,
      data: { missionId, status, cropType, acresCovered },
      read: false,
      sentAt: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notification)
    if (error) throw error

    await queueMultiChannelNotification(userId, notification, "drone_alert")

    revalidatePath("/farmer/dashboard")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Send AI Crop Doctor report alert
 */
export async function sendAIReportAlert(
  userId: string,
  reportId: string,
  cropType: string,
  findings: string[],
  confidence: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const severity = confidence > 0.8 ? "high" : confidence > 0.6 ? "medium" : "low"

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: `AI Analysis Complete - ${cropType}`,
      body: `Your ${cropType} AI analysis is ready. ${findings.length} findings detected.`,
      category: "ai_report",
      channel: "push",
      priority: severity === "high" ? "urgent" : severity === "medium" ? "high" : "normal",
      actionUrl: `/farmer/ai-reports/${reportId}`,
      data: { reportId, cropType, findings, confidence, severity },
      read: false,
      sentAt: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notification)
    if (error) throw error

    await queueMultiChannelNotification(userId, notification, "ai_report")

    revalidatePath("/farmer/dashboard")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Send government scheme alert
 */
export async function sendSchemeAlert(
  userId: string,
  applicationId: string,
  status: "submitted" | "under_review" | "approved" | "rejected" | "disbursed",
  schemeName: string,
  amount?: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const titleMap = {
      submitted: `${schemeName} Application Submitted`,
      under_review: `${schemeName} Under Review`,
      approved: `${schemeName} Approved!`,
      rejected: `${schemeName} Application Rejected`,
      disbursed: `${schemeName} Amount Disbursed`,
    }

    const bodyMap = {
      submitted: `Your application for ${schemeName} has been submitted. You'll be notified of updates.`,
      under_review: `Your ${schemeName} application is under review. Decision expected in 3-5 days.`,
      approved: `Congratulations! ${schemeName} application approved for Rs. ${amount || "N/A"}.`,
      rejected: `Your ${schemeName} application was rejected. Contact support for details.`,
      disbursed: `Rs. ${amount || "N/A"} from ${schemeName} has been disbursed to your account.`,
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      title: titleMap[status],
      body: bodyMap[status],
      category: "scheme_alert",
      channel: "push",
      priority: status === "approved" || status === "disbursed" ? "high" : status === "rejected" ? "high" : "normal",
      actionUrl: `/farmer/schemes/${applicationId}`,
      data: { applicationId, schemeName, status, amount },
      read: false,
      sentAt: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notification)
    if (error) throw error

    await queueMultiChannelNotification(userId, notification, "scheme_alert")

    revalidatePath("/farmer/dashboard")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Queue notification for multi-channel delivery
 */
async function queueMultiChannelNotification(
  userId: string,
  notification: Notification,
  category: NotificationCategory
): Promise<void> {
  const supabase = await createClient()

  try {
    // Get user preferences
    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()

    const prefs = preferences as unknown as NotificationPreference

    // Map category to preference key
    const categoryPrefKey = category.replace("_", "") as keyof Omit<NotificationPreference, "userId">

    if (prefs && prefs[categoryPrefKey]) {
      const channels = prefs[categoryPrefKey] as Record<string, boolean>

      // Queue notifications for each enabled channel
      const queuedNotifications = []

      if (channels.email)
        queuedNotifications.push({
          ...notification,
          channel: "email" as NotificationChannel,
        })
      if (channels.sms)
        queuedNotifications.push({
          ...notification,
          channel: "sms" as NotificationChannel,
        })
      if (channels.whatsapp)
        queuedNotifications.push({
          ...notification,
          channel: "whatsapp" as NotificationChannel,
        })

      // Insert queued notifications
      if (queuedNotifications.length > 0) {
        await supabase.from("notification_queue").insert(queuedNotifications)
      }
    }
  } catch (err) {
    console.error("Error queuing multi-channel notifications:", err)
  }
}

/**
 * Get user notification history
 */
export async function getNotificationHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ ok: boolean; data?: Notification[]; total?: number; error?: string }> {
  const supabase = await createClient()

  try {
    const { data, count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { ok: true, data: data as Notification[], total: count || 0 }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreference>
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("notification_preferences").upsert({
      user_id: userId,
      ...preferences,
    })

    if (error) throw error

    revalidatePath("/farmer/settings")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)

    if (error) throw error

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) throw error

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
