'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Cloud, Droplets, Wind, Eye, Gauge } from 'lucide-react'
import { useState, useEffect } from 'react'

interface WeatherDashboardProps {
  farmer: any
}

export function WeatherDashboard({ farmer }: WeatherDashboardProps) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Integrate with real weather API (OpenWeather, Weather API, etc.)
    // For now, showing mock data structure
    setWeather({
      current: {
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        visibility: 10,
        pressure: 1013,
        uvIndex: 6
      },
      forecast: Array.from({ length: 7 }).map((_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        high: 32 + Math.random() * 5,
        low: 22 + Math.random() * 5,
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        rainChance: Math.floor(Math.random() * 100)
      }))
    })
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-40 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
          <CardDescription>Today at your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Cloud className="w-5 h-5" />
                <span className="text-sm">Condition</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.condition}</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <span className="text-lg">🌡</span>
                <span className="text-sm">Temperature</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.temp}°C</p>
            </div>

            <div className="p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                <Droplets className="w-5 h-5" />
                <span className="text-sm">Humidity</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.humidity}%</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Wind className="w-5 h-5" />
                <span className="text-sm">Wind Speed</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.windSpeed} km/h</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Droplets className="w-5 h-5" />
                <span className="text-sm">Rain Probability</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.rainfall}%</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Eye className="w-5 h-5" />
                <span className="text-sm">Visibility</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.visibility} km</p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Gauge className="w-5 h-5" />
                <span className="text-sm">Pressure</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.pressure} mb</p>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-lg">☀</span>
                <span className="text-sm">UV Index</span>
              </div>
              <p className="font-semibold text-lg mt-2">{weather.current.uvIndex}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
          <CardDescription>Weekly weather predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weather.forecast.map((day: any, idx: number) => (
              <div key={idx} className="p-4 border border-border rounded-lg text-center">
                <p className="font-semibold mb-3">{day.day}</p>
                <div className="mb-3">
                  <p className="text-2xl mb-2">
                    {day.condition === 'Sunny' ? '☀' : day.condition === 'Rainy' ? '🌧' : '☁'}
                  </p>
                  <p className="text-sm text-muted-foreground">{day.condition}</p>
                </div>
                <div className="text-xs space-y-1">
                  <p>High: {day.high.toFixed(1)}°C</p>
                  <p>Low: {day.low.toFixed(1)}°C</p>
                  <p className="text-cyan-600">Rain: {day.rainChance}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Alerts</CardTitle>
          <CardDescription>Important weather warnings for your region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No active weather alerts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
