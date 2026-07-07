'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Zap, Watch } from 'lucide-react'

interface GPSLocation {
  id: string
  latitude: number
  longitude: number
  speed_kmph: number
  heading: number
  accuracy_m: number
  recorded_at: string
}

interface GPSTrackingProps {
  booking_id?: string
  machine_id?: string
  live?: boolean
}

export default function GPSTracking({
  booking_id,
  machine_id,
  live = true,
}: GPSTrackingProps) {
  const [locations, setLocations] = useState<GPSLocation[]>([])
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null)
  const [isTracking, setIsTracking] = useState(live)

  // Mock GPS data - in production, fetch from API
  useEffect(() => {
    if (!isTracking) return

    const mockLocations: GPSLocation[] = [
      {
        id: '1',
        latitude: 17.3850,
        longitude: 78.4867,
        speed_kmph: 25,
        heading: 45,
        accuracy_m: 5,
        recorded_at: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: '2',
        latitude: 17.3855,
        longitude: 78.4875,
        speed_kmph: 30,
        heading: 45,
        accuracy_m: 4,
        recorded_at: new Date().toISOString(),
      },
    ]

    setLocations(mockLocations)
    setCurrentLocation(mockLocations[mockLocations.length - 1])

    // Simulate live updates
    const interval = setInterval(() => {
      const newLocation = {
        ...currentLocation!,
        id: `${Date.now()}`,
        latitude: currentLocation!.latitude + (Math.random() - 0.5) * 0.001,
        longitude: currentLocation!.longitude + (Math.random() - 0.5) * 0.001,
        speed_kmph: Math.random() * 50,
        recorded_at: new Date().toISOString(),
      }
      setCurrentLocation(newLocation)
      setLocations(prev => [...prev.slice(-19), newLocation])
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isTracking, currentLocation])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">GPS Tracking</h3>
            <Badge variant={isTracking ? 'default' : 'secondary'}>
              {isTracking ? 'Live' : 'Offline'}
            </Badge>
          </div>

          {currentLocation && (
            <div className="space-y-3">
              <div className="bg-primary/10 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Latitude</p>
                    <p className="font-mono font-semibold">{currentLocation.latitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Longitude</p>
                    <p className="font-mono font-semibold">{currentLocation.longitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Speed</p>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-600" />
                      <p className="font-semibold">{currentLocation.speed_kmph.toFixed(1)} km/h</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Heading</p>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <p className="font-semibold">{currentLocation.heading.toFixed(0)}°</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <a
                      href={`https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View on Map
                    </a>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Watch className="w-3 h-3" />
                  Last updated: {new Date(currentLocation.recorded_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}

          {locations.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-2">Recent Positions ({locations.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locations
                  .slice()
                  .reverse()
                  .map(loc => (
                    <div key={loc.id} className="text-xs p-2 bg-muted rounded flex justify-between">
                      <div>
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(loc.recorded_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
