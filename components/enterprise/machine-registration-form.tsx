"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const MACHINE_TYPES = [
  "tractor",
  "harvester",
  "thrower",
  "sprayer",
  "drill",
  "pump",
  "other",
]

const FUEL_TYPES = ["diesel", "petrol", "electric"]

export function MachineRegistrationForm() {
  const [state, formAction, isPending] = useActionState(async (): Promise<{ ok: boolean; error?: string }> => {
    // Placeholder form action - in real app, this would register the machine
    return { ok: true }
  }, null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register New Machine</CardTitle>
          <CardDescription>Add a new agricultural machine to your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Tractor-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Machine Type</Label>
                  <Select defaultValue="tractor" name="type">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MACHINE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g., Mahindra, John Deere"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., 450 DI"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    name="registration"
                    placeholder="e.g., MH-15-AB-1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    placeholder="2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Owner Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner Name</Label>
                  <Input
                    id="owner"
                    name="owner"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91-XXXX-XXXX-XX"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="owner@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="power">Power (HP)</Label>
                  <Input
                    id="power"
                    name="power"
                    type="number"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select defaultValue="diesel" name="fuel">
                    <SelectTrigger id="fuel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Input
                    id="transmission"
                    name="transmission"
                    placeholder="e.g., Manual, Automatic"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wheelDrive">Wheel Drive</Label>
                  <Input
                    id="wheelDrive"
                    name="wheelDrive"
                    placeholder="e.g., 2WD, 4WD"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Financial Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseCost">Purchase Cost (₹)</Label>
                  <Input
                    id="purchaseCost"
                    name="purchaseCost"
                    type="number"
                    placeholder="500000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Value (₹)</Label>
                  <Input
                    id="currentValue"
                    name="currentValue"
                    type="number"
                    placeholder="400000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <h3 className="font-semibold">Additional Features</h3>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  name="features"
                  placeholder="e.g., GPS Enabled, Power Steering, Air Conditioning"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="gpsEnabled"
                  name="gpsEnabled"
                  type="checkbox"
                  className="rounded"
                  defaultChecked
                />
                <Label htmlFor="gpsEnabled" className="font-normal cursor-pointer">
                  GPS Enabled for Real-time Tracking
                </Label>
              </div>
            </div>

            {/* Status Message */}
            {state && !state.ok && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error registering machine</p>
                  <p className="text-sm text-red-800 mt-1">{state.error || "Unknown error"}</p>
                </div>
              </div>
            )}

            {state?.ok && (
              <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Machine registered successfully!</p>
                  <p className="text-sm text-green-800 mt-1">The machine has been added to your fleet.</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Registering..." : "Register Machine"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
