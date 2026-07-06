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
          key={machine.machine_id}
          href={`/farmer/machinery/${machine.machine_id}`}
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
              <p className="text-sm text-muted-foreground">{machine.category_name ?? "Machinery"}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {machine.rating_avg && machine.rating_count > 0 ? (
                  <>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{machine.rating_avg.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({machine.rating_count})
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No ratings yet</span>
                )}
              </div>
            </div>

            <div className="space-y-1 border-t border-border pt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Starting at:</span>
                <span className="font-semibold">{formatMachineRate(machine.min_price, machine.min_unit)}</span>
              </div>
            </div>

            {machine.base_location && (
              <p className="text-xs text-muted-foreground truncate">{machine.base_location}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
