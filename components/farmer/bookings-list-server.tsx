import { getFarmerBookings } from "@/lib/farmer/queries"
import { BookingsListClient } from "./bookings-list-client"

export async function BookingsListServer() {
  const bookings = await getFarmerBookings()

  return <BookingsListClient initialBookings={bookings} />
}
