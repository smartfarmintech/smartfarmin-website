import { Suspense } from "react"
import { requireFarmer } from "@/lib/farmer/queries"
import { MachineryGalleryServer } from "@/components/farmer/machinery-gallery-server"

export const metadata = {
  title: "Find Machinery | Smart Village Agriculture",
  description: "Browse and book farm machinery from verified owners in your area",
}

export default async function MachineryPage() {
  await requireFarmer()

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Machinery</h1>
            <p className="mt-2 text-base text-muted-foreground">
              Browse available machinery and equipment for your farming needs
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-12">Loading machinery...</div>}>
          <MachineryGalleryServer />
        </Suspense>
      </div>
    </main>
  )
}
