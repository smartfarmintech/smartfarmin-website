'use client'

import { useState, useEffect } from 'react'
import { Plane, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DroneStats {
  available_drones: number
  active_bookings: number
  completed_jobs: number
  upcoming_jobs: number
  total_flight_hours: number
  service_status: 'operational' | 'maintenance' | 'alert'
}

interface DroneDashboardProps {
  stats?: DroneStats
  isOperator?: boolean
}

export function DroneDashboard({ stats, isOperator = false }: DroneDashboardProps) {
  const [dashboardStats, setDashboardStats] = useState<DroneStats>(
    stats || {
      available_drones: 12,
      active_bookings: 5,
      completed_jobs: 127,
      upcoming_jobs: 8,
      total_flight_hours: 580,
      service_status: 'operational',
    },
  )

  const statCards = [
    {
      title: isOperator ? 'Available Drones' : 'Nearby Drones',
      value: dashboardStats.available_drones,
      icon: Plane,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Active Bookings',
      value: dashboardStats.active_bookings,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Completed Jobs',
      value: dashboardStats.completed_jobs,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Upcoming Jobs',
      value: dashboardStats.upcoming_jobs,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Service Status Alert */}
      <Card className={dashboardStats.service_status === 'alert' ? 'border-red-200 bg-red-50' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-600" />
              <CardTitle className="text-base">Service Status</CardTitle>
            </div>
            <Badge
              variant={dashboardStats.service_status === 'operational' ? 'default' : 'destructive'}
            >
              {dashboardStats.service_status === 'operational'
                ? 'All Systems Operational'
                : dashboardStats.service_status === 'maintenance'
                  ? 'Maintenance in Progress'
                  : 'Alert: Attention Required'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Flight Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Flight Analytics</CardTitle>
          <CardDescription>Total flight hours and operational metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Flight Hours</p>
              <p className="text-3xl font-bold">{dashboardStats.total_flight_hours}</p>
              <p className="text-xs text-green-600">↑ 12% this month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Acres/Day</p>
              <p className="text-3xl font-bold">
                {Math.round((dashboardStats.total_flight_hours / 4) * 8 / 30)}
              </p>
              <p className="text-xs text-green-600">↑ 8% this month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold">96%</p>
              <p className="text-xs text-amber-600">2 jobs rescheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        {isOperator ? (
          <>
            <Button asChild className="w-full">
              <Link href="/drone-operator/bookings">View Pending Bookings</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/drone-operator/fleet">Manage Fleet</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild className="w-full">
              <Link href="/drone-services/booking">Book a Drone</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/drone-services/tracking">View Bookings</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
