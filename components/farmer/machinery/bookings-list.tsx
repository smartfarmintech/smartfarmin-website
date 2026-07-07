'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, DollarSign, Download, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Booking {
  id: string
  booking_number: string
  machine_name: string
  operator_name: string
  booking_state: 'pending' | 'confirmed' | 'started' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'partial' | 'completed'
  starts_at: string
  ends_at: string
  total_amount: number
  advance_amount: number
  units: number
  currency: string
}

const mockBookings: Booking[] = [
  {
    id: '1',
    booking_number: 'BK001',
    machine_name: 'Tractor - 50HP',
    operator_name: 'Rajesh Kumar',
    booking_state: 'confirmed',
    payment_status: 'partial',
    starts_at: '2024-07-20',
    ends_at: '2024-07-22',
    total_amount: 4500,
    advance_amount: 2000,
    units: 3,
    currency: 'INR',
  },
  {
    id: '2',
    booking_number: 'BK002',
    machine_name: 'Rotavator - 7FT',
    operator_name: 'Mohan Singh',
    booking_state: 'completed',
    payment_status: 'completed',
    starts_at: '2024-07-10',
    ends_at: '2024-07-12',
    total_amount: 3600,
    advance_amount: 3600,
    units: 3,
    currency: 'INR',
  },
]

const stateColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  started: 'bg-purple-100 text-purple-800 border-purple-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
}

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  partial: 'bg-orange-50 text-orange-700',
  completed: 'bg-green-50 text-green-700',
}

export default function BookingsList() {
  return (
    <div className="space-y-4">
      {mockBookings.length === 0 ? (
        <Alert>
          <AlertDescription>
            No bookings found. Start booking machinery to see them here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {mockBookings.map(booking => (
            <Card key={booking.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Booking Details */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{booking.machine_name}</h3>
                      <p className="text-sm text-muted-foreground">Booking #{booking.booking_number}</p>
                    </div>
                    <Badge className={stateColors[booking.booking_state]}>
                      {booking.booking_state.replace('_', ' ').charAt(0).toUpperCase() + booking.booking_state.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.starts_at).toLocaleDateString()} to {new Date(booking.ends_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Duration: {booking.units} {booking.units === 1 ? 'day' : 'days'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Operator: {booking.operator_name}
                    </div>
                  </div>
                </div>

                {/* Right side - Payment & Actions */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${paymentColors[booking.payment_status]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Payment Status</span>
                      <Badge variant="outline">
                        {booking.payment_status === 'completed'
                          ? '✓ Paid'
                          : booking.payment_status === 'partial'
                          ? 'Partial'
                          : 'Pending'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-semibold">₹{booking.total_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance Paid:</span>
                        <span className="font-semibold">₹{booking.advance_amount}</span>
                      </div>
                      {booking.payment_status !== 'completed' && (
                        <div className="flex justify-between pt-1 border-t">
                          <span>Remaining:</span>
                          <span className="font-bold">₹{booking.total_amount - booking.advance_amount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {booking.booking_state !== 'cancelled' && (
                      <>
                        {booking.payment_status !== 'completed' && (
                          <Button className="flex-1" size="sm">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Pay Now
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                        {booking.booking_state === 'confirmed' && (
                          <Button variant="destructive" size="sm">
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
