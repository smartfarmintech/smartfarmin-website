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
