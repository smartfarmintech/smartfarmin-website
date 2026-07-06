import { Suspense } from "react"
import { requireFarmer } from "@/lib/farmer/queries"
import { MachineryBookingWorkflow } from "@/components/machinery/booking-workflow"

export const metadata = {
  title: "Machinery Booking Flow | Smart Village Agriculture",
  description: "Complete machinery booking workflow with real-time tracking and support",
}

async function BookingFlowContent() {
  await requireFarmer()
  
  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Machinery Booking Workflow</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Complete journey from searching machinery to getting support - with real-time tracking, payments, reviews, and notifications
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-muted-foreground">Complete Steps</p>
            </div>
            <div>
              <p className="text-2xl font-bold">1000+</p>
              <p className="text-sm text-muted-foreground">Available Machines</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Verified Operators</p>
            </div>
          </div>
        </div>

        <MachineryBookingWorkflow />
      </div>
    </main>
  )
}

export default function BookingFlowPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading booking workflow...</div>}>
      <BookingFlowContent />
    </Suspense>
  )
}
