export function formatDate(value: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-IN", opts ?? { day: "numeric", month: "short", year: "numeric" }).format(d)
}

export function formatDateTime(value: string | null | undefined): string {
  return formatDate(value, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}

export function formatCurrency(value: number | null | undefined, currency = "INR"): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n)
}

export function formatNumber(value: number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—"
  return `${new Intl.NumberFormat("en-IN").format(value)}${suffix ? ` ${suffix}` : ""}`
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

/** Formats a datetime into the value shape expected by <input type="datetime-local">. */
export function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}
