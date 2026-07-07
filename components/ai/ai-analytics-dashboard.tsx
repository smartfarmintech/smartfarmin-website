"use client"

import { BarChart3, TrendingUp, Users, MessageSquare, Zap, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"

interface AnalyticsData {
  totalQuestions: number
  avgAccuracy: number
  cropsDiagnosed: number
  recommendationsGiven: number
  avgResponseTime: string
  topCrop: string
  topModule: string
  satisfactionScore: number
}

export function AIAnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const metrics = [
    {
      icon: MessageSquare,
      label: "Total Questions",
      value: data.totalQuestions.toLocaleString(),
      change: "+12%",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Zap,
      label: "Avg Accuracy",
      value: `${data.avgAccuracy}%`,
      change: "+3%",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: Users,
      label: "Crops Diagnosed",
      value: data.cropsDiagnosed.toLocaleString(),
      change: "+8%",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: BarChart3,
      label: "Recommendations",
      value: data.recommendationsGiven.toLocaleString(),
      change: "+15%",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border border-border/70 bg-card">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        {metric.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Modules */}
        <Card className="border border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Top Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{data.topModule}</span>
                <span className="text-2xl font-bold text-primary">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Of all interactions this month</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Performance */}
        <Card className="border border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Response Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Response Time</span>
                <span className="text-2xl font-bold text-primary">{data.avgResponseTime}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/50 text-center">
                  <p className="font-semibold">98%</p>
                  <p className="text-muted-foreground">Uptime</p>
                </div>
                <div className="p-2 rounded bg-muted/50 text-center">
                  <p className="font-semibold">{data.satisfactionScore}%</p>
                  <p className="text-muted-foreground">Satisfaction</p>
                </div>
                <div className="p-2 rounded bg-muted/50 text-center">
                  <p className="font-semibold">24/7</p>
                  <p className="text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="border border-border/70 bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                {data.topCrop} queries increased by 28% — likely due to recent seasonal transition
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Disease detection module showing highest accuracy (96%) among all AI features
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Voice interactions growing 45% faster than text — farmers prefer hands-free input
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Average session length up to 8.3 minutes — indicating deeper engagement with recommendations
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
