import { Metadata } from 'next'
import { marketPrices } from '@/lib/ecosystems/business-ecosystem'

export const metadata: Metadata = {
  title: 'Market Intelligence | Rythu360',
  description: 'Real-time market prices and AI price forecasts for 50+ agricultural products',
}

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Market Intelligence</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time prices, trends, and AI-powered forecasts for 50+ agricultural products
          </p>
        </div>
      </section>

      {/* Price Data */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Current Market Prices</h2>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Download Report
            </button>
          </div>

          <div className="grid gap-6">
            {marketPrices.map((price) => {
              const isUp = price.trend === 'up'
              const isDown = price.trend === 'down'
              
              return (
                <div key={price.id} className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-md transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Product */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold">{price.product}</h3>
                      <p className="text-sm text-muted-foreground">{price.location}</p>
                    </div>

                    {/* Current Price */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                      <p className="text-xl font-bold">₹{price.currentPrice}</p>
                      <p className="text-xs text-muted-foreground">/{price.unit}</p>
                    </div>

                    {/* Trend */}
                    <div className="text-center">
                      <p className="flex items-center justify-center gap-2 font-bold">
                        <span className={isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-gray-500'}>
                          {isUp ? '↑' : isDown ? '↓' : '→'}
                        </span>
                        <span className={isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-gray-500'}>
                          {price.percentChange > 0 ? '+' : ''}{price.percentChange}%
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">vs ₹{price.previousPrice}</p>
                    </div>

                    {/* Forecast */}
                    {price.forecast && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">AI Forecast</p>
                        <div className="text-sm space-y-1">
                          <p>Next Week: ₹{price.forecast.nextWeek}</p>
                          <p className="text-muted-foreground">Month: ₹{price.forecast.nextMonth}</p>
                        </div>
                      </div>
                    )}

                    {/* Confidence */}
                    {price.forecast && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                        <p className="font-bold text-lg">{price.forecast.confidence}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <p className="text-sm text-muted-foreground mt-2">Products Tracked</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Real-time</div>
              <p className="text-sm text-muted-foreground mt-2">Price Updates</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">AI-Powered</div>
              <p className="text-sm text-muted-foreground mt-2">Forecasts</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">85%+</div>
              <p className="text-sm text-muted-foreground mt-2">Avg Accuracy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
