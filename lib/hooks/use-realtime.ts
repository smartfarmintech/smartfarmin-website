'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
  subscribeToBookings,
  subscribeToWallet,
  subscribeToNotifications,
  subscribeToMachinery,
  subscribeToOperators,
  unsubscribeFromChannel,
} from '@/lib/supabase/realtime'
import { mutate } from 'swr'

/**
 * Hook to subscribe to bookings updates
 */
export function useRealtimeBookings(onUpdate?: (data: any) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToBookings((data) => {
      // Revalidate SWR bookings data
      mutate((key) => typeof key === 'string' && key.includes('bookings'))
      onUpdate?.(data)
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
      }
    }
  }, [onUpdate])
}

/**
 * Hook to subscribe to wallet updates
 */
export function useRealtimeWallet(userId: string, onUpdate?: (data: any) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToWallet(userId, (data) => {
      // Revalidate SWR wallet data
      mutate((key) => typeof key === 'string' && key.includes('wallet'))
      onUpdate?.(data)
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
      }
    }
  }, [userId, onUpdate])
}

/**
 * Hook to subscribe to notifications
 */
export function useRealtimeNotifications(userId: string, onUpdate?: (data: any) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToNotifications(userId, (data) => {
      // Revalidate SWR notifications data
      mutate((key) => typeof key === 'string' && key.includes('notifications'))
      onUpdate?.(data)
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
      }
    }
  }, [userId, onUpdate])
}

/**
 * Hook to subscribe to machinery updates
 */
export function useRealtimeMachinery(machineId: string, onUpdate?: (data: any) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToMachinery(machineId, (data) => {
      // Revalidate SWR machinery data
      mutate((key) => typeof key === 'string' && key.includes(`machinery/${machineId}`))
      onUpdate?.(data)
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
      }
    }
  }, [machineId, onUpdate])
}

/**
 * Hook to subscribe to operator status
 */
export function useRealtimeOperator(operatorId: string, onUpdate?: (data: any) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToOperators(operatorId, (data) => {
      // Revalidate SWR operator data
      mutate((key) => typeof key === 'string' && key.includes(`operator/${operatorId}`))
      onUpdate?.(data)
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
      }
    }
  }, [operatorId, onUpdate])
}
