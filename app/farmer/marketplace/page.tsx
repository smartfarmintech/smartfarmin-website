import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductGrid } from '@/components/marketplace/product-grid'
import type { Product } from '@/lib/marketplace/types'

export const metadata = {
  title: 'Marketplace | Rythu360',
  description: 'Buy seeds, fertilizers, equipment and more for your farm',
}

// Mock products data - in production this would come from Supabase
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hybrid Rice Seeds - Premium Quality',
    slug: 'hybrid-rice-seeds',
    price: 450,
    compare_at_price: 500,
    short_description: 'High-yield hybrid rice variety',
    rating_avg: 4.5,
    rating_count: 324,
    tags: ['featured'],
    description: 'Premium hybrid rice seeds with high yield potential',
    sku: 'RIS-001',
    category_id: 'seeds',
    brand_id: 'brand1',
    seller_id: 'seller1',
    cost_price: 350,
    currency: 'INR',
    unit: 'kg',
    weight_grams: 1000,
    product_status: 'active',
    status: 'active',
    is_featured: true,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'NPK Fertilizer (12:32:16)',
    slug: 'npk-fertilizer',
    price: 320,
    compare_at_price: null,
    short_description: 'Balanced NPK ratio fertilizer',
    rating_avg: 4.3,
    rating_count: 156,
    tags: [],
    description: 'Balanced NPK fertilizer for all crops',
    sku: 'NPK-001',
    category_id: 'fertilizers',
    brand_id: 'brand2',
    seller_id: 'seller1',
    cost_price: 250,
    currency: 'INR',
    unit: 'kg',
    weight_grams: 50000,
    product_status: 'active',
    status: 'active',
    is_featured: false,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Organic Pesticide',
    slug: 'organic-pesticide',
    price: 280,
    compare_at_price: 295,
    short_description: 'Safe organic pest control',
    rating_avg: 4.6,
    rating_count: 89,
    tags: [],
    description: 'Organic pesticide safe for crops and environment',
    sku: 'ORP-001',
    category_id: 'pesticides',
    brand_id: 'brand3',
    seller_id: 'seller1',
    cost_price: 200,
    currency: 'INR',
    unit: 'liter',
    weight_grams: 1000,
    product_status: 'active',
    status: 'active',
    is_featured: false,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Drip Irrigation Kit',
    slug: 'drip-irrigation-kit',
    price: 1200,
    compare_at_price: null,
    short_description: 'Complete irrigation system',
    rating_avg: 4.4,
    rating_count: 45,
    tags: ['featured'],
    description: 'Complete drip irrigation system for small farms',
    sku: 'DRK-001',
    category_id: 'equipment',
    brand_id: 'brand4',
    seller_id: 'seller1',
    cost_price: 800,
    currency: 'INR',
    unit: 'set',
    weight_grams: 5000,
    product_status: 'active',
    status: 'active',
    is_featured: true,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Soil pH Meter',
    slug: 'soil-ph-meter',
    price: 899,
    compare_at_price: 1050,
    short_description: 'Digital soil pH testing',
    rating_avg: 4.2,
    rating_count: 67,
    tags: [],
    description: 'Digital soil pH meter for accurate testing',
    sku: 'PHM-001',
    category_id: 'equipment',
    brand_id: 'brand5',
    seller_id: 'seller1',
    cost_price: 600,
    currency: 'INR',
    unit: 'piece',
    weight_grams: 200,
    product_status: 'active',
    status: 'active',
    is_featured: false,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Organic Compost',
    slug: 'organic-compost',
    price: 150,
    compare_at_price: null,
    short_description: 'Rich organic soil amendment',
    rating_avg: 4.7,
    rating_count: 234,
    tags: [],
    description: 'Rich organic compost for soil enrichment',
    sku: 'COM-001',
    category_id: 'fertilizers',
    brand_id: 'brand6',
    seller_id: 'seller1',
    cost_price: 100,
    currency: 'INR',
    unit: 'kg',
    weight_grams: 50000,
    product_status: 'active',
    status: 'active',
    is_featured: false,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Marketplace</h1>
            <p className="text-gray-600">
              Quality seeds, fertilizers, equipment and more - all trusted by farmers like you
            </p>
          </div>

          <ProductGrid products={mockProducts} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
