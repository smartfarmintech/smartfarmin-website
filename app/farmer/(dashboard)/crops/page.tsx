import { requireFarmer, getCropCycles, getLands } from "@/lib/farmer/queries"
import { CropsManager } from "@/components/farmer/crops-manager"

export const dynamic = "force-dynamic"

export default async function CropsPage() {
  const { farmer } = await requireFarmer()
  const [crops, lands] = await Promise.all([getCropCycles(farmer.id), getLands(farmer.id)])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground">My Crops</h1>
        <p className="text-sm text-muted-foreground">
          Track every crop cycle across your land. Changes sync automatically when you&apos;re back online.
        </p>
      </header>
      <CropsManager initialCrops={crops} lands={lands} />
    </div>
  )
}
