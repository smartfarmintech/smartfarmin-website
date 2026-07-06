'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, AlertCircle, CheckCircle, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { BookingWithMachine } from '@/lib/farmer/types'

interface BookingTrackerProps {
  booking: BookingWithMachine
}

export function BookingTracker({ booking }: BookingTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.5355, lng: 77.3910 })
  const [operatorLocation, setOperatorLocation] = useState({ lat: 28.5400, lng: 77.3950 })
  const [eta, setEta] = useState(12)
  const [isLive, setIsLive] = useState(booking.booking_state === 'in_progress')

  // Simulate operator movement
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setOperatorLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
      setEta((prev) => Math.max(0, prev - 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const TIMELINE = [
    {
      status: 'pending',
      label: 'Booking Created',
      completed: ['pending', 'confirmed', 'operator_assigned', 'in_progress', 'completed'].includes(booking.booking_state),
      timestamp: 'Jan 15, 8:00 AM',
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      completed: ['confirmed', 'operator_assigned', 'in_progress', 'completed'].includes(booking.booking_state),
      timestamp: 'Jan 15, 8:05 AM',
    },
    {
      status: 'operator_assigned',
      label: 'Operator Assigned',
      completed: ['operator_assigned', 'in_progress', 'completed'].includes(booking.booking_state),
      timestamp: 'Jan 15, 8:10 AM',
    },
    {
      status: 'in_progress',
      label: 'In Progress',
      completed: ['in_progress', 'completed'].includes(booking.booking_state),
      timestamp: 'Jan 15, 8:30 AM',
    },
    {
      status: 'completed',
      label: 'Completed',
      completed: ['completed'].includes(booking.booking_state),
      timestamp: 'Jan 15, 4:30 PM',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Live Location Card */}
      {isLive && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Location Tracking
              </h3>
              <p className="text-sm text-muted-foreground">Operator is {Math.round(Math.random() * 3 + 1)} km away</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{eta} min</p>
              <p className="text-xs text-muted-foreground">ETA</p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Your Location</p>
              <p className="font-semibold">{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-1">Operator Location</p>
              <p className="font-semibold">{operatorLocation.lat.toFixed(4)}, {operatorLocation.lng.toFixed(4)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Status Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Booking Status</h3>

        <div className="space-y-4">
          {TIMELINE.map((item, idx) => (
            <div key={item.status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    item.completed ? 'bg-green-100 text-green-700 scale-110' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {item.completed ? '✓' : idx + 1}
                </div>
                {idx < TIMELINE.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      item.completed ? 'bg-green-200' : 'bg-gray-200'
                    } my-1`}
                  />
                )}
              </div>

              <div className="flex-1 pt-1">
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>

              {booking.booking_state === item.status && (
                <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  Active
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Operator Card */}
      {booking.operator_id && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Your Operator</h3>

          <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
              RY
            </div>

            <div className="flex-1">
              <p className="font-semibold">Ramesh Yadav</p>
              <p className="text-sm text-muted-foreground">Verified Operator • 1000+ jobs</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </div>

            {isLive && (
              <div className="text-right">
                <div className="w-2 h-2 rounded-full bg-green-500 inline-block mb-1 animate-pulse" />
                <p className="text-xs text-green-600 font-semibold">On the way</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" disabled={!isLive}>
              <Phone className="h-4 w-4 mr-2" />
              Call Operator
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </Card>
      )}

      {/* Alerts Section */}
      {booking.booking_state === 'in_progress' && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Remember</p>
              <p className="text-sm text-yellow-800 mt-1">
                Ensure the field is cleared of obstacles and personnel before machinery arrives. Have water and refreshments ready for the operator.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Completion Notice */}
      {booking.booking_state === 'completed' && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Booking Completed</p>
              <p className="text-sm text-green-800 mt-1">
                Thank you for using SmartFarmin. Please review your experience to help other farmers.
              </p>
              <Button className="mt-3" size="sm">
                Write a Review
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
