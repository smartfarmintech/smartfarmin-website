import { Suspense } from "react"
import { ShoppingCart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WishlistButton } from "@/components/marketplace/wishlist-button"
import { SellerProfileCard } from "@/components/marketplace/seller-profile-card"
import { ProductReviews } from "@/components/marketplace/product-reviews"

interface ProductDetailPageProps {
  params: { slug: string }
}

async function ProductDetails({ slug }: { slug: string }) {
  // Mock product data
  const product = {
    id: "prod-001",
    name: "Premium Hybrid Paddy Seeds BPT-5204",
    description: "High-yielding hybrid paddy seeds with excellent disease resistance. Ideal for Kharif and Rabi seasons.",
    price: 850,
    comparePrice: 1200,
    rating: 4.5,
    reviews: 128,
    sku: "SEEDS-001",
    category: "Seeds",
    inStock: true,
    stock: 250,
  }

  const seller = {
    id: "seller-001",
    name: "Green Valley Seeds",
    rating: 4.8,
    reviewCount: 2345,
    location: "Hyderabad, Telangana",
    joinedDate: "2020",
    responseTime: "2h",
    isVerified: true,
    productCount: 450,
  }

  const reviews = [
    {
      id: "1",
      author: "Farmer John",
      rating: 5,
      title: "Excellent quality seeds",
      comment: "Got great yield this season. Highly recommend these seeds.",
      helpful: 45,
      unhelpful: 2,
      date: "2024-01-15",
    },
    {
      id: "2",
      author: "Village Cooperative",
      rating: 4,
      title: "Good seeds, fast delivery",
      comment: "Seeds arrived on time. Good germination rate.",
      helpful: 23,
      unhelpful: 1,
      date: "2024-01-10",
    },
  ]

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
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.comparePrice && (
                  <span className="text-lg line-through text-muted-foreground">
                    ₹{product.comparePrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <span>{product.rating} ({product.reviews} reviews)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
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

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
            <ProductDetails slug={params.slug} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
