export const dynamic = 'force-dynamic'
export const metadata = { title: 'Drone Services | Farmer | Rythu360', description: 'Book drone services for spraying, surveys, and mapping' }

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Drone, MapPin, Star, Clock } from 'lucide-react'

async function getDroneServices() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: drones } = await supabase
    .from('machines')
    .select('*, pricing:pricing_rules(*)')
    .eq('machine_status', 'available')
    .limit(20)

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('renter_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return { drones: drones || [], bookings: bookings || [] }
}

export default async function DronesPage() {
  const data = await getDroneServices()
  if (!data) redirect('/login/farmer')

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Drone Services</h1>
          <p className="text-muted-foreground">Spray, survey, or map your fields with drones</p>
        </div>
        <Button>Request Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.drones.map((drone: any) => (
          <Card key={drone.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold">{drone.name}</h3>
                <p className="text-sm text-muted-foreground">{drone.brand} {drone.model}</p>
              </div>
              <Drone className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{drone.rating_avg?.toFixed(1) || 'No'} stars ({drone.rating_count || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{drone.base_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>₹{drone.pricing?.[0]?.price || 'TBD'}/hour</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" asChild className="flex-1">
                <a href={`/dashboard/farmer/drones/${drone.id}`}>View</a>
              </Button>
              <Button size="sm" variant="outline" className="flex-1">Book</Button>
            </div>
          </Card>
        ))}
      </div>

      {data.bookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Your Bookings</h2>
          <div className="space-y-2">
            {data.bookings.map((booking: any) => (
              <Card key={booking.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Booking #{booking.booking_number}</p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.starts_at).toLocaleDateString()}</p>
                </div>
                <Badge>{booking.booking_state}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
