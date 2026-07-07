"use client"

import { useActionState } from "react"
import { scheduleMaintenance } from "@/lib/enterprise/fleet-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Wrench } from "lucide-react"

interface MaintenanceSchedulerProps {
  machineId: string
  machineName: string
}

const MAINTENANCE_TYPES = ["routine", "preventive", "repair"] as const

export function MaintenanceScheduler({ machineId, machineName }: MaintenanceSchedulerProps) {
  const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
    // Extract FormData values and call scheduleMaintenance
    return scheduleMaintenance(prev, {
      machineId,
      maintenanceType: (formData.get("maintenanceType") as any) || "routine",
      scheduledDate: formData.get("scheduledDate") as string,
      description: formData.get("description") as string,
      estimatedCost: formData.get("estimatedCost") ? parseInt(formData.get("estimatedCost") as string) : undefined,
      serviceProvider: (formData.get("serviceProvider") as string) || undefined,
    })
  }, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Schedule Maintenance
        </CardTitle>
        <CardDescription>Schedule maintenance for {machineName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="machineId" value={machineId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceType">Maintenance Type</Label>
              <Select defaultValue="routine" name="maintenanceType">
                <SelectTrigger id="maintenanceType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the maintenance work needed..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost (₹)</Label>
              <Input
                id="estimatedCost"
                name="estimatedCost"
                type="number"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                name="serviceProvider"
                placeholder="Name of service center or mechanic"
              />
            </div>
          </div>

          {/* Status Messages */}
          {state && !state.ok && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error scheduling maintenance</p>
                <p className="text-sm text-red-800 mt-1">{state.error}</p>
              </div>
            </div>
          )}

          {state?.ok && (
            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Maintenance scheduled successfully!</p>
                <p className="text-sm text-green-800 mt-1">The maintenance has been added to the schedule.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" size="lg" disabled={isPending} className="w-full">
            {isPending ? "Scheduling..." : "Schedule Maintenance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
