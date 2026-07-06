"use server"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Notification } from "./types"

/**
 * Get notifications for authenticated user
 */
export const getNotifications = cache(async (filters?: {
  unreadOnly?: boolean
  category?: string
  limit?: number
  offset?: number
}): Promise<Notification[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  let query = supabase
    .from("notifications")
    .select(
      `id, title, body, category, status, priority, channel, 
      action_url, image_url, data, read_at, created_at, expires_at`
    )
    .eq("user_id", user.id)

  if (filters?.unreadOnly) {
    query = query.is("read_at", null)
  }

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as Notification[]) ?? []
})

/**
 * Get unread notification count
 */
export const getUnreadCount = cache(async (): Promise<number> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null)

  if (error) throw error
  return count ?? 0
})

/**
 * Get notification by ID
 */
export const getNotificationById = cache(async (id: string): Promise<Notification | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return (data as Notification) ?? null
})

/**
 * Get notifications grouped by date
 */
export const getNotificationsGrouped = cache(async (limit = 50): Promise<Record<string, Notification[]>> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return {}

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error

  // Group by date
  const grouped: Record<string, Notification[]> = {}
  for (const notif of (data ?? []) as Notification[]) {
    const date = new Date(notif.created_at).toLocaleDateString("en-IN")
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(notif)
  }

  return grouped
})
