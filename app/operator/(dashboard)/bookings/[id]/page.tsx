import { notFound } from "next/navigation"
import { requireOwner, getBooking, getBookingTimeline, getOperators } from "@/lib/operator/queries"
import { BookingDetailClient } from "@/components/operator/booking-detail-client"

export default async function OperatorBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await requireOwner()

  const [booking, operators] = await Promise.all([getBooking(id), getOperators(userId)])
  if (!booking) notFound()

  const timeline = await getBookingTimeline(booking.id)

  const activeOperators = operators.filter((o) => o.operator_status === "active")

  return <BookingDetailClient booking={booking} timeline={timeline} operators={activeOperators} />
}
