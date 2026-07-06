import { requireOwner, getBookings } from "@/lib/operator/queries"
import { BookingsManager } from "@/components/operator/bookings-manager"

export default async function OperatorBookingsPage() {
  const { userId } = await requireOwner()
  const bookings = await getBookings(userId)

  return <BookingsManager initialBookings={bookings} />
}
