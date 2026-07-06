import { MapPin } from "lucide-react"
import { requireFarmer, getWeatherPreferences, getLands, getUserProfile } from "@/lib/farmer/queries"
import { fetchWeather } from "@/lib/farmer/weather"
import { WeatherDisplay } from "@/components/farmer/weather-display"
import { WeatherPrefsForm } from "@/components/farmer/weather-prefs-form"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

// Hyderabad, Telangana — sensible default for the Rythu360 region.
const DEFAULT_LAT = 17.385
const DEFAULT_LON = 78.4867

export default async function WeatherPage() {
  const { farmer } = await requireFarmer()
  const [prefs, lands, profile] = await Promise.all([
    getWeatherPreferences(farmer.id),
    getLands(farmer.id),
    getUserProfile(),
  ])

  const landWithCoords = lands.find((l) => l.latitude != null && l.longitude != null)
  const lat = prefs?.latitude ?? landWithCoords?.latitude ?? profile?.latitude ?? DEFAULT_LAT
  const lon = prefs?.longitude ?? landWithCoords?.longitude ?? profile?.longitude ?? DEFAULT_LON
  const source =
    prefs?.latitude != null
      ? "your saved location"
      : landWithCoords
        ? landWithCoords.land_name || "your land"
        : profile?.latitude != null
          ? "your profile address"
          : "Hyderabad (default)"

  const weather = await fetchWeather(lat, lon, prefs?.temperature_unit ?? "celsius")

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Weather</h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            Forecast for {source}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {weather ? (
            <WeatherDisplay weather={weather} />
          ) : (
            <Card className="p-6 text-sm text-muted-foreground">
              Live weather is unavailable right now. Please check back shortly.
            </Card>
          )}
        </div>
        <WeatherPrefsForm prefs={prefs} />
      </div>
    </div>
  )
}
