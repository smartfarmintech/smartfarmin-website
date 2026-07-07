import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import {
  subscribeToBookingChanges,
  subscribeToUserBookings,
  subscribeToGPSTracking,
  subscribeToWalletChanges,
  subscribeToOrderChanges,
  subscribeToNotifications,
  subscribeToCartChanges,
  subscribeToMachineAvailability,
  subscribeToDroneServiceBookings,
  unsubscribeFromChannel,
} from "./subscriptions"

/**
 * Hook to listen for booking changes in real-time
 */
export function useBookingRealtime(bookingId: string) {
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!bookingId) return

    subscriptionRef.current = subscribeToBookingChanges(bookingId, () => {
      // Trigger SWR revalidation if using it
      // mutate(`/api/machinery/bookings/${bookingId}`)
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [bookingId])
}

/**
 * Hook to listen for all user bookings
 */
export function useUserBookingsRealtime(userId?: string) {
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!userId) return

    subscriptionRef.current = subscribeToUserBookings(userId, () => {
      // Trigger SWR revalidation
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [userId])
}

/**
 * Hook for real-time GPS tracking
 */
export function useGPSTracking(bookingId: string) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!bookingId) return

    subscriptionRef.current = subscribeToGPSTracking(bookingId, (payload) => {
      if (payload.eventType === "INSERT") {
        const tracking = payload.new
        setLocation({
          latitude: tracking.latitude,
          longitude: tracking.longitude,
        })
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [bookingId])

  return location
}

/**
 * Hook for wallet balance changes
 */
export function useWalletRealtime(walletId: string) {
  const [balance, setBalance] = useState<number>(0)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!walletId) return

    subscriptionRef.current = subscribeToWalletChanges(walletId, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        const transaction = payload.new
        setBalance((prev) => {
          if (transaction.transaction_type === "credit") {
            return prev + transaction.amount
          } else {
            return prev - transaction.amount
          }
        })
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [walletId])

  return balance
}

/**
 * Hook for order status changes
 */
export function useOrderRealtime(orderId: string) {
  const [status, setStatus] = useState<string>("")
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!orderId) return

    subscriptionRef.current = subscribeToOrderChanges(orderId, (payload) => {
      if (payload.eventType === "UPDATE") {
        setStatus(payload.new.order_status)
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [orderId])

  return status
}

/**
 * Hook for real-time notifications
 */
export function useNotificationsRealtime(userId?: string) {
  const [notification, setNotification] = useState<any>(null)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!userId) return

    subscriptionRef.current = subscribeToNotifications(userId, (payload) => {
      if (payload.eventType === "INSERT") {
        setNotification(payload.new)
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [userId])

  return notification
}

/**
 * Hook for cart changes
 */
export function useCartRealtime(cartId: string) {
  const subscriptionRef = useRef<any>(null)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (!cartId) return

    subscriptionRef.current = subscribeToCartChanges(cartId, (payload) => {
      if (payload.eventType === "INSERT") {
        setItemCount((prev) => prev + 1)
      } else if (payload.eventType === "DELETE") {
        setItemCount((prev) => Math.max(0, prev - 1))
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [cartId])

  return itemCount
}

/**
 * Hook for machine availability changes
 */
export function useMachineAvailabilityRealtime(machineId: string) {
  const [availability, setAvailability] = useState<any[]>([])
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!machineId) return

    subscriptionRef.current = subscribeToMachineAvailability(machineId, (payload) => {
      if (payload.eventType === "INSERT") {
        setAvailability((prev) => [...prev, payload.new])
      } else if (payload.eventType === "UPDATE") {
        setAvailability((prev) =>
          prev.map((item) => (item.id === payload.new.id ? payload.new : item))
        )
      } else if (payload.eventType === "DELETE") {
        setAvailability((prev) => prev.filter((item) => item.id !== payload.old.id))
      }
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [machineId])

  return availability
}

/**
 * Hook for drone service bookings
 */
export function useDroneServiceBookingsRealtime(userId?: string) {
  const subscriptionRef = useRef<any>(null)
  const [bookingUpdate, setBookingUpdate] = useState<any>(null)

  useEffect(() => {
    if (!userId) return

    subscriptionRef.current = subscribeToDroneServiceBookings(userId, (payload) => {
      setBookingUpdate({
        type: payload.eventType,
        data: payload.eventType === "DELETE" ? payload.old : payload.new,
      })
    })

    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromChannel(subscriptionRef.current)
      }
    }
  }, [userId])

  return bookingUpdate
}
