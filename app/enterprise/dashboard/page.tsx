"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Truck,
  Package,
  TrendingUp,
  AlertCircle,
  Zap,
  ArrowRight,
  BarChart3,
  Settings,
} from "lucide-react"
import { getOrgDashboardSummary } from "@/lib/enterprise/organization-management"

export default function EnterpriseDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [orgId] = useState("demo-org-001") // In real app, get from session/params

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getOrgDashboardSummary(orgId)
        setSummary(data)
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [orgId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-emerald-500/20 animate-pulse">
            <Zap className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-slate-400">Loading enterprise dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {summary?.organization?.name || "Enterprise Dashboard"}
            </h1>
            <p className="text-slate-400 mt-2">
              Manage fleet, inventory, and operations for {summary?.organization?.type}
            </p>
          </div>
          <Button asChild className="btn-primary gap-2">
            <Link href={`/enterprise/organizations/${orgId}/settings`}>
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Members */}
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Members</p>
                <p className="text-3xl font-bold text-white mt-2">{summary?.members?.total || 0}</p>
                <p className="text-xs text-emerald-400 mt-2">
                  {summary?.members?.admins || 0} admins
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>

          {/* Fleet */}
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Fleet Assets</p>
                <p className="text-3xl font-bold text-white mt-2">{summary?.fleet?.totalAssets || 0}</p>
                <p className="text-xs text-cyan-400 mt-2">
                  {summary?.fleet?.operational || 0} operational
                </p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Truck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Inventory Items</p>
                <p className="text-3xl font-bold text-white mt-2">{summary?.inventory?.totalItems || 0}</p>
                <p className="text-xs text-amber-400 mt-2">
                  {summary?.inventory?.lowStock || 0} low stock
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Package className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </Card>

          {/* Maintenance */}
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Maintenance</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{summary?.maintenance?.pending || 0}</p>
                <p className="text-xs text-red-400 mt-2">
                  {summary?.maintenance?.overdue || 0} overdue
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="card-glass p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Fleet Utilization
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Average Utilization</span>
                    <span className="text-emerald-400 font-semibold">{summary?.fleet?.utilization || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{ width: `${summary?.fleet?.utilization || 0}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-slate-400 text-sm">Operational</p>
                    <p className="text-2xl font-bold text-white">{summary?.fleet?.operational || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Under Maintenance</p>
                    <p className="text-2xl font-bold text-amber-400">{summary?.fleet?.underMaintenance || 0}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <Card className="card-glass p-6 h-full">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
              <div className="space-y-3">
                <Button asChild variant="ghost" className="w-full justify-start text-emerald-400 hover:text-emerald-300">
                  <Link href={`/enterprise/organizations/${orgId}/fleet`}>
                    <Truck className="w-4 h-4 mr-2" />
                    Fleet Management
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-cyan-400 hover:text-cyan-300">
                  <Link href={`/enterprise/organizations/${orgId}/inventory`}>
                    <Package className="w-4 h-4 mr-2" />
                    Inventory
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-amber-400 hover:text-amber-300">
                  <Link href={`/enterprise/organizations/${orgId}/members`}>
                    <Users className="w-4 h-4 mr-2" />
                    Members
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-purple-400 hover:text-purple-300">
                  <Link href={`/enterprise/organizations/${orgId}/reports`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Reports
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="card-glass p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Organization Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-slate-400 text-sm">Organization Type</p>
              <p className="text-lg font-semibold text-white mt-1 capitalize">
                {summary?.organization?.type?.replace(/_/g, " ")}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-lg font-semibold text-white mt-1">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                {summary?.organization?.status}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-slate-400 text-sm">Location</p>
              <p className="text-lg font-semibold text-white mt-1">
                {summary?.organization?.district}, {summary?.organization?.state}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
