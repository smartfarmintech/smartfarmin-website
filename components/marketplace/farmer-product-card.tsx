'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface FarmerProductCardProps {
  productEmoji: string
  productName: string
  productCategory: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  inStock: boolean
  onAddToCart?: () => void
  onFavorite?: () => void
}

export function FarmerProductCard({
  productEmoji,
  productName,
  productCategory,
  price,
  originalPrice,
  rating,
  reviews,
  inStock,
  onAddToCart,
  onFavorite,
}: FarmerProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl border-2 border-forest-green/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
    >
      {/* Product Image Area */}
      <div className="relative bg-gradient-to-br from-soft-mint-50 to-forest-green/5 p-6 aspect-square flex items-center justify-center overflow-hidden">
        {/* Large emoji */}
        <motion.div
          className="text-7xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {productEmoji}
        </motion.div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-harvest-orange text-white px-3 py-1 rounded-full font-bold text-sm">
            -{discount}%
          </div>
        )}

        {/* Favorite button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsFavorited(!isFavorited)
            onFavorite?.()
          }}
          className="absolute top-3 left-3 bg-white rounded-full p-2.5 shadow-lg hover:bg-red-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </motion.button>

        {/* Stock indicator */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs font-semibold text-forest-green/60 uppercase tracking-wide mb-1">
          {productCategory}
        </p>

        {/* Product name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {productName}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(rating) ? '⭐' : '☆'}`}>
                {i < Math.floor(rating) ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-forest-green">₹{price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
          )}
        </div>

        {/* Add to cart button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddToCart}
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            inStock
              ? 'bg-forest-green text-white hover:bg-forest-green/90 active:bg-forest-green/80'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>
      </div>
    </motion.div>
  )
}
