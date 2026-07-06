import { requireOwner, getMaintenance, getMachines } from "@/lib/operator/queries"
import { MaintenanceManager } from "@/components/operator/maintenance-manager"

export default async function OperatorMaintenancePage() {
  const { userId } = await requireOwner()
  const [records, machines] = await Promise.all([getMaintenance(), getMachines(userId)])

  return <MaintenanceManager initialRecords={records} machines={machines} />
}
