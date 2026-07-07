export const dynamic = 'force-dynamic'
export const metadata = { title: 'Organic Marketplace | Rythu360', description: 'Shop certified organic products from trusted farms' }

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, Shield, Star, TrendingUp } from 'lucide-react'

async function getOrganicData() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('v_organic_catalog')
    .select('*')
    .eq('product_status', 'active')
    .limit(24)

  const { data: farms } = await supabase
    .from('organic_farms')
    .select('*')
    .eq('farm_status', 'active')
    .eq('is_certified', true)
    .order('rating_avg', { ascending: false })
    .limit(6)

  return { products: products || [], farms: farms || [] }
}

export default async function OrganicMarketplacePage() {
  const { products, farms } = await getOrganicData()

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-sm font-semibold text-green-600">100% Organic & Certified</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Organic Marketplace</h1>
            <p className="text-muted-foreground">Direct from certified organic farms to your table</p>
          </div>
          <Shield className="w-16 h-16 text-green-200 opacity-50" />
        </div>
      </div>

      {farms.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Certified Farms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farms.map((farm: any) => (
              <Card key={farm.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{farm.farm_name}</h3>
                    <p className="text-xs text-muted-foreground">Organic since {new Date(farm.organic_since).getFullYear()}</p>
                  </div>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{farm.description}</p>

                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{farm.rating_avg?.toFixed(1) || 'N/A'}</span>
                    <span className="text-muted-foreground">({farm.rating_count || 0})</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Certified</Badge>
                </div>

                <Button size="sm" asChild className="w-full">
                  <a href={`/organic/farm/${farm.id}`}>View Farm</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Organic Products</h2>
          <Button variant="outline" asChild>
            <a href="/organic/products">View All</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <Card key={product.product_id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center text-muted-foreground">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : 'Image'}
                </div>
                {product.is_seasonal && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">Seasonal</Badge>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.farm_name}</p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">₹{product.price}</span>
                  <Badge variant="outline" className="text-xs">{product.unit}</Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{product.rating_avg?.toFixed(1) || 'N/A'}</span>
                </div>

                {product.best_before_date && (
                  <p className="text-xs text-muted-foreground">Best by: {new Date(product.best_before_date).toLocaleDateString()}</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" asChild className="flex-1">
                  <a href={`/organic/product/${product.product_id}`}>View</a>
                </Button>
                <Button size="sm" variant="outline">Add</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Why Choose Organic?
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-green-700 mb-1">No Chemicals</p>
            <p className="text-muted-foreground">100% chemical-free and pesticide-free products</p>
          </div>
          <div>
            <p className="font-semibold text-green-700 mb-1">Fair Pricing</p>
            <p className="text-muted-foreground">Direct from certified farms at transparent prices</p>
          </div>
          <div>
            <p className="font-semibold text-green-700 mb-1">Fresh & Healthy</p>
            <p className="text-muted-foreground">Freshly harvested and delivered to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  )
}
