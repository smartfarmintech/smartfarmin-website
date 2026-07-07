import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadingSpinner from '@/components/ui/loading-spinner'
import BookingRequestsList from '@/components/operator/booking-requests-list'
import TodaysJobs from '@/components/operator/todays-jobs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bookings & Jobs | Operator Dashboard | Rythu360',
  description: 'Manage machinery booking requests and daily jobs'
}

export default async function OperatorBookingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings & Jobs</h1>
        <p className="text-muted-foreground">Manage booking requests and schedule daily jobs</p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          <TabsTrigger value="jobs">Today&apos;s Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <BookingRequestsList />
          </Suspense>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <TodaysJobs />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
