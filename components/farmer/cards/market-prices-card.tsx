import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'

export async function MarketPricesCard() {
  // TODO: Integrate with real market price API
  const crops = [
    { name: 'Rice', price: '₹4,200/q', change: '+2.5%', positive: true },
    { name: 'Wheat', price: '₹2,100/q', change: '-1.2%', positive: false },
    { name: 'Cotton', price: '₹6,800/q', change: '+3.1%', positive: true }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Prices</CardTitle>
        <CardDescription>Today's rates in your region</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {crops.map((crop) => (
            <div key={crop.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{crop.name}</p>
                <p className="text-xs text-muted-foreground">{crop.price}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${crop.positive ? 'text-green-600' : 'text-red-600'}`}>
                {crop.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {crop.change}
              </div>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/dashboard/farmer/market">View Full Prices</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
