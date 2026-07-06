import { Droplets, Wind, Thermometer, CloudRain } from "lucide-react"
import { weatherLabel } from "@/lib/farmer/weather"
import type { WeatherResult } from "@/lib/farmer/types"
import { Card } from "@/components/ui/card"
import { WeatherIcon } from "./weather-icon"

function dayName(dateStr: string, index: number): string {
  if (index === 0) return "Today"
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short" })
}

export function WeatherDisplay({ weather }: { weather: WeatherResult }) {
  const unitSymbol = weather.unit === "fahrenheit" ? "°F" : "°C"
  const { now } = weather

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <WeatherIcon code={now.weatherCode} isDay={now.isDay} className="size-16 text-primary" />
            <div>
              <p className="text-4xl font-semibold text-foreground">
                {Math.round(now.temperature)}
                {unitSymbol}
              </p>
              <p className="text-sm text-muted-foreground">{weatherLabel(now.weatherCode)}</p>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(now.apparentTemperature)}
                {unitSymbol}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Metric icon={<Droplets className="size-4" />} label="Humidity" value={`${now.humidity}%`} />
            <Metric icon={<Wind className="size-4" />} label="Wind" value={`${Math.round(now.windSpeed)} km/h`} />
            <Metric
              icon={<CloudRain className="size-4" />}
              label="Rain"
              value={`${now.precipitation.toFixed(1)} mm`}
            />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">7-day forecast</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weather.daily.map((day, i) => (
            <Card key={day.date} className="flex flex-col items-center gap-2 p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground">{dayName(day.date, i)}</p>
              <WeatherIcon code={day.weatherCode} isDay className="size-8 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                {Math.round(day.tempMax)}
                {unitSymbol}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round(day.tempMin)}
                {unitSymbol}
              </p>
              {day.precipitationProbabilityMax != null ? (
                <p className="flex items-center gap-0.5 text-[11px] text-sky-600">
                  <Droplets className="size-3" />
                  {day.precipitationProbabilityMax}%
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 px-3 py-2">
      <span className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[11px]">{label}</span>
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
