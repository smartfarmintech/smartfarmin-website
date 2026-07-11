"use client"

import { MapPin, Phone, MessageCircle, Navigation, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/rythu360/glass-card"
import { type NearbyBusiness } from "@/lib/rythu360/rural-commerce"

interface NearbyBusinessCardProps {
  business: NearbyBusiness
  onDirection?: (business: NearbyBusiness) => void
}

export function NearbyBusinessCard({ business, onDirection }: NearbyBusinessCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <GlassCard className="h-full overflow-hidden flex flex-col bg-white/80 backdrop-blur-sm border border-white/20 hover:border-accent/30 transition-colors">
        {/* Image Container */}
        <div className="relative w-full h-40 bg-gradient-to-br from-accent/10 to-primary/10 overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">
              {business.type === "Agricultural Store" && "🏪"}
              {business.type === "Equipment Rental" && "🚜"}
              {business.type === "Food Market" && "🛒"}
              {business.type === "Seeds Dealer" && "🌰"}
              {business.type === "Veterinary Clinic" && "⚕️"}
              {business.type === "Processing Unit" && "🏭"}
              {business.type === "Cooperative Society" && "🤝"}
              {business.type === "Farm Services" && "🛠️"}
              {business.type === "Dairy Collection" && "🥛"}
              {business.type === "Storage Facility" && "📦"}
              {!["Agricultural Store", "Equipment Rental", "Food Market", "Seeds Dealer", "Veterinary Clinic", "Processing Unit", "Cooperative Society", "Farm Services", "Dairy Collection", "Storage Facility"].includes(business.type) && "🏢"}
            </div>
            <p className="text-xs text-gray-500 font-medium">{business.type}</p>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                business.openNow
                  ? "bg-green-500/90 text-white"
                  : "bg-gray-500/90 text-white"
              }`}
            >
              <Clock className="w-3 h-3" />
              {business.openNow ? "Open" : "Closed"}
            </div>
          </div>

          {/* Distance */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
            {business.distance}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Name & Type */}
          <div>
            <h3 className="font-bold text-base text-gray-900">{business.name}</h3>
            <p className="text-xs text-gray-600 font-medium">{business.type}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <span>{business.location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-bold text-gray-900">{business.rating}</span>
            </div>
            <span className="text-xs text-gray-500">Highly Rated</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {business.directions && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-accent hover:bg-accent/90"
                onClick={() => onDirection?.(business)}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            )}
            {business.phone && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-primary/20 text-primary"
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            )}
            {business.whatsapp && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-green-50"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
