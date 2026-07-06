'use client'

import { useState, useEffect } from 'react'
import { Plane, MapPin, Battery, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Timeline, type TimelineItem } from '@/components/ui/timeline'

interface FlightStatus {
  flight_id: string
  booking_id: string
  drone_id: string
  status: 'scheduled' | 'preparing' | 'in_flight' | 'completed' | 'cancelled'
  current_altitude_m: number
  current_speed_kmph: number
  battery_percent: number
  coverage_percent: number
  area_covered_acres: number
  flight_time_minutes: number
  eta_minutes: number
  waypoint_index: number
  total_waypoints: number
  crop_analysis: any
  post_flight_report: any
}

interface FlightTrackerProps {
  flightData?: FlightStatus
  bookingId?: string
}

export function FlightTracker({ flightData, bookingId }: FlightTrackerProps) {
  const [flight, setFlight] = useState<FlightStatus>(
    flightData || {
      flight_id: `FLIGHT-${Date.now()}`,
      booking_id: bookingId || '',
      drone_id: 'DJI-001',
      status: 'in_flight',
      current_altitude_m: 45,
      current_speed_kmph: 28,
      battery_percent: 68,
      coverage_percent: 65,
      area_covered_acres: 1.3,
      flight_time_minutes: 18,
      eta_minutes: 9,
      waypoint_index: 8,
      total_waypoints: 15,
      crop_analysis: {
        stress_level: 'medium',
        affected_area: 15,
      },
      post_flight_report: null,
    },
  )

  useEffect(() => {
    // Simulate live flight updates
    if (flight.status === 'in_flight') {
      const interval = setInterval(() => {
        setFlight((prev) => {
          if (prev.battery_percent <= 5 || prev.waypoint_index >= prev.total_waypoints) {
            return { ...prev, status: 'completed' }
          }

          return {
            ...prev,
            current_altitude_m: Math.max(prev.current_altitude_m - 0.5, 40),
            current_speed_kmph: 25 + Math.random() * 5,
            battery_percent: Math.max(prev.battery_percent - 0.5, 0),
            coverage_percent: Math.min(prev.coverage_percent + 2, 100),
            area_covered_acres: prev.area_covered_acres + 0.1,
            flight_time_minutes: prev.flight_time_minutes + 0.5,
            eta_minutes: Math.max(prev.eta_minutes - 0.5, 0),
            waypoint_index: prev.waypoint_index + (Math.random() > 0.7 ? 1 : 0),
          }
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [flight.status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gray-50 text-gray-700'
      case 'preparing':
        return 'bg-blue-50 text-blue-700'
      case 'in_flight':
        return 'bg-green-50 text-green-700'
      case 'completed':
        return 'bg-emerald-50 text-emerald-700'
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50'
    }
  }

  const statusLabel = {
    scheduled: 'Scheduled',
    preparing: 'Preparing Drone',
    in_flight: 'In Flight',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  const timeline: TimelineItem[] = [
    {
      status: 'completed' as const,
      title: 'Booking Confirmed',
      description: 'Farmer booked drone service',
      timestamp: '08:00 AM',
    },
    {
      status: 'completed' as const,
      title: 'Operator Assigned',
      description: 'Certified pilot assigned to job',
      timestamp: '08:15 AM',
    },
    {
      status: flight.status === 'in_flight' || flight.status === 'completed' ? 'completed' : 'current',
      title: 'Flight Started',
      description: 'Drone taking off and executing flight plan',
      timestamp: '08:45 AM',
    },
    {
      status: flight.status === 'completed' ? 'completed' : 'pending',
      title: 'Flight Completed',
      description: 'Post-flight analysis and report generation',
      timestamp: '09:00 AM',
    },
    {
      status: flight.status === 'completed' ? 'completed' : 'pending',
      title: 'Farmer Review',
      description: 'Review results and submit rating',
      timestamp: 'Pending',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={getStatusColor(flight.status)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="size-6" />
              <div>
                <CardTitle className="text-lg">{flight.flight_id}</CardTitle>
                <CardDescription className="text-xs">Live Flight Tracking</CardDescription>
              </div>
            </div>
            <Badge variant={flight.status === 'in_flight' ? 'default' : 'secondary'}>
              {statusLabel[flight.status as keyof typeof statusLabel]}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Live Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Altitude</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(flight.current_altitude_m)}m</p>
            <p className="text-xs text-muted-foreground mt-1">Above ground level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Speed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(flight.current_speed_kmph)}</p>
            <p className="text-xs text-muted-foreground mt-1">km/h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Battery</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(flight.battery_percent)}%</p>
            <Progress value={flight.battery_percent} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">ETA</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.max(0, flight.eta_minutes).toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">minutes remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flight Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Coverage Complete</p>
              <Badge variant="secondary">{Math.round(flight.coverage_percent)}%</Badge>
            </div>
            <Progress value={flight.coverage_percent} className="h-3" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-muted-foreground">Area Covered</p>
              <p className="text-lg font-semibold">{flight.area_covered_acres.toFixed(1)} acres</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <p className="text-xs text-muted-foreground">Flight Time</p>
              <p className="text-lg font-semibold">{Math.round(flight.flight_time_minutes)} min</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-muted-foreground">Waypoints</p>
              <p className="text-lg font-semibold">
                {flight.waypoint_index}/{flight.total_waypoints}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline items={timeline} />
        </CardContent>
      </Card>

      {/* Live Analysis (if completed) */}
      {flight.crop_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Crop Analysis</CardTitle>
            <CardDescription>Real-time analysis from drone cameras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Crop Stress Level</p>
                  <Badge
                    variant={
                      flight.crop_analysis.stress_level === 'high'
                        ? 'destructive'
                        : flight.crop_analysis.stress_level === 'medium'
                          ? 'secondary'
                          : 'default'
                    }
                  >
                    {flight.crop_analysis.stress_level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flight.crop_analysis.affected_area}% affected area detected
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-2">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <p className="text-sm">Analysis in progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post-Flight Report (if completed) */}
      {flight.status === 'completed' && flight.post_flight_report && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base text-green-900">Flight Completed Successfully</CardTitle>
            <CardDescription className="text-green-800">
              Post-flight report and analysis ready for review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Coverage</p>
                <p className="text-xl font-bold">100%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quality</p>
                <p className="text-xl font-bold">Excellent</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Images Captured</p>
                <p className="text-xl font-bold">2,847</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Processing Time</p>
                <p className="text-xl font-bold">15 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
