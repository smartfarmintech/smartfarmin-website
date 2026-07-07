"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Layers,
  Clock,
  MapPin,
  BarChart3,
  Plus,
  Truck,
  Archive,
  X,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface WarehouseDashboardProps {
  warehouseId?: string
  organizationId?: string
}

export function WarehouseDashboard({ warehouseId, organizationId }: WarehouseDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "alerts" | "movements">("overview")

  // Mock data - In real app, fetch from database
  const warehouseData = {
    totalItems: 15420,
    totalValue: 2845000,
    lowStockCount: 12,
    outOfStockCount: 2,
    productCount: 156,
  }

  const categoryData = [
    { name: "Fertilizers", value: 5200, percentage: 34 },
    { name: "Pesticides", value: 3100, percentage: 20 },
    { name: "Seeds", value: 2800, percentage: 18 },
    { name: "Equipment", value: 2400, percentage: 16 },
    { name: "Irrigation", value: 1520, percentage: 10 },
    { name: "Organic", value: 400, percentage: 2 },
  ]

  const movementData = [
    { date: "Jul 1", inbound: 420, outbound: 320 },
    { date: "Jul 2", inbound: 380, outbound: 450 },
    { date: "Jul 3", inbound: 520, outbound: 380 },
    { date: "Jul 4", inbound: 640, outbound: 500 },
    { date: "Jul 5", inbound: 480, outbound: 420 },
    { date: "Jul 6", inbound: 750, outbound: 620 },
    { date: "Jul 7", inbound: 850, outbound: 720 },
  ]

  const lowStockItems = [
    { id: 1, name: "Urea 46% NPK", category: "Fertilizer", quantity: 85, unit: "bags", reorderLevel: 200 },
    { id: 2, name: "DAP 18:46 NPK", category: "Fertilizer", quantity: 120, unit: "bags", reorderLevel: 250 },
    { id: 3, name: "Copper Oxychloride", category: "Pesticide", quantity: 15, unit: "litres", reorderLevel: 50 },
  ]

  const recentMovements = [
    {
      id: 1,
      type: "outbound",
      product: "Urea 46% NPK",
      quantity: 150,
      unit: "bags",
      reason: "Booking #BK-2025-001",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "inbound",
      product: "DAP 18:46 NPK",
      quantity: 500,
      unit: "bags",
      reason: "Purchase Order #PO-2025-045",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "transfer",
      product: "Hybrid Maize Seed",
      quantity: 50,
      unit: "bags",
      reason: "Transfer to Regional Warehouse",
      time: "1 day ago",
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Items</p>
              <p className="text-3xl font-bold text-white mt-2">{warehouseData.totalItems.toLocaleString()}</p>
              <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
            </div>
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-3xl font-bold text-white mt-2">₹{(warehouseData.totalValue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-emerald-400 mt-1">+8% from last month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Low Stock</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{warehouseData.lowStockCount}</p>
              <p className="text-xs text-amber-400 mt-1">Needs reorder</p>
            </div>
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Out of Stock</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{warehouseData.outOfStockCount}</p>
              <p className="text-xs text-red-400 mt-1">Critical</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Product Types</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">{warehouseData.productCount}</p>
              <p className="text-xs text-purple-400 mt-1">Across 6 categories</p>
            </div>
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {(["overview", "inventory", "alerts", "movements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card className="card-glass p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Archive className="w-5 h-5 text-cyan-400" />
              Inventory by Category
            </h3>
            <div className="space-y-3">
              {categoryData.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">{category.name}</span>
                    <span className="text-sm font-semibold text-white">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Stock Movement Chart */}
          <Card className="card-glass p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Weekly Movements
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 40, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="inbound" fill="#10b981" name="Inbound" />
                <Bar dataKey="outbound" fill="#f59e0b" name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Stock Levels</h3>
            <Button size="sm" className="btn-primary gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    {item.category} • Stock: {item.quantity} {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-400">{item.quantity}</p>
                    <p className="text-xs text-slate-500">Reorder: {item.reorderLevel}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <Card className="card-glass p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{item.name} - Low Stock</p>
                    <p className="text-sm text-slate-400">
                      Current: {item.quantity} {item.unit} / Minimum: {item.reorderLevel}
                    </p>
                  </div>
                </div>
                <Button size="sm" className="gap-2">
                  <Truck className="w-4 h-4" />
                  Order Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Movements Tab */}
      {activeTab === "movements" && (
        <Card className="card-glass p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Movements
          </h3>
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      movement.type === "inbound"
                        ? "bg-emerald-500/20"
                        : movement.type === "outbound"
                          ? "bg-amber-500/20"
                          : "bg-cyan-500/20"
                    }`}
                  >
                    {movement.type === "inbound" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {movement.type === "outbound" && <TrendingDown className="w-4 h-4 text-amber-400" />}
                    {movement.type === "transfer" && <Truck className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white capitalize">{movement.type}</p>
                    <p className="text-sm text-slate-400">
                      {movement.product} • {movement.quantity} {movement.unit}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{movement.reason}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{movement.time}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
