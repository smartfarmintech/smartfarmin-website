import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react"

function iconForCode(code: number, isDay = true): LucideIcon {
  if (code === 0) return isDay ? Sun : Sun
  if (code === 1 || code === 2) return CloudSun
  if (code === 3) return Cloud
  if (code === 45 || code === 48) return CloudFog
  if (code >= 51 && code <= 57) return CloudDrizzle
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return CloudSnow
  if (code >= 95) return CloudLightning
  return Cloud
}

export function WeatherIcon({
  code,
  isDay = true,
  className,
}: {
  code: number
  isDay?: boolean
  className?: string
}) {
  const Icon = iconForCode(code, isDay)
  return <Icon className={className} aria-hidden />
}
