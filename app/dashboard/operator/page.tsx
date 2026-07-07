import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Grid, Users, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import OperatorOverview from '@/components/operator/operator-overview'
import BookingRequestsList from '@/components/operator/booking-requests-list'
import TodaysJobs from '@/components/operator/todays-jobs'
import OperatorEarnings from '@/components/operator/operator-earnings'
import OperatorMachines from '@/components/operator/operator-machines'
import LoadingSpinner from '@/components/ui/loading-spinner'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Operator Dashboard | Rythu360',
  description: 'Manage machinery bookings and earnings'
}

export default async function OperatorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
        <p className="text-muted-foreground">Manage your machinery bookings and earnings</p>
      </div>

      {/* Overview Cards */}
      <Suspense fallback={<LoadingSpinner />}>
        <OperatorOverview />
      </Suspense>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="requests" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="machines" className="gap-2">
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Machines</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
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

        <TabsContent value="machines" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <OperatorMachines />
          </Suspense>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <OperatorEarnings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
