import { requireOwner, getMachines, getCategories } from "@/lib/operator/queries"
import { MachinesManager } from "@/components/operator/machines-manager"

export default async function OperatorMachinesPage() {
  const { userId } = await requireOwner()
  const [machines, categories] = await Promise.all([getMachines(userId), getCategories()])

  return <MachinesManager initialMachines={machines} categories={categories} />
}
