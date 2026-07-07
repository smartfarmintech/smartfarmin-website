"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Compass, Gauge, Clock, Navigation } from "lucide-react"

interface GPSTrackerProps {
  machineId: string
  machineName: string
  initialLocation?: {
    latitude: number
    longitude: number
    address: string
  }
}

export function GPSTracker({ machineId, machineName, initialLocation }: GPSTrackerProps) {
  const [location, setLocation] = useState(initialLocation)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  // Simulated GPS updates (in real app, would use WebSocket or polling)
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      // Simulate GPS position changes
      if (location) {
        const variation = 0.0001 // Small GPS variation
        setLocation({
          ...location,
          latitude: location.latitude + (Math.random() - 0.5) * variation,
          longitude: location.longitude + (Math.random() - 0.5) * variation,
        })
        setLastUpdate(new Date().toLocaleTimeString())
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isTracking, location])

  if (!location) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            GPS Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>GPS data not available for this machine</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              GPS Tracking - {machineName}
            </CardTitle>
            <CardDescription>Real-time machine location</CardDescription>
          </div>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? "Live" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Placeholder - In production, use a real map library */}
        <div className="bg-muted rounded-lg p-8 aspect-video flex items-center justify-center border-2 border-dashed">
          <div className="text-center space-y-3">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <div className="text-muted-foreground">
              <p className="font-medium">Coordinates:</p>
              <p className="text-sm">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
            </div>
            <p className="text-xs text-muted-foreground/70">Map integration coming soon</p>
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Current Location</div>
                <div className="font-medium text-sm">{location.address}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm text-muted-foreground">Last Update</div>
                <div className="font-medium text-sm">{lastUpdate || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Data */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Speed</span>
            </div>
            <div className="text-lg font-bold">0 km/h</div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Heading</span>
            </div>
            <div className="text-lg font-bold">0°</div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <div className="text-lg font-bold">5 m</div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Altitude</span>
            </div>
            <div className="text-lg font-bold">450 m</div>
          </div>
        </div>

        {/* Journey History */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recent Journey</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 bg-muted rounded-lg text-sm border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {(location.latitude + i * 0.001).toFixed(6)}, {(location.longitude + i * 0.001).toFixed(6)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                    </div>
                  </div>
                  {i === 0 && <Badge className="text-xs">Current</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
