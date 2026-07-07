"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Bell,
  MapPin,
} from "lucide-react"

const weatherData = {
  location: "Pune, Maharashtra",
  coordinates: "18.5204°N, 73.8567°E",
  lastUpdated: "2025-07-07 10:30 AM",
  current: {
    temperature: 34,
    feelsLike: 38,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    windDirection: "SW",
    pressure: 1013,
    visibility: 10,
    uvIndex: 8,
    dewPoint: 26,
  },
  forecast: [
    {
      day: "Today",
      date: "07 Jul",
      high: 35,
      low: 26,
      condition: "Partly Cloudy",
      precipitation: 15,
      windSpeed: 12,
      icon: "cloud",
    },
    {
      day: "Tomorrow",
      date: "08 Jul",
      high: 33,
      low: 25,
      condition: "Rainy",
      precipitation: 75,
      windSpeed: 15,
      icon: "rain",
    },
    {
      day: "Wed",
      date: "09 Jul",
      high: 31,
      low: 24,
      condition: "Heavy Rain",
      precipitation: 85,
      windSpeed: 18,
      icon: "heavy-rain",
    },
    {
      day: "Thu",
      date: "10 Jul",
      high: 30,
      low: 23,
      condition: "Rainy",
      precipitation: 60,
      windSpeed: 14,
      icon: "rain",
    },
    {
      day: "Fri",
      date: "11 Jul",
      high: 32,
      low: 24,
      condition: "Cloudy",
      precipitation: 30,
      windSpeed: 10,
      icon: "cloud",
    },
  ],
  alerts: [
    {
      id: "alert-1",
      type: "warning",
      title: "Heavy Rain Warning",
      message: "Heavy rainfall expected on 09-10 July. Ensure proper drainage in fields.",
      startTime: "09 Jul, 6:00 PM",
      endTime: "10 Jul, 6:00 AM",
    },
    {
      id: "alert-2",
      type: "info",
      title: "High Temperature Alert",
      message: "Temperature may reach 38°C today. Increase irrigation if needed.",
      startTime: "Today",
      endTime: "Today, 6:00 PM",
    },
  ],
  recommendations: [
    {
      icon: Droplets,
      title: "Irrigation Schedule",
      message: "Heavy rain expected in 2 days. Reduce irrigation frequency.",
      priority: "high",
    },
    {
      icon: AlertTriangle,
      title: "Pest Management",
      message: "High humidity (65%) favors fungal diseases. Consider preventive spraying.",
      priority: "high",
    },
    {
      icon: Wind,
      title: "Crop Support",
      message: "Wind speed may reach 18 km/h. Ensure crop support structures are secure.",
      priority: "medium",
    },
    {
      icon: CheckCircle,
      title: "Harvesting Window",
      message: "Next 3 days have high moisture. Plan harvesting for 11-13 July.",
      priority: "medium",
    },
  ],
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case "Partly Cloudy":
      return <Cloud className="w-12 h-12 text-slate-400" />
    case "Rainy":
      return <CloudRain className="w-12 h-12 text-blue-400" />
    case "Heavy Rain":
      return <CloudRain className="w-12 h-12 text-blue-600" />
    case "Cloudy":
      return <Cloud className="w-12 h-12 text-slate-400" />
    default:
      return <Sun className="w-12 h-12 text-amber-400" />
  }
}

function getAlertColor(type: string) {
  switch (type) {
    case "warning":
      return "bg-red-500/20 border-red-500/30 text-red-400"
    case "info":
      return "bg-blue-500/20 border-blue-500/30 text-blue-400"
    case "success":
      return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
    default:
      return "bg-amber-500/20 border-amber-500/30 text-amber-400"
  }
}

export default function WeatherPage() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Weather Advisory</h1>
            <p className="text-slate-400 mt-2">AI-powered weather forecasting and farming recommendations</p>
          </div>
          <Button className="btn-primary gap-2">
            <Bell className="w-4 h-4" />
            Enable Alerts
          </Button>
        </div>

        {/* Location and Last Updated */}
        <Card className="card-glass p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="font-semibold text-white">{weatherData.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Last Updated</p>
              <p className="text-sm text-white">{weatherData.lastUpdated}</p>
            </div>
          </div>
        </Card>

        {/* Current Weather */}
        <Card className="card-glass p-8 mb-8 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border-blue-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center">
              {getWeatherIcon(weatherData.current.condition)}
              <p className="text-2xl font-bold text-white mt-4">{weatherData.current.temperature}°C</p>
              <p className="text-sm text-slate-400 mt-1">{weatherData.current.condition}</p>
              <p className="text-xs text-slate-500 mt-1">Feels like {weatherData.current.feelsLike}°C</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Humidity</p>
                <p className="text-2xl font-bold text-white">{weatherData.current.humidity}%</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Wind Speed</p>
                <p className="text-2xl font-bold text-white">{weatherData.current.windSpeed} km/h</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Pressure</p>
                <p className="text-2xl font-bold text-white">{weatherData.current.pressure} mb</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">UV Index</p>
                <p className="text-2xl font-bold text-amber-400">{weatherData.current.uvIndex} High</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs text-slate-400">Visibility</p>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.current.visibility} km</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <p className="text-xs text-slate-400">Dew Point</p>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.current.dewPoint}°C</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-400">Wind Direction</p>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.current.windDirection}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 5-Day Forecast */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {weatherData.forecast.map((day, idx) => (
              <Card
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`card-glass p-4 cursor-pointer transition-all text-center ${
                  selectedDay === idx ? "border-emerald-500/50 bg-emerald-500/10" : ""
                }`}
              >
                <p className="font-semibold text-white">{day.day}</p>
                <p className="text-xs text-slate-400 mb-3">{day.date}</p>

                <div className="flex justify-center mb-3">
                  {getWeatherIcon(day.condition)}
                </div>

                <p className="text-xs text-slate-400 mb-2">{day.condition}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-semibold">{day.high}°</span>
                    <span className="text-slate-500">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-400">
                    <Droplets className="w-3 h-3" />
                    {day.precipitation}%
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                    <Wind className="w-3 h-3" />
                    {day.windSpeed} km/h
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {weatherData.alerts.map((alert) => (
                <Card key={alert.id} className={`card-glass p-4 border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {alert.startTime} to {alert.endTime}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">AI Farming Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherData.recommendations.map((rec, idx) => {
              const Icon = rec.icon
              const priorityColor = rec.priority === "high" ? "border-l-red-400" : "border-l-amber-400"

              return (
                <Card key={idx} className={`card-glass p-4 border-l-4 ${priorityColor}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{rec.message}</p>
                      {rec.priority === "high" && (
                        <p className="text-xs text-red-400 mt-2 font-semibold">⚠️ High Priority</p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
