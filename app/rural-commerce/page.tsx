import { Metadata } from "next"
import { VillageExplorer } from "@/components/rural-commerce/village-explorer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, ShoppingCart, Users, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Rural Commerce Platform | AgreeConnect",
  description: "Connect directly with farmers, traders, and local businesses. Fresh produce, grains, livestock, equipment - all in one marketplace.",
}

export default function RuralCommercePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary/2 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Rural Commerce Reimagined
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect directly with farmers, traders, and local businesses. Buy fresh produce, grains, livestock, equipment and everything rural—all in one trusted marketplace.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <p className="text-3xl font-bold text-primary">80+</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">26</p>
                  <p className="text-sm text-gray-600">Business Types</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">9</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>

              {/* CTA */}
              <Link href="/rural-marketplace">
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right Visual */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🍎", label: "Fresh Fruits" },
                { icon: "🥬", label: "Vegetables" },
                { icon: "🌾", label: "Grains" },
                { icon: "🌱", label: "Plants" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center hover:shadow-lg transition-shadow"
                >
                  <p className="text-4xl mb-2">{item.icon}</p>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why AgreeConnect Marketplace</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Direct Connection",
                desc: "Connect directly with farmers and sellers—no middlemen",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Better Prices",
                desc: "Skip middlemen and get competitive prices",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Location Based",
                desc: "Discover nearby farms and businesses",
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                title: "Complete Ecosystem",
                desc: "Everything for rural life in one place",
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Village Explorer */}
      <VillageExplorer />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join the Rural Commerce Revolution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of products from verified sellers in your area
          </p>
          <Link href="/rural-marketplace">
            <Button size="lg" className="gap-2">
              Browse Marketplace
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
