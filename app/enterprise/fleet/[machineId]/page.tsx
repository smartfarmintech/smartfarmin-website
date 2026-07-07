import { getMachineDetails } from "@/lib/enterprise/fleet-management"
import { MaintenanceScheduler } from "@/components/enterprise/maintenance-scheduler"
import { GPSTracker } from "@/components/enterprise/gps-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, TrendingUp, Wrench, MapPin } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ machineId: string }> }) {
  const { machineId } = await params
  return {
    title: `Machine Details | Fleet Management`,
    description: "View detailed information about a machine in your fleet",
  }
}

export default async function MachineDetailPage({ params }: { params: Promise<{ machineId: string }> }) {
  const { machineId } = await params
  const details = await getMachineDetails(machineId)

  if (!details.machine) {
    notFound()
  }

  const machine = details.machine
  const maintenanceHistory = details.maintenanceHistory || []
  const gpsTrack = details.gpsTrack || []

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/enterprise/fleet">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{machine.name}</h1>
          <p className="text-muted-foreground mt-2">{machine.model}</p>
        </div>
        <Badge
          variant={
            machine.operatingStatus === "active"
              ? "default"
              : machine.operatingStatus === "maintenance"
                ? "secondary"
                : "outline"
          }
          className="text-base px-3 py-1"
        >
          {machine.operatingStatus}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{machine.registration_no}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">{machine.type}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">KM/Hours Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{machine.km_hours_worked || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">₹{(machine.current_value || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Machine Details */}
          <Card>
            <CardHeader>
              <CardTitle>Machine Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Brand</div>
                  <div className="font-medium mt-1">{machine.brand}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Model</div>
                  <div className="font-medium mt-1">{machine.model}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Year of Manufacture</div>
                  <div className="font-medium mt-1">{machine.year_of_manufacture}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fuel Type</div>
                  <div className="font-medium mt-1 capitalize">{machine.fuel_type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Purchase Cost</div>
                  <div className="font-medium mt-1">₹{(machine.purchase_cost || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                  <div className="font-medium mt-1">{machine.total_bookings || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Maintenance History
              </CardTitle>
              <CardDescription>Last 10 maintenance records</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceHistory.map((record: any) => (
                    <div key={record.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm capitalize">{record.maint_type} Maintenance</div>
                          <div className="text-sm text-muted-foreground mt-1">{record.description}</div>
                        </div>
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
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(record.scheduled_at).toLocaleDateString()}</span>
                        {record.cost && <span>₹{record.cost.toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No maintenance records</p>
              )}
            </CardContent>
          </Card>

          {/* GPS Tracker */}
          <GPSTracker
            machineId={machine.id}
            machineName={machine.name}
            initialLocation={
              machine.latitude && machine.longitude
                ? {
                    latitude: machine.latitude,
                    longitude: machine.longitude,
                    address: machine.address || "Location not specified",
                  }
                : undefined
            }
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium mt-1">{machine.owner_name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium mt-1">{machine.owner_phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium mt-1 text-sm break-all">{machine.owner_email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Machine Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Operating Status</span>
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
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">GPS Enabled</span>
                  <Badge variant={machine.gpsEnabled ? "default" : "outline"}>
                    {machine.gpsEnabled ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {machine.nextServiceDate && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-amber-900">Next Service Due</div>
                      <div className="text-amber-800 text-xs mt-1">
                        {new Date(machine.nextServiceDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <Wrench className="w-4 h-4 mr-2" />
                View Maintenance
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Track Location
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Maintenance Scheduler */}
      <MaintenanceScheduler machineId={machine.id} machineName={machine.name} />
    </div>
  )
}
