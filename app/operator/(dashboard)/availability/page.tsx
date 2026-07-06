import { requireOwner, getAvailability, getMachines } from "@/lib/operator/queries"
import { AvailabilityManager } from "@/components/operator/availability-manager"

export default async function OperatorAvailabilityPage() {
  const { userId } = await requireOwner()
  const [slots, machines] = await Promise.all([getAvailability(), getMachines(userId)])

  return <AvailabilityManager initialSlots={slots} machines={machines} />
}
