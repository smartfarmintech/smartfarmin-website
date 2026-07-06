"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, MapPin, Clock, DollarSign, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "@/lib/farmer/actions"
import { formatDate, formatDateTime, formatBookingAmount, formatBookingDuration } from "@/lib/farmer/format"
import { BOOKING_STATE_LABEL, BOOKING_STATE_COLOR, BOOKING_STATES } from "@/lib/farmer/constants"
import type { BookingWithMachine } from "@/lib/farmer/types"

interface BookingDetailClientProps {
  booking: BookingWithMachine
}

// Timeline of booking states for visual tracking
const BOOKING_TIMELINE = [
  "pending",
  "confirmed",
  "operator_assigned",
  "in_progress",
  "completed",
] as const

export function BookingDetailClient({ booking: initialBooking }: BookingDetailClientProps) {
  const [booking, setBooking] = useState(initialBooking)
  const [canceling, setCanceling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return

    setCanceling(true)
    setCancelError(null)

    const result = await cancelBooking(booking.id)

    if (result.ok) {
      setBooking({ ...booking, booking_state: "cancelled" })
    } else {
      setCancelError(result.error || "Failed to cancel booking")
    }

    setCanceling(false)
  }

  const currentStateIndex = BOOKING_TIMELINE.indexOf(booking.booking_state as any)
  const isCanceled = booking.booking_state === "cancelled"
  const isRejected = booking.booking_state === "rejected"
  const canCancel = ["pending", "confirmed"].includes(booking.booking_state)

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur p-4">
          <Link href="/farmer/bookings" className="inline-flex items-center gap-2 text-sm hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            Back to Bookings
          </Link>
          <h1 className="text-lg font-semibold">{booking.booking_number}</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="p-6 rounded-lg bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{booking.machine?.name}</h2>
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  BOOKING_STATE_COLOR[booking.booking_state]
                }`}
              >
                {BOOKING_STATE_LABEL[booking.booking_state]}
              </div>
            </div>

            {/* Timeline */}
            {!isCanceled && !isRejected && (
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  {BOOKING_TIMELINE.map((state, idx) => {
                    const isCompleted = idx <= currentStateIndex
                    const isActive = state === booking.booking_state

                    return (
                      <div key={state} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className={`h-3 w-3 rounded-full border-2 transition-colors ${
                            isActive
                              ? "bg-primary border-primary"
                              : isCompleted
                                ? "bg-primary border-primary"
                                : "bg-white border-muted"
                          }`}
                        />
                        <span className="text-xs font-medium text-center">
                          {BOOKING_STATE_LABEL[state]}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="h-1 bg-muted rounded-full relative overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${((currentStateIndex + 1) / BOOKING_TIMELINE.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Machine</p>
                <p className="font-semibold">{booking.machine?.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-semibold">{booking.machine?.owner_name}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Booking Details */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Booking Schedule
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium">{formatDateTime(booking.starts_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End:</span>
                  <span className="font-medium">{formatDateTime(booking.ends_at)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{formatBookingDuration(booking.starts_at, booking.ends_at)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">{formatBookingAmount(booking.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{booking.payment_status.replace("_", " ")}</span>
                </div>
                {booking.tax_amount && booking.tax_amount > 0 && (
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">{formatBookingAmount(booking.tax_amount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Address */}
          {booking.service_address && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Location
              </h3>
              <p className="text-sm whitespace-pre-line">{booking.service_address}</p>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm whitespace-pre-line">{booking.notes}</p>
            </div>
          )}

          {/* Operator Info */}
          {booking.operator_id && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigned Operator
              </h3>
              <p className="text-sm text-muted-foreground">
                An operator has been assigned to handle your booking.
              </p>
            </div>
          )}

          {/* Error Message */}
          {cancelError && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
              {cancelError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {canCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={canceling}
                className="flex-1"
              >
                {canceling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </Button>
            )}
            <Link href="/farmer/machinery" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse More Machinery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
