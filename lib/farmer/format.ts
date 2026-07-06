export function formatDate(value: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-IN", opts ?? { day: "numeric", month: "short", year: "numeric" }).format(d)
}

export function formatDateTime(value: string | null | undefined): string {
  return formatDate(value, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}

export function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const diff = d.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function relativeTime(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  const diffMs = d.getTime() - Date.now()
  const abs = Math.abs(diffMs)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const minutes = Math.round(diffMs / 60000)
  const hours = Math.round(diffMs / 3600000)
  const days = Math.round(diffMs / 86400000)
  if (abs < 3600000) return rtf.format(minutes, "minute")
  if (abs < 86400000) return rtf.format(hours, "hour")
  return rtf.format(days, "day")
}

// Machinery & Booking Formatters

/** Maps the `pricing_unit` enum to a short, human-friendly label */
const PRICING_UNIT_LABELS: Record<string, string> = {
  per_hour: "hr",
  per_day: "day",
  per_acre: "acre",
  per_km: "km",
  flat: "job",
}

export function pricingUnitLabel(unit: string | null | undefined): string {
  if (!unit) return ""
  return PRICING_UNIT_LABELS[unit] ?? unit
}

export function formatMachineRate(
  rate: number | null | undefined,
  unit: string | null | undefined,
  currency = "₹",
): string {
  if (rate == null) return "On request"
  const label = pricingUnitLabel(unit)
  return label ? `${currency}${rate.toFixed(0)} / ${label}` : `${currency}${rate.toFixed(0)}`
}

export function formatBookingAmount(amount: number, currency = "₹"): string {
  return `${currency}${amount.toFixed(2)}`
}

export function formatBookingDuration(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const diffMs = end.getTime() - start.getTime()
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  return `${hours}h`
}
