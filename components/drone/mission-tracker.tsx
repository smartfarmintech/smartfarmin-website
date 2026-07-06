"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { MapPin, Clock, AlertCircle, CheckCircle2, Plane, Zap, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  startDroneMission,
  completeDroneMission,
  recordSprayReport,
} from "@/lib/drone/mission-actions"
import type { FlightPlan, PostFlightReport } from "@/lib/drone/ai-engine"
import { cn } from "@/lib/utils"

interface MissionTrackerProps {
  mission: {
    id: string
    status: "scheduled" | "in_progress" | "completed" | "failed"
    cropType: string
    areaAcres: number
    scheduledDate: string
    scheduledTime: string
    droneId: string
    operatorId: string
  }
  flightPlan?: FlightPlan
}

export function MissionTracker({ mission, flightPlan }: MissionTrackerProps) {
  const router = useRouter()
  const [isPending, startAction] = useTransition()
  const [activeMission, setActiveMission] = useState(mission)

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  }

  const statusIcons = {
    scheduled: <Clock className="h-4 w-4" />,
    in_progress: <Plane className="h-4 w-4 animate-spin" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
    failed: <AlertCircle className="h-4 w-4" />,
  }

  const handleStartMission = () => {
    if (!flightPlan) return

    startAction(async () => {
      const result = await startDroneMission(null, mission.id, flightPlan)
      if (result?.ok) {
        setActiveMission({ ...activeMission, status: "in_progress" })
        router.refresh()
      }
    })
  }

  const handleCompleteMission = () => {
    const report: PostFlightReport = {
      flight_id: mission.droneId,
      date: new Date().toISOString(),
      area_covered_acres: mission.areaAcres,
      duration_minutes: 45,
      battery_used_percent: 75,
      coverage_quality: "excellent",
      issues_encountered: [],
      sample_locations: [],
      recommendations: ["Field is healthy", "Monitor next week"],
    }

    startAction(async () => {
      const result = await completeDroneMission(null, mission.id, report)
      if (result?.ok) {
        setActiveMission({ ...activeMission, status: "completed" })
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Mission Header */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>{mission.cropType} Mission</CardTitle>
            <CardDescription>
              {mission.areaAcres} acres • {mission.scheduledDate}
            </CardDescription>
          </div>
          <Badge className={statusColors[activeMission.status]}>
            <span className="flex items-center gap-2">
              {statusIcons[activeMission.status]}
              {activeMission.status.replace("_", " ").toUpperCase()}
            </span>
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mission Timeline */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Mission Progress</h4>
            <div className="space-y-2">
              {["scheduled", "in_progress", "completed"].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                      activeMission.status === step || 
                      (activeMission.status === "completed" && index < 2)
                        ? "bg-green-500 text-white"
                        : activeMission.status === step
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm capitalize font-medium">{step.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flight Plan Details */}
          {flightPlan && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-sm mb-4">Flight Plan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Altitude</p>
                  <p className="text-sm font-semibold">{flightPlan.altitude_meters}m</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-sm font-semibold">{flightPlan.speed_kmph} km/h</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Flight Time</p>
                  <p className="text-sm font-semibold">{flightPlan.flight_time_minutes} min</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Battery Required</p>
                  <p className="text-sm font-semibold">{flightPlan.battery_required_percent}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Overlap</p>
                  <p className="text-sm font-semibold">{flightPlan.overlap_percent}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Waypoints</p>
                  <p className="text-sm font-semibold">{flightPlan.waypoints.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Status */}
          {activeMission.status === "in_progress" && (
            <div className="border-t pt-6 space-y-4">
              <h4 className="font-semibold text-sm">Real-time Status</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mission Progress</span>
                    <span className="text-sm font-bold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Battery</p>
                      <p className="text-sm font-bold">58%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                      <p className="text-sm font-bold">8 km/h</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Live Location</p>
                  <p className="text-sm mt-1">12.9716° N, 77.5946° E</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-6 space-y-2">
            {activeMission.status === "scheduled" && (
              <Button
                onClick={handleStartMission}
                disabled={isPending || !flightPlan}
                className="w-full"
              >
                <Plane className="mr-2 h-4 w-4" />
                Start Mission
              </Button>
            )}

            {activeMission.status === "in_progress" && (
              <Button
                onClick={handleCompleteMission}
                disabled={isPending}
                className="w-full"
                variant="default"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Mission
              </Button>
            )}

            {activeMission.status === "completed" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900">Mission Completed</p>
                <p className="text-xs text-green-700 mt-1">
                  {mission.areaAcres} acres covered successfully
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Waypoints Map Placeholder */}
      {flightPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Flight Waypoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {flightPlan.waypoints.length} waypoints plotted
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
