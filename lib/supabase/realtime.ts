/**
 * Supabase Realtime utilities for live data synchronization
 */

import { createClient } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type RealtimeListener<T> = (payload: T) => void

export interface SubscriptionOptions {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
}

/**
 * Subscribe to table changes in realtime
 */
export function subscribeToTable<T>(
  tableName: string,
  callback: RealtimeListener<T>,
  options?: SubscriptionOptions,
): RealtimeChannel | null {
  try {
    const supabase = createClient()
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: options?.event || '*',
          schema: 'public',
          table: tableName,
          filter: options?.filter,
        },
        (payload: any) => callback(payload.new as T),
      )
      .subscribe()

    return channel
  } catch (error) {
    console.error(`Failed to subscribe to ${tableName}:`, error)
    return null
  }
}

/**
 * Subscribe to bookings changes
 */
export function subscribeToBookings(callback: RealtimeListener<any>) {
  return subscribeToTable('bookings', callback, { event: '*' })
}

/**
 * Subscribe to wallet transactions
 */
export function subscribeToWallet(userId: string, callback: RealtimeListener<any>) {
  return subscribeToTable('wallet_transactions', callback, {
    event: '*',
    filter: `user_id=eq.${userId}`,
  })
}

/**
 * Subscribe to notifications
 */
export function subscribeToNotifications(userId: string, callback: RealtimeListener<any>) {
  return subscribeToTable('notifications', callback, {
    event: 'INSERT',
    filter: `user_id=eq.${userId}`,
  })
}

/**
 * Subscribe to machinery availability
 */
export function subscribeToMachinery(machineId: string, callback: RealtimeListener<any>) {
  return subscribeToTable('machines', callback, {
    event: '*',
    filter: `id=eq.${machineId}`,
  })
}

/**
 * Subscribe to operator status
 */
export function subscribeToOperators(operatorId: string, callback: RealtimeListener<any>) {
  return subscribeToTable('operators', callback, {
    event: '*',
    filter: `id=eq.${operatorId}`,
  })
}

/**
 * Unsubscribe from channel
 */
export async function unsubscribeFromChannel(channel: RealtimeChannel | null) {
  if (!channel) return

  try {
    const supabase = createClient()
    await supabase.removeChannel(channel)
  } catch (error) {
    console.error('Failed to unsubscribe:', error)
  }
}
