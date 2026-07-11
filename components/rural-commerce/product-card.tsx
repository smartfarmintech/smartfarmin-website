"use client"

import { Heart, MapPin, Phone, MessageCircle, ShoppingCart, Badge } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/rythu360/glass-card"
import { formatINR, discountPct, type RuralProduct } from "@/lib/rythu360/rural-commerce"
import { useState } from "react"

interface ProductCardProps {
  product: RuralProduct
  onAddToCart?: (product: RuralProduct) => void
  onWishlist?: (product: RuralProduct) => void
}

export function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const discount = product.mrp ? discountPct(product.price, product.mrp) : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <GlassCard className="h-full overflow-hidden flex flex-col bg-white/80 backdrop-blur-sm border border-white/20 hover:border-primary/30 transition-colors">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {product.category === "Fresh Fruits" && "🍎"}
              {product.category === "Fresh Vegetables" && "🥬"}
              {product.category === "Grains & Cereals" && "🌾"}
              {product.category === "Nursery & Plants" && "🌱"}
              {product.category === "Livestock" && "🐄"}
              {product.category === "Dairy" && "🥛"}
              {product.category === "Organic Products" && "🍃"}
              {product.category === "Farm Equipment" && "🔧"}
              {product.category === "Agriculture Inputs" && "🧪"}
            </div>
            <p className="text-xs text-gray-500 font-medium">{product.category}</p>
          </div>
          
          {/* Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.verified && (
              <Badge className="bg-primary text-white text-xs">Verified</Badge>
            )}
            {product.organic && (
              <Badge className="bg-green-600 text-white text-xs">Organic</Badge>
            )}
            {product.freshToday && (
              <Badge className="bg-orange-500 text-white text-xs">Fresh Today</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">{discount}% OFF</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted)
              onWishlist?.(product)
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Seller & Location */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">{product.seller}</p>
              {product.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </div>
              )}
            </div>
            {product.distance && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {product.distance}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <span className="text-yellow-400">★</span>
              <span className="text-xs font-medium text-gray-900">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatINR(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
            <span className="text-xs text-gray-600">/ {product.unit}</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => onAddToCart?.(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 hover:bg-accent/10"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
