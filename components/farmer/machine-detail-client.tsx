"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MachineDetail } from "@/lib/farmer/types"
import { formatMachineRate } from "@/lib/farmer/format"
import { BookingDialog } from "./booking-dialog"

interface MachineDetailClientProps {
  machine: MachineDetail
}

export function MachineDetailClient({ machine }: MachineDetailClientProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur p-4">
          <Link href="/farmer/machinery" className="inline-flex items-center gap-2 text-sm hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            Back to Machinery
          </Link>
        </div>

        <div className="p-6 space-y-6">
          {/* Image & Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg overflow-hidden bg-muted h-96">
              {machine.image_url ? (
                <img
                  src={machine.image_url}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{machine.name}</h1>
                <p className="text-muted-foreground">{machine.category}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {machine.avg_rating ? (
                  <>
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{machine.avg_rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({machine.total_reviews} {machine.total_reviews === 1 ? "review" : "reviews"})
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No ratings yet</span>
                )}
              </div>

              {/* Owner Info */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-semibold">{machine.owner_name || "Not specified"}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
                <p className="text-sm font-semibold">Pricing</p>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Hourly Rate:</span>
                    <span className="font-semibold">{formatMachineRate(machine.hourly_rate, "hr")}</span>
                  </div>
                  {machine.daily_rate && (
                    <div className="flex justify-between text-sm">
                      <span>Daily Rate:</span>
                      <span className="font-semibold">{formatMachineRate(machine.daily_rate, "day")}</span>
                    </div>
                  )}
                  {machine.weekly_rate && (
                    <div className="flex justify-between text-sm">
                      <span>Weekly Rate:</span>
                      <span className="font-semibold">{formatMachineRate(machine.weekly_rate, "week")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={() => setShowBookingDialog(true)}
                size="lg"
                className="w-full"
              >
                Book This Machine
              </Button>
            </div>
          </div>

          {/* Description */}
          {machine.description && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About This Machine</h2>
              <p className="text-muted-foreground">{machine.description}</p>
            </div>
          )}

          {/* Features & Certifications */}
          <div className="grid gap-4 md:grid-cols-2">
            {machine.features && machine.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="space-y-1">
                  {machine.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {machine.certifications && machine.certifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Certifications</h3>
                <ul className="space-y-1">
                  {machine.certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Warranty */}
          {machine.warranty_details && (
            <div className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold">Warranty & Support</h3>
              <p className="text-sm text-muted-foreground">{machine.warranty_details}</p>
            </div>
          )}

          {/* Reviews */}
          {machine.reviews && machine.reviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Customer Reviews</h2>
              <div className="grid gap-4">
                {machine.reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{review.reviewer_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        machine={machine}
      />
    </div>
  )
}
