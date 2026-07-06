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
