"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Leaf,
  Droplets,
  Sun,
  AlertTriangle,
  Activity,
  Calendar,
  Download,
  BarChart3,
  LineChart,
  Info,
} from "lucide-react"

const cropAnalytics = {
  id: "crop-001",
  name: "Sugarcane (Monsoon 2025)",
  field: "Field A",
  area: "5 Acres",
  sowDate: "2025-06-01",
  expectedHarvest: "2025-12-15",
  currentStage: "Active Growth",
  progress: 62,
  metrics: {
    height: { value: 2.8, unit: "m", trend: "up" },
    tiller: { value: 45, unit: "per sq.m", trend: "up" },
    leafArea: { value: 7.2, unit: "LAI", trend: "up" },
    soilMoisture: { value: 72, unit: "%", trend: "stable" },
    brix: { value: 18.5, unit: "°Bx", trend: "down" },
  },
  recommendations: [
    {
      id: "rec-1",
      title: "Irrigation",
      status: "needed",
      message: "Soil moisture is optimal. Next irrigation scheduled for 5 days.",
      icon: Droplets,
    },
    {
      id: "rec-2",
      title: "Pest Alert",
      status: "warning",
      message: "Early detection of stem borer. Apply recommended pesticide immediately.",
      icon: AlertTriangle,
    },
    {
      id: "rec-3",
      title: "Nutrition",
      status: "good",
      message: "Nutrient status is excellent. Continue with planned schedule.",
      icon: Leaf,
    },
    {
      id: "rec-4",
      title: "Weather",
      status: "attention",
      message: "High temperature expected (38°C). Increase irrigation frequency.",
      icon: Sun,
    },
  ],
}

const growthHistory = [
  { week: "Week 1", height: 0.2, tiller: 2, leafArea: 0.5 },
  { week: "Week 4", height: 0.6, tiller: 8, leafArea: 1.8 },
  { week: "Week 8", height: 1.2, tiller: 18, leafArea: 3.2 },
  { week: "Week 12", height: 1.8, tiller: 32, leafArea: 5.1 },
  { week: "Week 16", height: 2.4, tiller: 42, leafArea: 6.8 },
  { week: "Week 20", height: 2.8, tiller: 45, leafArea: 7.2 },
]

const stageBreakdown = [
  { stage: "Germination", progress: 100, color: "bg-emerald-500" },
  { stage: "Early Growth", progress: 100, color: "bg-emerald-500" },
  { stage: "Active Growth", progress: 62, color: "bg-blue-500" },
  { stage: "Grand Growth", progress: 0, color: "bg-slate-500" },
  { stage: "Maturation", progress: 0, color: "bg-slate-500" },
]

export default function CropAnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Crop Analytics</h1>
            <p className="text-slate-400 mt-2">AI-powered crop growth monitoring and predictions</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-secondary gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Crop Overview */}
        <Card className="card-glass p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-slate-400">Crop Name</p>
              <p className="text-lg font-semibold text-white mt-2">{cropAnalytics.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Field</p>
              <p className="text-lg font-semibold text-white mt-2">{cropAnalytics.field}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Area</p>
              <p className="text-lg font-semibold text-white mt-2">{cropAnalytics.area}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Stage</p>
              <p className="text-lg font-semibold text-emerald-400 mt-2">{cropAnalytics.currentStage}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Progress</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                    style={{ width: `${cropAnalytics.progress}%` }}
                  />
                </div>
                <span className="text-white font-semibold">{cropAnalytics.progress}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Crop Growth Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Growth Timeline</h2>
          <Card className="card-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-400">
                  Sow Date: {cropAnalytics.sowDate} • Expected Harvest: {cropAnalytics.expectedHarvest}
                </span>
              </div>
              <span className="text-sm text-slate-500">
                {Math.round((cropAnalytics.progress / 100) * 195)} of 195 days
              </span>
            </div>

            <div className="space-y-2">
              {stageBreakdown.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{stage.stage}</p>
                    <p className="text-xs text-slate-400">{stage.progress}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${stage.color}`}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Current Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(cropAnalytics.metrics).map(([key, data]) => (
              <Card
                key={key}
                onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
                className={`card-glass p-4 cursor-pointer transition-all ${
                  selectedMetric === key ? "border-emerald-500/50 bg-emerald-500/10" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  {data.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  )}
                  {data.trend === "down" && (
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  )}
                  {data.trend === "stable" && (
                    <Activity className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="text-3xl font-bold text-white">
                  {data.value}
                  <span className="text-lg text-slate-400 ml-1">{data.unit}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Growth History Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="card-glass p-6 lg:col-span-2">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Growth Progress
            </h3>
            <div className="space-y-4">
              {growthHistory.map((data, idx) => {
                const maxHeight = 2.8
                const maxTiller = 45
                const maxLeafArea = 7.2

                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">{data.week}</span>
                      <span className="text-xs text-slate-500">
                        H: {data.height}m | T: {data.tiller}/m² | LAI: {data.leafArea}
                      </span>
                    </div>
                    <div className="flex gap-2 h-6">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm"
                        style={{ width: `${(data.height / maxHeight) * 100}%` }}
                        title="Height"
                      />
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-sm"
                        style={{ width: `${(data.tiller / maxTiller) * 100}%` }}
                        title="Tillers"
                      />
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-sm"
                        style={{ width: `${(data.leafArea / maxLeafArea) * 100}%` }}
                        title="Leaf Area"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-xs text-slate-400">Height</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-xs text-slate-400">Tillers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-violet-500" />
                <span className="text-xs text-slate-400">Leaf Area</span>
              </div>
            </div>
          </Card>

          {/* Yield Projection */}
          <Card className="card-glass p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-emerald-400" />
              Yield Projection
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Projected Yield</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">84 Tons</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Estimated Sugar Content</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">19.2%</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Confidence Level</p>
                <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-3/4 bg-emerald-500" />
                </div>
                <p className="text-xs text-slate-400 mt-1">75% based on current metrics</p>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropAnalytics.recommendations.map((rec) => {
              const Icon = rec.icon
              const statusColors = {
                good: "bg-emerald-500/20 border-emerald-500/30",
                needed: "bg-blue-500/20 border-blue-500/30",
                warning: "bg-red-500/20 border-red-500/30",
                attention: "bg-amber-500/20 border-amber-500/30",
              }

              return (
                <Card key={rec.id} className={`card-glass p-4 border ${statusColors[rec.status as keyof typeof statusColors]}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{rec.message}</p>
                      <Button size="sm" className="btn-primary mt-3 gap-2">
                        <Info className="w-3 h-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
