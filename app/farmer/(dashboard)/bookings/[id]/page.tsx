import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getBooking, requireFarmer } from "@/lib/farmer/queries"
import { BookingDetailClient } from "@/components/farmer/booking-detail-client"

export const metadata = {
  title: "Booking Details | Smart Village Agriculture",
  description: "View booking details and track progress",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage(props: PageProps) {
  await requireFarmer()
  const params = await props.params
  const booking = await getBooking(params.id)

  if (!booking) {
    notFound()
  }

  return (
    <main className="flex-1 overflow-auto">
      <Suspense fallback={<div className="text-center py-12">Loading booking details...</div>}>
        <BookingDetailClient booking={booking} />
      </Suspense>
    </main>
  )
}
