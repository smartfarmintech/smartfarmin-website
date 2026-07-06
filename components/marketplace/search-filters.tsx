"use client"

import { useState } from "react"
import { Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const CATEGORIES = [
  { id: "seeds", name: "Seeds", icon: "🌱" },
  { id: "fertilizers", name: "Fertilizers", icon: "🧪" },
  { id: "pesticides", name: "Pesticides", icon: "🦠" },
  { id: "organic", name: "Organic Products", icon: "🌿" },
  { id: "equipment", name: "Equipment", icon: "⚙️" },
]

interface SearchFiltersProps {
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string) => void
  onPriceRange?: (min: number, max: number) => void
}

export function SearchFilters({ onSearch, onCategoryChange, onPriceRange }: SearchFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    onCategoryChange?.(categoryId)
  }

  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange = { ...priceRange, [type]: value }
    setPriceRange(newRange)
    onPriceRange?.(newRange.min, newRange.max)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            onSearch?.(e.target.value)
          }}
          className="pl-10"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden w-full"
      >
        <ChevronDown className="h-4 w-4 mr-2" />
        Filters
      </Button>

      {/* Filters Panel */}
      <div className={cn("space-y-4", !showFilters && "hidden md:block")}>
        {/* Categories */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "p-2 rounded-lg border transition-colors text-sm text-left",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary"
                )}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Min</label>
                <Input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Max</label>
                <Input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", Number(e.target.value))}
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              ₹{priceRange.min.toLocaleString("en-IN")} - ₹{priceRange.max.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Other</h3>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked={false} />
            Verified Sellers Only
          </label>
          <label className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" defaultChecked={false} />
            In Stock Only
          </label>
          <label className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" defaultChecked={false} />
            Free Shipping
          </label>
        </div>
      </div>
    </div>
  )
}
