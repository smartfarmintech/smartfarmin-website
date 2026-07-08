'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Booking {
  id: string
  booking_number: string
  machine?: {
    name: string
    image_url?: string
    brand?: string
    model?: string
  }
  starts_at: string
  ends_at: string
  unit_type: string
  units: number
  village?: {
    name: string
  }
  booking_state: string
  payment_status: string
}

interface UpcomingBookingsProps {
  bookings: Booking[]
  loading?: boolean
}

export function UpcomingBookings({ bookings, loading = false }: UpcomingBookingsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed">
        <p className="text-gray-600 mb-3">No upcoming bookings</p>
        <Link
          href="/machinery/booking"
          className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
        >
          Book machinery now <ChevronRight className="w-4 h-4" />
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/farmer/bookings/${booking.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                {/* Machine Image */}
                {booking.machine?.image_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={booking.machine.image_url}
                      alt={booking.machine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Booking Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">
                      {booking.machine?.name || 'Machinery'}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0">
                      {booking.unit_type}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {booking.machine?.brand} {booking.machine?.model}
                  </p>

                  {/* DateTime and Location */}
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.starts_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(booking.starts_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {booking.village && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.village.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {booking.booking_state === 'confirmed' ? 'Confirmed' : booking.booking_state}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
