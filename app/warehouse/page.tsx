import { WarehouseDashboard } from "@/components/warehouse/warehouse-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Warehouse & Inventory | SmartFarming",
  description: "Manage warehouse locations, inventory, and stock movements across your supply chain",
}

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouse & Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage your warehouse locations, stock levels, and supply chain</p>
        </div>
        <div className="flex gap-2">
          <Link href="/warehouse/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              New Warehouse
            </Button>
          </Link>
        </div>
      </div>

      {/* Warehouse Dashboard */}
      <WarehouseDashboard />
    </div>
  )
}
