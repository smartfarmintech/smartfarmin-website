'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface MarketDashboardProps {
  farmer: any
}

const CROPS = [
  { name: 'Rice', unit: '₹/quintal', current: 4200, yesterday: 4100, week: 4050, month: 4150 },
  { name: 'Wheat', unit: '₹/quintal', current: 2100, yesterday: 2120, week: 2080, month: 2090 },
  { name: 'Cotton', unit: '₹/bale', current: 6800, yesterday: 6600, week: 6700, month: 6500 },
  { name: 'Groundnut', unit: '₹/kg', current: 65, yesterday: 64, week: 63, month: 62 },
  { name: 'Sugarcane', unit: '₹/quintal', current: 3200, yesterday: 3150, week: 3100, month: 3180 },
  { name: 'Maize', unit: '₹/quintal', current: 1950, yesterday: 1980, week: 1920, month: 1900 },
]

const PRICE_HISTORY = [
  { date: 'Mon', rice: 4100, wheat: 2120, cotton: 6600 },
  { date: 'Tue', rice: 4120, wheat: 2110, cotton: 6650 },
  { date: 'Wed', rice: 4150, wheat: 2100, cotton: 6700 },
  { date: 'Thu', rice: 4180, wheat: 2090, cotton: 6750 },
  { date: 'Fri', rice: 4200, wheat: 2100, cotton: 6800 },
  { date: 'Sat', rice: 4190, wheat: 2110, cotton: 6780 },
  { date: 'Sun', rice: 4200, wheat: 2120, cotton: 6800 },
]

export function MarketDashboard({ farmer }: MarketDashboardProps) {
  const [selectedCrop, setSelectedCrop] = useState('Rice')
  const [sortBy, setSortBy] = useState<'price' | 'change'>('price')

  const getCropTrend = (crop: typeof CROPS[0]) => {
    const change = crop.current - crop.yesterday
    const percentChange = ((change / crop.yesterday) * 100).toFixed(2)
    return { change, percentChange, isPositive: change > 0 }
  }

  const sortedCrops = [...CROPS].sort((a, b) => {
    if (sortBy === 'price') {
      return b.current - a.current
    } else {
      const aChange = a.current - a.yesterday
      const bChange = b.current - b.yesterday
      return bChange - aChange
    }
  })

  return (
    <div className="space-y-6">
      {/* Price Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Trends (Last 7 Days)</CardTitle>
          <CardDescription>Major commodities price movement</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={PRICE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rice" stroke="#4CAF50" name="Rice (₹/q)" />
              <Line type="monotone" dataKey="wheat" stroke="#FFC107" name="Wheat (₹/q)" />
              <Line type="monotone" dataKey="cotton" stroke="#FF6F00" name="Cotton (₹/bale)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Prices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Market Prices</CardTitle>
              <CardDescription>Updated every hour</CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('price')}
                className={`px-3 py-1 rounded text-sm ${sortBy === 'price' ? 'bg-green-600 text-white' : 'bg-accent'}`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('change')}
                className={`px-3 py-1 rounded text-sm ${sortBy === 'change' ? 'bg-green-600 text-white' : 'bg-accent'}`}
              >
                Change
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedCrops.map((crop) => {
              const { change, percentChange, isPositive } = getCropTrend(crop)
              return (
                <div key={crop.name} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold">{crop.name}</p>
                    <p className="text-xs text-muted-foreground">{crop.unit}</p>
                  </div>
                  
                  <div className="text-right mr-4">
                    <p className="font-semibold text-lg">{crop.current}</p>
                    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{Math.abs(parseFloat(percentChange))}%</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Daily change</p>
                    <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{change}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Price Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Price Statistics - {selectedCrop}</CardTitle>
          <CardDescription>7-day price analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const crop = CROPS.find(c => c.name === selectedCrop)
              if (!crop) return null
              
              return [
                { label: 'Current', value: `${crop.current} ${crop.unit}` },
                { label: 'Yesterday', value: `${crop.yesterday} ${crop.unit}` },
                { label: 'Weekly Avg', value: `${((crop.current + crop.yesterday + crop.week) / 3).toFixed(0)} ${crop.unit}` },
                { label: 'Monthly Low', value: `${Math.min(crop.current, crop.yesterday, crop.week, crop.month)} ${crop.unit}` },
              ].map((stat, idx) => (
                <div key={idx} className="bg-card rounded-lg p-4 border">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              ))
            })()}
          </div>

          {/* Crop Selection */}
          <div className="mt-6">
            <p className="text-sm font-semibold mb-3">Select crop for detailed view:</p>
            <div className="flex flex-wrap gap-2">
              {CROPS.map((crop) => (
                <button
                  key={crop.name}
                  onClick={() => setSelectedCrop(crop.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCrop === crop.name
                      ? 'bg-green-600 text-white'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  {crop.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Market Tips</CardTitle>
          <CardDescription>Data-driven insights for better trading decisions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">Good Time to Sell</p>
            <p className="text-xs text-green-700 dark:text-green-200 mt-1">Rice prices are at a 30-day high. Consider harvesting if ready.</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Market Trend</p>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">Overall agricultural commodity prices show bullish trend this week.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
