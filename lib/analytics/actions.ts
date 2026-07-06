"use server"

import { generateDashboardCSV } from "./queries"

export async function exportDashboardData(
  dashboardType: "founder" | "admin" | "operator" | "drone" | "marketplace",
  format: "csv" | "json" = "csv",
  operatorId?: string,
  dateRange?: { from: string; to: string }
) {
  try {
    const csv = await generateDashboardCSV(dashboardType, operatorId, dateRange)

    if (format === "json") {
      const lines = csv.split("\n")
      const headers = lines[0].split(",")
      const data = lines.slice(1).map((line) => {
        const values = line.split(",")
        const obj: Record<string, string> = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ""
        })
        return obj
      })
      return { ok: true, data: JSON.stringify(data, null, 2) }
    }

    return { ok: true, data: csv }
  } catch (error: any) {
    return { ok: false, error: error.message }
  }
}
