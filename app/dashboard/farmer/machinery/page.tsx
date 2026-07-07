import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MachinerySearch from '@/components/farmer/machinery/machinery-search'
import MachineryList from '@/components/farmer/machinery/machinery-list'
import BookingsList from '@/components/farmer/machinery/bookings-list'
import LoadingSpinner from '@/components/ui/loading-spinner'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Machinery Booking | Farmer Dashboard | Rythu360',
  description: 'Browse and book farm machinery and equipment'
}

async function getMachineries(searchParams: { category?: string; location?: string; priceRange?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let query = supabase
    .from('machines')
    .select(`
      *,
      operator:operators(id, full_name, rating_avg, rating_count),
      pricing_rules:pricing_rules(id, price, unit, valid_from, valid_until),
      reviews:machine_reviews(id, rating, body, created_at)
    `)
    .eq('machine_status', 'available')
    .limit(20)

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

async function getMyBookings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!farmer) return null

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      machine:machines(id, name, brand, image_url, category_id),
      operator:operators(id, full_name, phone),
      payments:booking_payments(id, amount, payment_status, paid_at)
    `)
    .eq('renter_id', farmer.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

export default async function MachineryPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Machinery Booking</h1>
        <p className="text-muted-foreground">Browse, book, and manage farm equipment rentals</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Machinery</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <MachinerySearch />
          <Suspense fallback={<LoadingSpinner />}>
            <MachineryList />
          </Suspense>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <BookingsList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
