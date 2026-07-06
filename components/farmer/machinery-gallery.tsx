"use client"

import { useState } from "react"
import Link from "next/link"
import { formatMachineRate } from "@/lib/farmer/format"
import type { MachineCatalogItem } from "@/lib/farmer/types"
import { Star } from "lucide-react"

interface MachineryGalleryProps {
  initialMachines?: MachineCatalogItem[]
}

export function MachineryGallery({ initialMachines = [] }: MachineryGalleryProps) {
  const [machines] = useState<MachineCatalogItem[]>(initialMachines)
  const [error] = useState<string | null>(null)

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>
  }

  if (machines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No machinery available at the moment</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <Link
          key={machine.id}
          href={`/farmer/machinery/${machine.id}`}
          className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200"
        >
          <div className="relative h-48 overflow-hidden bg-muted">
            {machine.image_url ? (
              <img
                src={machine.image_url}
                alt={machine.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <span>No image</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                {machine.name}
              </h3>
              <p className="text-sm text-muted-foreground">{machine.category}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {machine.avg_rating ? (
                  <>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{machine.avg_rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({machine.total_reviews})
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No ratings yet</span>
                )}
              </div>
            </div>

            <div className="space-y-1 border-t border-border pt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Hourly:</span>
                <span className="font-semibold">{formatMachineRate(machine.hourly_rate, "hr")}</span>
              </div>
              {machine.daily_rate && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Daily:</span>
                  <span className="font-semibold">{formatMachineRate(machine.daily_rate, "day")}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Owner: {machine.owner_name || "N/A"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
