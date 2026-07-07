'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, TrendingUp, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/cards/glass-card';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  discount: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Premium Hybrid Seeds',
    category: 'Seeds',
    price: 450,
    originalPrice: 650,
    rating: 4.8,
    reviews: 1243,
    image: '🌱',
    discount: 30,
    inStock: true,
  },
  {
    id: 2,
    name: 'Organic Fertilizer 25kg',
    category: 'Fertilizers',
    price: 890,
    originalPrice: 1200,
    rating: 4.6,
    reviews: 856,
    image: '🧪',
    discount: 26,
    inStock: true,
  },
  {
    id: 3,
    name: 'Natural Pesticide Spray',
    category: 'Pesticides',
    price: 320,
    originalPrice: 450,
    rating: 4.7,
    reviews: 567,
    image: '🌿',
    discount: 29,
    inStock: true,
  },
  {
    id: 4,
    name: 'Steel Hand Tools Set',
    category: 'Tools',
    price: 1250,
    originalPrice: 1800,
    rating: 4.9,
    reviews: 2341,
    image: '🔧',
    discount: 31,
    inStock: true,
  },
  {
    id: 5,
    name: 'Tractor Spare Parts Kit',
    category: 'Machinery',
    price: 3200,
    originalPrice: 4500,
    rating: 4.5,
    reviews: 432,
    image: '⚙️',
    discount: 29,
    inStock: true,
  },
  {
    id: 6,
    name: 'Organic Rice 20kg',
    category: 'Organic Products',
    price: 1650,
    originalPrice: 2200,
    rating: 4.8,
    reviews: 3456,
    image: '🌾',
    discount: 25,
    inStock: true,
  },
];

const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Machinery', 'Organic Products'];

export function MarketplacePremium() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Agriculture Marketplace
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">
            Quality products from verified sellers at competitive prices
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-10 space-y-6 fade-in">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-white/40" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white border border-green-500'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-white/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500/50"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`fade-in stagger-item-${(index % 9) + 1}`}
            >
              <GlassCard hover variant="lg" className="h-full flex flex-col">
                {/* Product image area */}
                <div className="relative mb-4 -mx-6 -mt-8 mx-0 pt-0">
                  <div className="h-48 bg-gradient-to-br from-white/10 to-white/5 rounded-t-2xl flex items-center justify-center text-6xl relative">
                    {product.image}
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 left-4 p-2 rounded-lg transition-all ${
                        wishlist.includes(product.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <Heart className="size-5" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Product info */}
                <div className="flex-grow">
                  <div className="text-xs text-green-400 font-semibold mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/70">
                      {product.rating} ({product.reviews.toLocaleString()})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-white/50 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock status and CTA */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold text-green-400">
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0 transition-all duration-300"
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center fade-in">
          <Button
            className="px-8 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            size="lg"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
