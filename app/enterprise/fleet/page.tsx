import { FleetDashboard } from "@/components/enterprise/fleet-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Fleet Management | SmartFarming",
  description: "Manage and track your agricultural fleet with GPS monitoring and maintenance scheduling",
}

export default function FleetPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground mt-2">Monitor, track, and maintain your agricultural equipment</p>
        </div>
        <Link href="/enterprise/fleet/register">
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Register Machine
          </Button>
        </Link>
      </div>

      {/* Fleet Dashboard */}
      <FleetDashboard />
    </div>
  )
}
