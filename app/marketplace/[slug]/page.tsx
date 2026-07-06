import { Suspense } from "react"
import { ShoppingCart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WishlistButton } from "@/components/marketplace/wishlist-button"
import { SellerProfileCard } from "@/components/marketplace/seller-profile-card"
import { ProductReviews } from "@/components/marketplace/product-reviews"
import { searchProducts, getProductById } from "@/lib/marketplace/queries"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

async function ProductDetails({ slug }: { slug: string }) {
  // Fetch live product data from Supabase
  const products = await searchProducts(slug, 1)
  const product = products[0] 

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <a href="/marketplace" className="text-primary hover:underline">Return to Marketplace →</a>
      </div>
    )
  }

  // Get inventory to check stock
  const inventory = await getProductInventory(product.id)
  const stock = inventory?.quantity_available ?? 0

  // Mock reviews - TODO: fetch from reviews table
  const reviews = [] as any[]
  const seller = {
    sellerId: product.seller_id || "",
    name: "Seller",
    rating: 4.8,
    reviewCount: 0,
    location: "India",
    joinedDate: new Date().getFullYear().toString(),
    responseTime: "N/A",
    isVerified: true,
    productCount: 1,
  }

  return (
    <div className="space-y-8">
      {/* Product Main Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-4">
            No image available
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:ring-2 hover:ring-primary"
              >
                Photo {i}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.description}</p>
          </div>

          {/* Pricing */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
                {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
                  <span className="text-lg line-through text-muted-foreground">
                    ₹{Number(product.compare_at_price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating_avg || 0) ? "text-amber-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <span>{(product.rating_avg || 0).toFixed(1)} ({product.rating_count || 0} reviews)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stock > 0 ? (
                  <span className="text-green-600 font-semibold">In Stock ({stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Stock and Quantity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Quantity:</label>
              <select className="border rounded px-3 py-2">
                {[1, 2, 3, 4, 5, 10, 20].map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <WishlistButton productId={product.id} />
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Free shipping</span> on orders above ₹500
                </div>
                <div>
                  <span className="font-semibold">Delivery:</span> 2-5 days
                </div>
                <div>
                  <span className="font-semibold">Returns:</span> 7-day return policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <SellerProfileCard {...seller} />

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Product Details</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <ProductReviews
        productId={product.id}
        averageRating={product.rating}
        totalReviews={product.reviews}
        ratingDistribution={{ 5: 100, 4: 20, 3: 8 }}
        reviews={reviews}
      />
    </div>
  )
}

// Helper function to get product inventory
async function getProductInventory(productId: string) {
  // Placeholder - to be implemented with actual query
  return null
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
            <ProductDetails slug={slug} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
