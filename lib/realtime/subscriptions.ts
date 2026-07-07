import { createClient } from "@/lib/supabase/client"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

/**
 * Subscribe to booking status changes for a specific booking
 */
export function subscribeToBookingChanges(
  bookingId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`booking:${bookingId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to all bookings for a user
 */
export function subscribeToUserBookings(
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`user-bookings:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `farmer_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to GPS tracking updates for a booking
 */
export function subscribeToGPSTracking(
  bookingId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`gps-tracking:${bookingId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "gps_tracking",
        filter: `booking_id=eq.${bookingId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to wallet balance changes
 */
export function subscribeToWalletChanges(
  walletId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`wallet:${walletId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "wallet_transactions",
        filter: `wallet_id=eq.${walletId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to order status changes
 */
export function subscribeToOrderChanges(
  orderId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`order:${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to notification changes for a user
 */
export function subscribeToNotifications(
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to cart changes
 */
export function subscribeToCartChanges(
  cartId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`cart:${cartId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `cart_id=eq.${cartId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to machine availability changes
 */
export function subscribeToMachineAvailability(
  machineId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`machine:${machineId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "availability",
        filter: `machine_id=eq.${machineId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Subscribe to drone service bookings
 */
export function subscribeToDroneServiceBookings(
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`drone-bookings:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "drone_service_bookings",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()

  return subscription
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeFromChannel(subscription: any) {
  if (subscription) {
    await subscription.unsubscribe()
  }
}
