import { Suspense } from "react"
import Link from "next/link"
import { requireFarmer } from "@/lib/farmer/queries"
import { BookingsListServer } from "@/components/farmer/bookings-list-server"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "My Bookings | Smart Village Agriculture",
  description: "View and manage your machinery bookings",
}

export default async function BookingsPage() {
  await requireFarmer()

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="mt-2 text-base text-muted-foreground">
              View and manage your machinery rental bookings
            </p>
          </div>
          <Link href="/farmer/machinery">
            <Button>Browse Machinery</Button>
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12">Loading bookings...</div>}>
          <BookingsListServer />
        </Suspense>
      </div>
    </main>
  )
}
