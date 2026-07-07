export const dynamic = 'force-dynamic'
export const metadata = { title: 'Marketplace | Rythu360', description: 'Buy and sell farm produce at fair prices' }

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Heart, Star, Filter } from 'lucide-react'
import Link from 'next/link'

async function getMarketplaceData() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('v_product_catalog')
    .select('*')
    .eq('product_status', 'active')
    .limit(20)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .limit(10)

  return { products: products || [], categories: categories || [] }
}

export default async function MarketplacePage() {
  const { products, categories } = await getMarketplaceData()

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell quality farm products</p>
        </div>
        <Button asChild>
          <Link href="/seller/dashboard">Become a Seller</Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search products..." className="flex-1" />
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat: any) => (
            <Button key={cat.id} variant="outline" size="sm" asChild>
              <Link href={`/marketplace/category/${cat.slug}`}>{cat.name}</Link>
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <Card key={product.product_id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center text-muted-foreground">
              {product.primary_image_url ? <img src={product.primary_image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : 'Image'}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{product.price}</span>
                {product.compare_at_price && <span className="text-xs line-through text-muted-foreground">₹{product.compare_at_price}</span>}
              </div>
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{product.rating_avg?.toFixed(1) || 'N/A'} ({product.rating_count || 0})</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" asChild className="flex-1">
                <Link href={`/marketplace/${product.product_id}`}>View</Link>
              </Button>
              <Button size="sm" variant="ghost">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
