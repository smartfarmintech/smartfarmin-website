import Image from "next/image"
import Link from "next/link"
import {
  Smartphone,
  Brain,
  Store,
  ShoppingBasket,
  Plane,
  ArrowUpRight,
} from "lucide-react"

const products = [
  {
    name: "Rythu360",
    tag: "Farmer super-app",
    icon: Smartphone,
    href: "/products/rythu360",
    desc: "One app for crop planning, weather, mandi prices, credit and expert support in your language.",
  },
  {
    name: "Akanksha AI",
    tag: "AI advisory",
    icon: Brain,
    href: "/products/akanksha-ai",
    desc: "AI that reads your soil, satellite and weather data to tell you exactly when to sow, water and spray.",
  },
  {
    name: "Marketplace",
    tag: "Buy & sell",
    icon: Store,
    href: "/marketplace",
    desc: "Sell your harvest directly to buyers at fair prices and source seeds, inputs and equipment with ease.",
  },
  {
    name: "Drone Services",
    tag: "Precision farming",
    icon: Plane,
    href: "/drone-services",
    desc: "Book on-demand drone spraying and field mapping that cuts input costs and protects your health.",
    image: "/images/drone-services.png",
  },
  {
    name: "Organic Store",
    tag: "Farm to table",
    icon: ShoppingBasket,
    href: "/organic-store",
    desc: "A trusted store for certified organic produce, delivering farm-fresh goods to conscious consumers.",
    image: "/images/organic-produce.png",
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="scroll-mt-20 bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Products
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything a modern farm needs, in one ecosystem
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Each product works beautifully on its own and even better together.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const Icon = product.icon
            const featured = Boolean(product.image)
            return (
              <Link
                href={product.href}
                key={product.name}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg ${
                  featured ? "md:col-span-1 lg:row-span-1" : ""
                }`}
              >
                {product.image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {product.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 flex items-center gap-1 font-serif text-xl font-semibold text-foreground">
                    {product.name}
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {product.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
