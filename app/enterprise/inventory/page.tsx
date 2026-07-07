"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Zap,
  Search,
  Filter,
  Download,
} from "lucide-react"

const inventoryItems = [
  {
    id: "inv-001",
    sku: "FERT-NPK-10-26-26",
    productName: "NPK Fertilizer 10-26-26",
    category: "Fertilizers",
    quantity: 45,
    reorderLevel: 20,
    costPerUnit: 850,
    warehouseLocation: "A-1-05",
    lastRestocked: "2025-06-10",
    expiryDate: "2026-12-31",
    status: "in_stock",
  },
  {
    id: "inv-002",
    sku: "PSTD-CHLOR-500",
    productName: "Chlorpyrifos 500g Bottle",
    category: "Pesticides",
    quantity: 8,
    reorderLevel: 15,
    costPerUnit: 1200,
    warehouseLocation: "B-2-03",
    lastRestocked: "2025-05-28",
    expiryDate: "2025-12-15",
    status: "low_stock",
  },
  {
    id: "inv-003",
    sku: "SEED-CORN-HYBRID",
    productName: "Corn Hybrid Seeds 25kg",
    category: "Seeds",
    quantity: 0,
    reorderLevel: 10,
    costPerUnit: 45000,
    warehouseLocation: "C-1-01",
    lastRestocked: "2025-03-15",
    expiryDate: "2025-11-30",
    status: "out_of_stock",
  },
  {
    id: "inv-004",
    sku: "FERT-UREA-46",
    productName: "Urea 46% Nitrogen",
    category: "Fertilizers",
    quantity: 120,
    reorderLevel: 25,
    costPerUnit: 620,
    warehouseLocation: "A-2-10",
    lastRestocked: "2025-06-15",
    expiryDate: "2027-06-30",
    status: "in_stock",
  },
  {
    id: "inv-005",
    sku: "TOOL-SPRAYER-MANUAL",
    productName: "Manual Knapsack Sprayer 16L",
    category: "Equipment",
    quantity: 12,
    reorderLevel: 5,
    costPerUnit: 2800,
    warehouseLocation: "D-1-02",
    lastRestocked: "2025-04-20",
    expiryDate: null,
    status: "in_stock",
  },
]

export default function InventoryManagementPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesStatus = !filterStatus || item.status === filterStatus
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalInventoryValue = inventoryItems.reduce(
    (sum, item) => sum + item.quantity * item.costPerUnit,
    0
  )
  const lowStockCount = inventoryItems.filter((i) => i.status === "low_stock").length
  const outOfStockCount = inventoryItems.filter((i) => i.status === "out_of_stock").length

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Inventory Management</h1>
            <p className="text-slate-400 mt-2">Track stock levels, manage reorders, and warehouse locations</p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Items</p>
                <p className="text-3xl font-bold text-white mt-2">{inventoryItems.length}</p>
              </div>
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Inventory Value</p>
                <p className="text-2xl font-bold text-emerald-400 mt-2">
                  ₹{(totalInventoryValue / 100000).toFixed(1)}L
                </p>
              </div>
              <TrendingDown className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Low Stock</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">{lowStockCount}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Out of Stock</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{outOfStockCount}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-xs">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <Filter className="w-4 h-4 text-slate-400" />
          <Button
            onClick={() => setFilterStatus(null)}
            variant={filterStatus === null ? "default" : "outline"}
            size="sm"
            className={filterStatus === null ? "bg-emerald-600" : ""}
          >
            All Items
          </Button>
          <Button
            onClick={() => setFilterStatus("in_stock")}
            variant={filterStatus === "in_stock" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "in_stock" ? "bg-emerald-600" : ""}
          >
            In Stock
          </Button>
          <Button
            onClick={() => setFilterStatus("low_stock")}
            variant={filterStatus === "low_stock" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "low_stock" ? "bg-amber-600" : ""}
          >
            Low Stock
          </Button>
          <Button
            onClick={() => setFilterStatus("out_of_stock")}
            variant={filterStatus === "out_of_stock" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "out_of_stock" ? "bg-red-600" : ""}
          >
            Out of Stock
          </Button>
          <div className="ml-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <Card className="card-glass">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-slate-400 text-sm font-semibold">
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Reorder Level</th>
                    <th className="p-4">Unit Cost</th>
                    <th className="p-4">Total Value</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Expiry</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-white">{item.productName}</span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">{item.sku}</td>
                      <td className="p-4 text-slate-300">{item.category}</td>
                      <td className="p-4">
                        <span className="text-lg font-bold text-white">{item.quantity}</span>
                      </td>
                      <td className="p-4 text-slate-300">{item.reorderLevel}</td>
                      <td className="p-4 text-slate-300">₹{item.costPerUnit}</td>
                      <td className="p-4 text-emerald-400 font-semibold">
                        ₹{(item.quantity * item.costPerUnit).toLocaleString()}
                      </td>
                      <td className="p-4 text-slate-300">{item.warehouseLocation}</td>
                      <td className="p-4 text-slate-400">
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "in_stock"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.status === "low_stock"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.status === "in_stock" && <CheckCircle2 className="w-3 h-3" />}
                          {item.status !== "in_stock" && <AlertTriangle className="w-3 h-3" />}
                          {item.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Reorder Recommendations */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Reorder Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryItems
              .filter((item) => item.quantity <= item.reorderLevel)
              .map((item) => (
                <Card key={item.id} className="card-glass p-4 border-l-4 border-l-amber-400">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Current: {item.quantity} units | Minimum: {item.reorderLevel} units
                      </p>
                      <p className="text-sm text-emerald-400 mt-2">
                        Suggested Order: {Math.max(50, item.reorderLevel * 3)} units
                      </p>
                    </div>
                    <Button size="sm" className="btn-primary">
                      Create PO
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
