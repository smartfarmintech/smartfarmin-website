'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: any) => void
}

export function AdvancedMachinerySearch({ onSearch }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: '',
    distance: '',
    rating: '',
    verified: false,
  })

  const handleSearch = () => {
    onSearch?.(searchQuery, filters)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search machinery by type, owner, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {showFilters && (
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                className="w-full rounded-lg border border-border px-3 py-2"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="tractor">Tractor</option>
                <option value="harvester">Harvester</option>
                <option value="sprayer">Sprayer</option>
                <option value="drone">Drone</option>
                <option value="jcb">JCB</option>
                <option value="rotavator">Rotavator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Max Price (₹/hour)</label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Distance (km)</label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={filters.distance}
                onChange={(e) => setFilters({ ...filters, distance: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Min Rating</label>
              <select
                className="w-full rounded-lg border border-border px-3 py-2"
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>

            <div className="lg:col-span-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                  className="rounded"
                />
                <Zap className="h-4 w-4" />
                Verified Operators Only
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} className="flex-1">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ category: '', maxPrice: '', distance: '', rating: '', verified: false })
              }}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
