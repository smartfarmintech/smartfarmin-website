import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { SearchFilters, CATEGORIES } from "@/components/marketplace/search-filters"

interface CategoryPageProps {
  params: { id: string }
}

async function CategoryProducts({ categoryId }: { categoryId: string }) {
  const category = CATEGORIES.find((c) => c.id === categoryId)

  // Mock products for category
  const products = [
    {
      id: "1",
      name: "Premium Hybrid Paddy Seeds",
      slug: "premium-hybrid-paddy-seeds",
      price: 850,
      compare_at_price: 1200,
      short_description: "High-yielding hybrid seeds",
      rating_avg: 4.5,
      rating_count: 128,
      tags: ["featured"],
      description: null,
      sku: "SEEDS-001",
      category_id: "seeds",
      brand_id: null,
      seller_id: "seller-001",
      currency: "INR",
      unit: "kg",
      weight_grams: 500,
      product_status: "active",
      status: "active",
      is_featured: true,
      metadata: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-20",
    },
    {
      id: "2",
      name: "Organic Fertilizer 20kg",
      slug: "organic-fertilizer-20kg",
      price: 1200,
      compare_at_price: 1500,
      short_description: "Eco-friendly crop nutrition",
      rating_avg: 4.8,
      rating_count: 256,
      tags: [],
      description: null,
      sku: "FERT-001",
      category_id: "fertilizers",
      brand_id: null,
      seller_id: "seller-002",
      currency: "INR",
      unit: "kg",
      weight_grams: 20000,
      product_status: "active",
      status: "active",
      is_featured: false,
      metadata: null,
      created_at: "2024-01-05",
      updated_at: "2024-01-20",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{category?.name} Products</h2>
      <ProductGrid products={products} />
    </div>
  )
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.id === params.id)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <a href="/marketplace" className="hover:text-primary">Marketplace</a>
            <span className="mx-2">/</span>
            <span>{category?.name}</span>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div>
              <SearchFilters />
            </div>

            {/* Products */}
            <div className="md:col-span-3">
              <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...Array(9)].map((_, i) => <div key={i} className="animate-pulse rounded-lg bg-muted h-64" />)}</div>}>
                <CategoryProducts categoryId={params.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
