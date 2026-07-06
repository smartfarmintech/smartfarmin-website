import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCart } from "@/lib/marketplace/queries"

async function CartItems() {
  // Fetch live cart data from Supabase
  const cart = await getCart()
  
  // Map cart items to consistent format
  const cartItems = cart?.cart_items?.map((item: any) => ({
    id: item.id,
    name: item.product?.name || "Product",
    price: item.unit_price || item.product?.price || 0,
    quantity: item.quantity || 1,
    image: null,
  })) ?? []

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  const tax = subtotal * 0.05
  const shipping = subtotal > 2000 ? 0 : 150 // Free shipping above ₹2000
  const total = subtotal + tax + shipping

  if (!cart || cartItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Browse our marketplace to add items</p>
        <Link href="/marketplace">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">By {item.seller}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold">₹{item.price}</span>
                    <div className="flex items-center gap-2">
                      <input type="number" min="1" defaultValue={item.quantity} className="w-12 border rounded px-2 py-1" />
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
            <CartItems />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
