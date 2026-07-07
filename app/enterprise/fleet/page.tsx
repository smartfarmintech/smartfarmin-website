"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck,
  Plus,
  MapPin,
  Wrench,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Filter,
  Download,
} from "lucide-react"

const fleetAssets = [
  {
    id: "asset-001",
    brand: "Mahindra",
    model: "450 DI",
    registrationNo: "MH-15-AB-1234",
    type: "tractor",
    status: "operational",
    utilizationHours: 1240,
    lastMaintenance: "2025-06-15",
    nextMaintenance: "2025-09-15",
    operator: "Rajesh Kumar",
    location: "Field A",
    fuelType: "Diesel",
    costPrice: 850000,
  },
  {
    id: "asset-002",
    brand: "John Deere",
    model: "CH570",
    registrationNo: "MH-15-CD-5678",
    type: "harvester",
    status: "operational",
    utilizationHours: 890,
    lastMaintenance: "2025-05-20",
    nextMaintenance: "2025-08-20",
    operator: "Priya Sharma",
    location: "Field B",
    costPrice: 2500000,
  },
  {
    id: "asset-003",
    brand: "DJI",
    model: "T30",
    registrationNo: "DJI-AG-001",
    type: "drone",
    status: "maintenance",
    utilizationHours: 156,
    lastMaintenance: "2025-06-10",
    nextMaintenance: "2025-07-10",
    operator: "Arjun Singh",
    location: "Workshop",
    costPrice: 750000,
  },
  {
    id: "asset-004",
    brand: "Yamaha",
    model: "MX1800",
    registrationNo: "MH-15-EF-9012",
    type: "sprayer",
    status: "operational",
    utilizationHours: 680,
    lastMaintenance: "2025-04-05",
    nextMaintenance: "2025-10-05",
    operator: "Vikram Patel",
    location: "Field C",
    costPrice: 450000,
  },
]

export default function FleetManagementPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredAssets = filterStatus
    ? fleetAssets.filter((a) => a.status === filterStatus)
    : fleetAssets

  const operationalCount = fleetAssets.filter((a) => a.status === "operational").length
  const maintenanceCount = fleetAssets.filter((a) => a.status === "maintenance").length
  const totalUtilization =
    (fleetAssets.reduce((sum, a) => sum + a.utilizationHours, 0) / (fleetAssets.length * 1500)) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Fleet Management</h1>
            <p className="text-slate-400 mt-2">Manage machinery, maintenance, and GPS tracking</p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Assets</p>
                <p className="text-3xl font-bold text-white mt-2">{fleetAssets.length}</p>
              </div>
              <Truck className="w-5 h-5 text-cyan-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Operational</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{operationalCount}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">In Maintenance</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">{maintenanceCount}</p>
              </div>
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Utilization</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">{Math.round(totalUtilization)}%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <Button
            onClick={() => setFilterStatus(null)}
            variant={filterStatus === null ? "default" : "outline"}
            size="sm"
            className={filterStatus === null ? "bg-emerald-600" : ""}
          >
            All Assets
          </Button>
          <Button
            onClick={() => setFilterStatus("operational")}
            variant={filterStatus === "operational" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "operational" ? "bg-emerald-600" : ""}
          >
            Operational
          </Button>
          <Button
            onClick={() => setFilterStatus("maintenance")}
            variant={filterStatus === "maintenance" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "maintenance" ? "bg-amber-600" : ""}
          >
            Maintenance
          </Button>
          <div className="ml-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Fleet Assets Table */}
        <div className="overflow-x-auto">
          <Card className="card-glass">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-slate-400 text-sm font-semibold">
                    <th className="p-4">Asset</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Registration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Operator</th>
                    <th className="p-4">Hours Used</th>
                    <th className="p-4">Next Maintenance</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-white">{asset.brand} {asset.model}</p>
                          <p className="text-xs text-slate-400">{asset.location}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 capitalize">
                          {asset.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{asset.registrationNo}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              asset.status === "operational" ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          <span className="text-sm capitalize text-slate-300">
                            {asset.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{asset.operator}</td>
                      <td className="p-4 text-slate-300">{asset.utilizationHours} hrs</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{asset.nextMaintenance}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Maintenance Schedule Alert */}
        <div className="mt-8">
          <Card className="card-glass p-6 border-l-4 border-l-amber-400">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-2">Upcoming Maintenance</h3>
                <p className="text-slate-400">
                  2 assets require maintenance in the next 30 days. Schedule maintenance now to avoid downtime.
                </p>
                <Button className="mt-4 btn-secondary" size="sm">
                  View Maintenance Schedule
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
