import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getMachineDetail, requireFarmer } from "@/lib/farmer/queries"
import { MachineDetailClient } from "@/components/farmer/machine-detail-client"

export const metadata = {
  title: "Machine Details | Smart Village Agriculture",
  description: "View machine details and create a booking",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MachineDetailPage(props: PageProps) {
  await requireFarmer()
  const params = await props.params
  const machine = await getMachineDetail(params.id)

  if (!machine) {
    notFound()
  }

  return (
    <main className="flex-1 overflow-auto">
      <Suspense fallback={<div className="text-center py-12">Loading machine details...</div>}>
        <MachineDetailClient machine={machine} />
      </Suspense>
    </main>
  )
}
