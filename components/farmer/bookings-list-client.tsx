"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate, formatBookingAmount, formatBookingDuration } from "@/lib/farmer/format"
import { BOOKING_STATE_LABEL, BOOKING_STATE_COLOR, PRICING_UNIT_LABEL } from "@/lib/farmer/constants"
import type { BookingWithMachine } from "@/lib/farmer/types"
import { ChevronRight } from "lucide-react"

interface BookingsListClientProps {
  initialBookings?: BookingWithMachine[]
}

export function BookingsListClient({ initialBookings = [] }: BookingsListClientProps) {
  const [bookings] = useState<BookingWithMachine[]>(initialBookings)
  const [error] = useState<string | null>(null)

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No bookings yet</p>
        <Link href="/farmer/machinery" className="text-primary hover:underline">
          Browse available machinery →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/farmer/bookings/${booking.id}`}
          className="block p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              {/* Machine Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {booking.machine?.name || "Machine"} - {booking.booking_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.units} {PRICING_UNIT_LABEL[booking.unit_type] ?? booking.unit_type}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    BOOKING_STATE_COLOR[booking.booking_state]
                  }`}
                >
                  {BOOKING_STATE_LABEL[booking.booking_state]}
                </div>
              </div>

              {/* Dates & Amount */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start:</span>
                  <p className="font-medium">{formatDate(booking.starts_at)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{formatBookingDuration(booking.starts_at, booking.ends_at)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-medium">{formatBookingAmount(booking.total_amount)}</p>
                </div>
              </div>

              {/* Operator Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Status: {BOOKING_STATE_LABEL[booking.booking_state]}</span>
                {booking.operator_id && (
                  <>
                    <span>•</span>
                    <span>Operator assigned</span>
                  </>
                )}
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  )
}
