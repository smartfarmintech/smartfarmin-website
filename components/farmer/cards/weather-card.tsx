import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Cloud, Droplets, Wind, Sun } from 'lucide-react'

export async function WeatherCard({ farmer }: any) {
  // TODO: Integrate with real weather API using farmer location
  // For now, showing placeholder
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Weather</CardTitle>
        <CardDescription>Your location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="text-sm font-semibold">Partly Cloudy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Temp</p>
              <p className="text-sm font-semibold">28°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-semibold">65%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-semibold">12 km/h</p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/dashboard/farmer/weather">View Forecast</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
