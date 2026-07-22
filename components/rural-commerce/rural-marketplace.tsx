"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Filter,
  X,
  TrendingUp,
  Leaf,
  Beef,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { NearbyBusinessCard } from "./nearby-business-card"
import {
  RURAL_PRODUCTS,
  NEARBY_BUSINESS_LIST,
  type RuralCommerceCategory,
  type RuralProduct,
} from "@/lib/agreeConnect/rural-commerce"

const CATEGORIES: { key: RuralCommerceCategory; icon: typeof Leaf; label: string }[] = [
  { key: "Fresh Fruits", icon: Leaf, label: "Fresh Fruits" },
  { key: "Fresh Vegetables", icon: Leaf, label: "Fresh Vegetables" },
  { key: "Grains & Cereals", icon: Package, label: "Grains & Cereals" },
  { key: "Nursery & Plants", icon: Leaf, label: "Nursery & Plants" },
  { key: "Livestock", icon: Beef, label: "Livestock" },
  { key: "Dairy", icon: Package, label: "Dairy" },
  { key: "Organic Products", icon: Leaf, label: "Organic Products" },
  { key: "Farm Equipment", icon: Package, label: "Farm Equipment" },
  { key: "Agriculture Inputs", icon: Leaf, label: "Agriculture Inputs" },
]

type SortOption = "relevance" | "priceLow" | "priceHigh" | "rating" | "nearest"
type ViewMode = "marketplace" | "nearby"

export function RuralMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<RuralCommerceCategory | "All">("All")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("marketplace")
  const [maxPrice, setMaxPrice] = useState(500000)
  const [showOrganic, setShowOrganic] = useState(false)
  const [showVerified, setShowVerified] = useState(false)
  const [freshToday, setFreshToday] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = RURAL_PRODUCTS

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.seller.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    // Price filter
    filtered = filtered.filter((p) => p.price <= maxPrice)

    // Organic filter
    if (showOrganic) {
      filtered = filtered.filter((p) => p.organic)
    }

    // Verified filter
    if (showVerified) {
      filtered = filtered.filter((p) => p.verified)
    }

    // Fresh today filter
    if (freshToday) {
      filtered = filtered.filter((p) => p.freshToday)
    }

    // Stock filter
    filtered = filtered.filter((p) => p.inStock)

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return a.price - b.price
        case "priceHigh":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, searchQuery, maxPrice, showOrganic, showVerified, freshToday, sortBy])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Rural Commerce Marketplace</h1>
        <p className="text-gray-600">
          Connect directly with farmers, traders, and local businesses
        </p>
      </motion.div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={viewMode === "marketplace" ? "default" : "outline"}
          onClick={() => setViewMode("marketplace")}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Marketplace
        </Button>
        <Button
          variant={viewMode === "nearby" ? "default" : "outline"}
          onClick={() => setViewMode("nearby")}
          className="flex-1"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Nearby Businesses
        </Button>
      </div>

      {viewMode === "marketplace" ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search fruits, vegetables, grains, nursery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 mb-6 border border-primary/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Max Price
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600 mt-2">₹{maxPrice.toLocaleString("en-IN")}</p>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOrganic}
                        onChange={(e) => setShowOrganic(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Organic Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showVerified}
                        onChange={(e) => setShowVerified(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Verified Sellers</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freshToday}
                        onChange={(e) => setFreshToday(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Fresh Today</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            <motion.button
              key="all"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products
            </motion.button>
            {CATEGORIES.map(({ key, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 mb-6">
            Showing {filteredProducts.length} results
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 mb-4">No products found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setShowOrganic(false)
                  setShowVerified(false)
                  setFreshToday(false)
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {/* Nearby Businesses Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {NEARBY_BUSINESS_LIST.map((business) => (
                <motion.div
                  key={business.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <NearbyBusinessCard business={business} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  )
}
