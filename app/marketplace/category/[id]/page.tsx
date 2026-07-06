import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { SearchFilters, CATEGORIES } from "@/components/marketplace/search-filters"
import { getProducts } from "@/lib/marketplace/queries"
import type { Product } from "@/lib/marketplace/types"

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

async function CategoryProducts({ categoryId }: { categoryId: string }) {
  const category = CATEGORIES.find((c) => c.id === categoryId)

  // Fetch live products from Supabase for this category
  const products = await getProducts({ 
    category: categoryId,
    limit: 50
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{category?.name} Products ({products.length})</h2>
      <ProductGrid products={products} />
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  const category = CATEGORIES.find((c) => c.id === id)

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
                <CategoryProducts categoryId={id} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
