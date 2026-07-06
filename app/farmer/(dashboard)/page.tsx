import Link from "next/link"
import { Bell, Droplets, MapPinned, Sprout, Wallet, Wind } from "lucide-react"
import {
  getCropCycles,
  getLands,
  getNotifications,
  getWallet,
  getWalletTransactions,
  getWeatherPreferences,
  requireFarmer,
} from "@/lib/farmer/queries"
import { fetchWeather, weatherLabel } from "@/lib/farmer/weather"
import { computeBalance, formatCurrency } from "@/lib/farmer/finance"
import { toAcres, label } from "@/lib/farmer/constants"
import { formatDate, daysUntil, relativeTime } from "@/lib/farmer/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/farmer/stat-card"
import { CropStatusBadge } from "@/components/farmer/crop-status-badge"
import { WeatherIcon } from "@/components/farmer/weather-icon"

const ACTIVE_STATUSES = ["planned", "sowing", "growing", "flowering", "maturing"]
const DEFAULT_LAT = 17.385
const DEFAULT_LON = 78.4867

export default async function FarmerOverviewPage() {
  const { farmer } = await requireFarmer()
  const [crops, lands, wallet, txns, notifications, prefs] = await Promise.all([
    getCropCycles(farmer.id),
    getLands(farmer.id),
    getWallet(),
    getWalletTransactions(50),
    getNotifications(5),
    getWeatherPreferences(farmer.id),
  ])

  const activeCrops = crops.filter((c) => ACTIVE_STATUSES.includes(c.status))
  const totalAcres = lands.reduce((sum, l) => sum + toAcres(Number(l.area_value), l.area_unit), 0)
  const balance = computeBalance(wallet, txns)
  const unread = notifications.filter((n) => n.status === "unread").length

  const lat = prefs?.latitude ?? DEFAULT_LAT
  const lon = prefs?.longitude ?? DEFAULT_LON
  const weather = await fetchWeather(lat, lon, prefs?.temperature_unit ?? "celsius")
  const unitSymbol = (prefs?.temperature_unit ?? "celsius") === "fahrenheit" ? "°F" : "°C"

  const upcomingHarvests = crops
    .filter((c) => c.expected_harvest_date && (daysUntil(c.expected_harvest_date) ?? -1) >= 0)
    .sort((a, b) => (a.expected_harvest_date! < b.expected_harvest_date! ? -1 : 1))
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Farm overview</h1>
        <p className="text-sm text-muted-foreground">
          {label(farmer.farmer_type)} farmer{farmer.farmer_code ? ` · ${farmer.farmer_code}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active crops" value={activeCrops.length} hint={`${crops.length} total`} icon={Sprout} />
        <StatCard
          label="Land under farm"
          value={totalAcres > 0 ? `${totalAcres.toFixed(1)} ac` : "—"}
          hint={`${lands.length} parcel${lands.length === 1 ? "" : "s"}`}
          icon={MapPinned}
          tone="muted"
        />
        <StatCard label="Wallet balance" value={formatCurrency(balance)} icon={Wallet} tone="accent" />
        <StatCard label="Unread alerts" value={unread} hint={`${notifications.length} recent`} icon={Bell} tone="muted" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weather snapshot */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Weather now</CardTitle>
            <Link href="/farmer/weather" className="text-xs font-medium text-primary hover:underline">
              7-day forecast
            </Link>
          </CardHeader>
          <CardContent>
            {weather ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <WeatherIcon
                    code={weather.now.weatherCode}
                    isDay={weather.now.isDay}
                    className="size-12 text-accent-foreground"
                  />
                  <div>
                    <p className="font-serif text-3xl font-semibold tabular-nums">
                      {Math.round(weather.now.temperature)}
                      {unitSymbol}
                    </p>
                    <p className="text-sm text-muted-foreground">{weatherLabel(weather.now.weatherCode)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-md bg-muted/60 p-2">
                    <Droplets className="mx-auto mb-1 size-4 text-primary" aria-hidden />
                    <p className="font-medium tabular-nums">{weather.now.humidity}%</p>
                    <p className="text-muted-foreground">Humidity</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-2">
                    <Wind className="mx-auto mb-1 size-4 text-primary" aria-hidden />
                    <p className="font-medium tabular-nums">{Math.round(weather.now.windSpeed)}</p>
                    <p className="text-muted-foreground">km/h</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-2">
                    <Droplets className="mx-auto mb-1 size-4 text-primary" aria-hidden />
                    <p className="font-medium tabular-nums">{weather.now.precipitation}</p>
                    <p className="text-muted-foreground">mm rain</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Weather data is unavailable right now.</p>
            )}
          </CardContent>
        </Card>

        {/* Active crops */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Active crop cycles</CardTitle>
            <Link href="/farmer/crops" className="text-xs font-medium text-primary hover:underline">
              Manage crops
            </Link>
          </CardHeader>
          <CardContent>
            {activeCrops.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Sprout className="size-8 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">No active crops yet.</p>
                <Link href="/farmer/crops" className="text-sm font-medium text-primary hover:underline">
                  Add your first crop
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {activeCrops.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {c.crop_name}
                        {c.variety ? <span className="text-muted-foreground"> · {c.variety}</span> : null}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.land?.land_name || "Unassigned land"} · {label(c.season)}
                        {c.expected_harvest_date ? ` · harvest ${formatDate(c.expected_harvest_date)}` : ""}
                      </p>
                    </div>
                    <CropStatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming harvests */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming harvests</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingHarvests.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No harvests scheduled.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {upcomingHarvests.map((c) => {
                  const d = daysUntil(c.expected_harvest_date)
                  return (
                    <li key={c.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.crop_name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(c.expected_harvest_date)}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {d === 0 ? "Today" : `in ${d} day${d === 1 ? "" : "s"}`}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent alerts</CardTitle>
            <Link href="/farmer/notifications" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        n.status === "unread" ? "bg-accent" : "bg-border"
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{n.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{n.body}</p>
                      <p className="text-[11px] text-muted-foreground">{relativeTime(n.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
