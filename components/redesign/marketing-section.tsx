'use client'

import Image from 'next/image'
import { Star, Leaf, Zap, TrendingUp, Award, Heart, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Fertilizer Mix',
    category: 'Fertilizers',
    price: '₹450/kg',
    originalPrice: '₹550/kg',
    rating: 4.8,
    reviews: 342,
    image: '/images/fertilizer-premium.png',
    description: 'High-yield NPK blend for wheat & rice',
    discount: '18% off',
    featured: true,
  },
  {
    id: 2,
    name: 'Organic Pest Control',
    category: 'Pesticides',
    price: '₹320/liter',
    originalPrice: '₹400/liter',
    rating: 4.6,
    reviews: 187,
    image: '/images/pesticide.png',
    description: 'Natural, eco-friendly, safe for crops',
    discount: '20% off',
    featured: true,
  },
  {
    id: 3,
    name: 'High-Yield Seeds',
    category: 'Seeds',
    price: '₹1200/kg',
    originalPrice: '₹1500/kg',
    rating: 4.9,
    reviews: 521,
    image: '/images/seeds-premium.png',
    description: 'Certified varieties with disease resistance',
    discount: '20% off',
    featured: true,
  },
  {
    id: 4,
    name: 'Irrigation System',
    category: 'Equipment',
    price: '₹5,500',
    originalPrice: '₹7,000',
    rating: 4.7,
    reviews: 89,
    image: '/images/equipment.png',
    description: 'Drip irrigation kit for 1 acre',
    discount: '21% off',
    featured: false,
  },
  {
    id: 5,
    name: 'Soil Enhancer Pro',
    category: 'Soil Care',
    price: '₹380/kg',
    originalPrice: '₹500/kg',
    rating: 4.8,
    reviews: 278,
    image: '/images/fertilizer-premium.png',
    description: 'Biochar-based soil improvement',
    discount: '24% off',
    featured: false,
  },
  {
    id: 6,
    name: 'Multi-Crop Herbicide',
    category: 'Pesticides',
    price: '₹280/liter',
    originalPrice: '₹350/liter',
    rating: 4.5,
    reviews: 156,
    image: '/images/pesticide.png',
    description: 'Effective weed control, safe formula',
    discount: '20% off',
    featured: false,
  },
]

function ProductCard({ product, featured }: { product: typeof featuredProducts[0]; featured: boolean }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className={`rounded-2xl overflow-hidden transition-all hover:shadow-lg ${
      featured
        ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20'
        : 'bg-card border border-border'
    }`}>
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-secondary/40 to-secondary/20 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
          {product.discount}
        </div>
        {featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary mb-1">{product.category}</p>
            <h3 className="font-bold text-foreground text-sm line-clamp-2">{product.name}</h3>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-secondary/40 transition"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                liked
                  ? 'fill-destructive text-destructive'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground line-through">{product.originalPrice}</p>
          <p className="text-lg font-bold text-primary">{product.price}</p>
        </div>

        {/* Button */}
        <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export function MarketingSection() {
  const featuredItems = featuredProducts.filter(p => p.featured)
  const regularItems = featuredProducts.filter(p => !p.featured)

  return (
    <div className="space-y-8">
      {/* Featured Products Slider */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Our Top Picks
          </h3>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((product) => (
            <ProductCard key={product.id} product={product} featured={true} />
          ))}
        </div>
      </div>

      {/* Regular Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Recommended Products
          </h3>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Shop All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularItems.map((product) => (
            <ProductCard key={product.id} product={product} featured={false} />
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-3">Exclusive Summer Deals</h3>
            <p className="text-lg opacity-90 mb-6">
              Get up to 30% off on all farming supplies this season. Use code FARM2024 at checkout.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-primary-foreground text-primary rounded-lg font-bold hover:opacity-90 transition">
                Shop Now
              </button>
              <button className="px-6 py-3 border-2 border-primary-foreground rounded-lg font-bold hover:bg-white/10 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="text-6xl text-center opacity-20">
            ����
          </div>
        </div>
      </div>

      {/* Success Stories Banner */}
      <div className="rounded-2xl bg-card border border-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">Why Farmers Trust SmartFarmin</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <p className="text-foreground font-semibold mb-2">Active Farmers</p>
            <p className="text-sm text-muted-foreground">Growing community across India</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-foreground font-semibold mb-2">Quality Products</p>
            <p className="text-sm text-muted-foreground">Verified vendors & services</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">₹50Cr+</div>
            <p className="text-foreground font-semibold mb-2">Transactions</p>
            <p className="text-sm text-muted-foreground">Safe & secure marketplace</p>
          </div>
        </div>
      </div>
    </div>
  )
}
