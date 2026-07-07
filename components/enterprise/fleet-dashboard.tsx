"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, AlertTriangle, Wrench, TrendingUp, Zap, Eye } from "lucide-react"
import { getFleetOverview, getMachineDetails, generateFleetAlerts } from "@/lib/enterprise/fleet-management"

export function FleetDashboard({ organizationId }: { organizationId?: string }) {
  const [overview, setOverview] = useState<any>(null)
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [machineDetails, setMachineDetails] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await getFleetOverview(organizationId)
      setOverview(data)
      if (data.machines.length > 0) {
        const first = data.machines[0]
        setSelectedMachine(first.id)
      }
      setLoading(false)
    }
    loadData()
  }, [organizationId])

  useEffect(() => {
    if (selectedMachine) {
      const loadMachineData = async () => {
        const details = await getMachineDetails(selectedMachine)
        setMachineDetails(details)

        const machineAlerts = await generateFleetAlerts(selectedMachine)
        setAlerts(machineAlerts)
      }
      loadMachineData()
    }
  }, [selectedMachine])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 h-20 bg-muted rounded" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Machines",
      value: overview?.totalMachines || 0,
      icon: <Zap className="w-4 h-4" />,
      color: "text-blue-500",
    },
    {
      title: "Active Machines",
      value: overview?.activeMachines || 0,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-green-500",
    },
    {
      title: "Under Maintenance",
      value: overview?.maintenanceMachines || 0,
      icon: <Wrench className="w-4 h-4" />,
      color: "text-yellow-500",
    },
    {
      title: "Monthly Revenue",
      value: `₹${(overview?.totalRevenue || 0).toLocaleString()}`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {stat.title}
                <span className={stat.color}>{stat.icon}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fleet Assets</CardTitle>
            <CardDescription>{overview?.totalMachines || 0} machines total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {overview?.machines?.map((machine: any) => (
              <button
                key={machine.id}
                onClick={() => setSelectedMachine(machine.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedMachine === machine.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="font-medium text-sm">{machine.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{machine.model}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      machine.operatingStatus === "active"
                        ? "default"
                        : machine.operatingStatus === "maintenance"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {machine.operatingStatus}
                  </Badge>
                  {machine.gpsEnabled && <Badge variant="outline" className="text-xs">GPS Active</Badge>}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Machine Details & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMachine && machineDetails ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{machineDetails.machine?.name}</CardTitle>
                  <CardDescription>{machineDetails.machine?.model}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Registration</div>
                      <div className="font-medium">{machineDetails.machine?.registration_no}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Type</div>
                      <div className="font-medium">{machineDetails.machine?.type}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">KM/Hours</div>
                      <div className="font-medium">{machineDetails.machine?.km_hours_worked || 0}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Current Value</div>
                      <div className="font-medium">₹{(machineDetails.machine?.current_value || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {alerts.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      Active Alerts ({alerts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{alert.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                          </div>
                          <Badge
                            variant={
                              alert.severity === "critical"
                                ? "destructive"
                                : alert.severity === "high"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Select a machine to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Maintenance & Location Tabs */}
      {selectedMachine && machineDetails && (
        <Tabs defaultValue="maintenance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance History
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              GPS Track
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Recent Bookings
            </TabsTrigger>
          </TabsList>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>Last 10 maintenance records</CardDescription>
              </CardHeader>
              <CardContent>
                {machineDetails.maintenanceHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {machineDetails.maintenanceHistory.map((record: any) => (
                      <div key={record.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-sm capitalize">{record.maint_type} Maintenance</div>
                            <div className="text-sm text-muted-foreground mt-1">{record.description}</div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(record.scheduled_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                record.status === "completed"
                                  ? "default"
                                  : record.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {record.status}
                            </Badge>
                            {record.cost && <div className="text-sm font-medium mt-2">₹{record.cost.toLocaleString()}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No maintenance records</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* GPS Track Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>GPS Location History</CardTitle>
                <CardDescription>Last 24 hours tracking data</CardDescription>
              </CardHeader>
              <CardContent>
                {machineDetails.gpsTrack?.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {machineDetails.gpsTrack.map((loc: any) => (
                      <div key={loc.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Speed: {loc.speed_kmph} km/h • Heading: {loc.heading}°
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(loc.recorded_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No GPS data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Last 10 bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {machineDetails.recentBookings?.length > 0 ? (
                  <div className="space-y-3">
                    {machineDetails.recentBookings.map((booking: any) => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-sm">Booking #{booking.id?.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(booking.starts_at).toLocaleDateString()} -{" "}
                              {new Date(booking.ends_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                            {booking.total_amount && (
                              <div className="text-sm font-medium mt-2">₹{booking.total_amount.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
