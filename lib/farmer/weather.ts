import type { TemperatureUnit } from "./constants"
import type { WeatherResult } from "./types"

// Maps WMO weather interpretation codes to a short human label.
export const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Thunderstorm w/ hail",
}

export function weatherLabel(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Unknown"
}

/**
 * Fetches current + 7-day forecast from Open-Meteo (no API key required).
 * Cached for 15 minutes at the fetch layer.
 */
export async function fetchWeather(
  latitude: number,
  longitude: number,
  unit: TemperatureUnit = "celsius",
): Promise<WeatherResult | null> {
  const tempUnit = unit === "fahrenheit" ? "fahrenheit" : "celsius"
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: tempUnit,
    wind_speed_unit: "kmh",
  })

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      next: { revalidate: 900 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as OpenMeteoResponse

    const daily: WeatherResult["daily"] = (json.daily?.time ?? []).map((date, i) => ({
      date,
      weatherCode: json.daily!.weather_code[i],
      tempMax: json.daily!.temperature_2m_max[i],
      tempMin: json.daily!.temperature_2m_min[i],
      precipitationSum: json.daily!.precipitation_sum[i],
      precipitationProbabilityMax: json.daily!.precipitation_probability_max?.[i] ?? null,
      windSpeedMax: json.daily!.wind_speed_10m_max[i],
    }))

    return {
      latitude: json.latitude,
      longitude: json.longitude,
      timezone: json.timezone,
      unit,
      now: {
        temperature: json.current.temperature_2m,
        apparentTemperature: json.current.apparent_temperature,
        humidity: json.current.relative_humidity_2m,
        precipitation: json.current.precipitation,
        windSpeed: json.current.wind_speed_10m,
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day === 1,
        time: json.current.time,
      },
      daily,
    }
  } catch {
    return null
  }
}

interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    precipitation_probability_max?: number[]
    wind_speed_10m_max: number[]
  }
}
