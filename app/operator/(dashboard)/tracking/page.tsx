import { requireOwner, getRecentTracking, getMachines } from "@/lib/operator/queries"
import { TrackingClient } from "@/components/operator/tracking-client"

export default async function OperatorTrackingPage() {
  const { userId } = await requireOwner()
  const [pings, machines] = await Promise.all([getRecentTracking(), getMachines(userId)])

  return <TrackingClient initialPings={pings} machines={machines} />
}
