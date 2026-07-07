"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Download,
  Plus,
  Calendar,
  TrendingUp,
  Zap,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
} from "lucide-react"

const reports = [
  {
    id: "report-001",
    name: "Fleet Utilization Report",
    type: "fleet_utilization",
    period: "June 2025",
    generated: "2025-07-01",
    metrics: {
      totalAssets: 4,
      operationalAssets: 3,
      underMaintenance: 1,
      averageUtilization: 72,
      totalHours: 2966,
      costPerHour: 250,
    },
    status: "completed",
    size: "2.4 MB",
  },
  {
    id: "report-002",
    name: "Inventory Summary",
    type: "inventory_summary",
    period: "June 2025",
    generated: "2025-07-01",
    metrics: {
      totalItems: 5,
      lowStockItems: 1,
      outOfStockItems: 1,
      totalValue: 3850000,
      reorderCost: 125000,
      movement: "8 transactions",
    },
    status: "completed",
    size: "1.8 MB",
  },
  {
    id: "report-003",
    name: "Maintenance Schedule",
    type: "maintenance_schedule",
    period: "July 2025",
    generated: "2025-07-01",
    metrics: {
      upcoming: 2,
      overdue: 0,
      completed: 3,
      totalCost: 45000,
      averageDuration: "2.5 days",
      providers: 2,
    },
    status: "completed",
    size: "1.5 MB",
  },
  {
    id: "report-004",
    name: "Revenue Analysis",
    type: "revenue_analysis",
    period: "H1 2025",
    generated: "2025-07-01",
    metrics: {
      totalRevenue: 2450000,
      growtRate: "18%",
      topService: "Machinery Rental",
      topRegion: "Maharashtra",
      avgOrderValue: 125000,
      repeatCustomers: "62%",
    },
    status: "completed",
    size: "3.2 MB",
  },
]

const reportTypes = {
  fleet_utilization: {
    title: "Fleet Utilization Report",
    description: "Track machinery usage, efficiency, and maintenance schedules",
    icon: BarChart3,
  },
  inventory_summary: {
    title: "Inventory Summary",
    description: "Monitor stock levels, reorder points, and inventory value",
    icon: PieChart,
  },
  maintenance_schedule: {
    title: "Maintenance Schedule",
    description: "Track preventive and corrective maintenance activities",
    icon: Zap,
  },
  revenue_analysis: {
    title: "Revenue Analysis",
    description: "Analyze business performance and revenue trends",
    icon: LineChart,
  },
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Business Reports</h1>
            <p className="text-slate-400 mt-2">Generate and download comprehensive business analytics</p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>

        {/* Report Type Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Report Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(reportTypes).map(([key, report]) => {
              const Icon = report.icon
              return (
                <Card
                  key={key}
                  onClick={() => setReportType(reportType === key ? null : key)}
                  className={`card-glass p-4 cursor-pointer transition-all ${
                    reportType === key ? "border-emerald-500/50 bg-emerald-500/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    {reportType === key && (
                      <div className="w-4 h-4 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-slate-400">{report.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
            <Button size="sm" variant="ghost" className="gap-2 text-slate-400 hover:text-slate-300">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className="card-glass p-6 hover:translate-y-[-2px] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                        {report.status}
                      </span>
                      <span className="text-xs text-slate-400">{report.size}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                      {Object.entries(report.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                          <p className="text-sm font-semibold text-white mt-1">
                            {typeof value === "number" ? (
                              key.includes("total") || key.includes("cost") ? (
                                <>₹{value.toLocaleString()}</>
                              ) : key.includes("utilization") ? (
                                <>{value}%</>
                              ) : (
                                value
                              )
                            ) : (
                              value
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                      Generated on {new Date(report.generated).toLocaleDateString()} • Period: {report.period}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <Button size="sm" className="btn-primary gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      CSV
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Report Builder */}
        <Card className="card-glass p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            Create Custom Report
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Report Type</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50">
                  <option value="">Select report type...</option>
                  <option value="fleet">Fleet Utilization</option>
                  <option value="inventory">Inventory Summary</option>
                  <option value="maintenance">Maintenance Schedule</option>
                  <option value="revenue">Revenue Analysis</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Export Format</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50">
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline">Cancel</Button>
              <Button className="btn-primary gap-2">
                <Zap className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Scheduled Reports */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Scheduled Reports</h2>
          <Card className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Monthly Fleet Utilization Report</p>
                <p className="text-white font-semibold mt-1">Sent to ops@smartfarmin.com</p>
                <p className="text-xs text-slate-500 mt-1">Every 1st of the month at 9:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                <span className="text-emerald-400 text-sm font-semibold">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
