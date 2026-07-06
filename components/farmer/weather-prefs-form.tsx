"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { saveWeatherPreferences, type ActionState } from "@/lib/farmer/actions"
import type { WeatherPreferences } from "@/lib/farmer/types"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubmitButton } from "./submit-button"

export function WeatherPrefsForm({ prefs }: { prefs: WeatherPreferences | null }) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(saveWeatherPreferences, null)
  const [unit, setUnit] = useState<string>(prefs?.temperature_unit ?? "celsius")

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <Card className="p-5">
      <h2 className="font-serif text-lg font-semibold text-foreground">Alert preferences</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose what weather alerts you receive and in which units.</p>

      <form action={formAction} className="mt-4 space-y-5">
        <input type="hidden" name="temperature_unit" value={unit} />
        {prefs?.latitude != null ? <input type="hidden" name="latitude" value={prefs.latitude} /> : null}
        {prefs?.longitude != null ? <input type="hidden" name="longitude" value={prefs.longitude} /> : null}

        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm font-medium">Enable alerts</Label>
            <p className="text-xs text-muted-foreground">Master switch for all weather notifications.</p>
          </div>
          <Switch name="alerts_enabled" defaultChecked={prefs?.alerts_enabled ?? true} value="on" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium">Rainfall alerts</Label>
          <Switch name="rainfall_alerts" defaultChecked={prefs?.rainfall_alerts ?? true} value="on" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium">Temperature alerts</Label>
          <Switch name="temperature_alerts" defaultChecked={prefs?.temperature_alerts ?? true} value="on" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium">Wind alerts</Label>
          <Switch name="wind_alerts" defaultChecked={prefs?.wind_alerts ?? false} value="on" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="temperature_unit_sel" className="text-sm font-medium">
              Temperature unit
            </Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="temperature_unit_sel">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preferred_time" className="text-sm font-medium">
              Daily summary time
            </Label>
            <Input
              id="preferred_time"
              name="preferred_time"
              type="time"
              defaultValue={prefs?.preferred_time?.slice(0, 5) ?? "06:00"}
            />
          </div>
        </div>

        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm text-primary">Preferences saved.</p> : null}

        <SubmitButton>Save preferences</SubmitButton>
      </form>
    </Card>
  )
}
