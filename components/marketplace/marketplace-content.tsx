'use client'

import { useState } from 'react'
import { FarmerProductCard } from '@/components/marketplace/farmer-product-card'

const mockProducts = [
  { emoji: '🌾', name: 'Hybrid Rice Seeds', category: 'Seeds', price: 450, originalPrice: 500, rating: 4.5, reviews: 324, inStock: true },
  { emoji: '🧂', name: 'NPK Fertilizer (12:32:16)', category: 'Fertilizers', price: 320, originalPrice: null, rating: 4.3, reviews: 156, inStock: true },
  { emoji: '🐛', name: 'Organic Pesticide', category: 'Pesticides', price: 280, originalPrice: 295, rating: 4.6, reviews: 89, inStock: true },
  { emoji: '💧', name: 'Drip Irrigation Kit', category: 'Equipment', price: 1200, originalPrice: null, rating: 4.4, reviews: 45, inStock: true },
  { emoji: '🧪', name: 'Soil pH Meter', category: 'Equipment', price: 899, originalPrice: 1050, rating: 4.2, reviews: 67, inStock: false },
  { emoji: '🌱', name: 'Organic Compost', category: 'Fertilizers', price: 150, originalPrice: null, rating: 4.7, reviews: 234, inStock: true },
  { emoji: '🥬', name: 'Vegetable Seeds Mix', category: 'Seeds', price: 220, originalPrice: 250, rating: 4.4, reviews: 112, inStock: true },
  { emoji: '🌿', name: 'Neem Oil Spray', category: 'Pesticides', price: 180, originalPrice: 200, rating: 4.5, reviews: 98, inStock: true },
]

export function MarketplaceContent() {
  const [filter, setFilter] = useState('all')
  const [cart, setCart] = useState<string[]>([])

  const categories = ['all', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment']
  const filteredProducts = filter === 'all' ? mockProducts : mockProducts.filter((p) => p.category === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-lg text-gray-600">Quality seeds, fertilizers, equipment and more</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-forest-green text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <FarmerProductCard
            key={idx}
            productEmoji={product.emoji}
            productName={product.name}
            productCategory={product.category}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviews={product.reviews}
            inStock={product.inStock}
            onAddToCart={() => {
              setCart([...cart, product.name])
              alert(`${product.name} added to cart!`)
            }}
          />
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-forest-green text-white px-6 py-4 rounded-full shadow-2xl">
          <span className="font-bold text-lg">{cart.length} items in cart</span>
        </div>
      )}
    </div>
  )
}
