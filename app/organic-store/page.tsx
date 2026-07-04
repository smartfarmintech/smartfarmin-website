import type { Metadata } from "next"
import Image from "next/image"
import { Leaf, Truck, ShieldCheck, Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Organic Store — Farm-Fresh, Certified Organic | SmartFarmin",
  description:
    "Shop certified organic produce sourced directly from SmartFarmin farmers. Farm-fresh grains, vegetables, honey and more delivered to your door.",
}

const products = [
  {
    name: "Organic Brown Rice",
    price: "₹180",
    unit: "1 kg",
    rating: "4.8",
    image: "/images/organic-rice.png",
  },
  {
    name: "Raw Forest Honey",
    price: "₹420",
    unit: "500 g",
    rating: "4.9",
    image: "/images/organic-honey.png",
  },
  {
    name: "Fresh Leafy Greens",
    price: "₹60",
    unit: "250 g",
    rating: "4.7",
    image: "/images/organic-greens.png",
  },
  {
    name: "Vine Tomatoes",
    price: "₹90",
    unit: "1 kg",
    rating: "4.6",
    image: "/images/market-tomato.png",
  },
  {
    name: "Seasonal Veg Box",
    price: "₹499",
    unit: "5 kg",
    rating: "4.9",
    image: "/images/organic-produce.png",
  },
  {
    name: "Stone-Ground Wheat",
    price: "₹65",
    unit: "1 kg",
    rating: "4.8",
    image: "/images/market-wheat.png",
  },
]

const promises = [
  { icon: Leaf, title: "Certified organic", desc: "Every product is third-party certified and traceable to the farm." },
  { icon: Truck, title: "Farm-fresh delivery", desc: "Harvested to order and delivered within 48 hours." },
  { icon: ShieldCheck, title: "Fair to farmers", desc: "Farmers earn up to 40% more selling through our store." },
]

export default function OrganicStorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Organic Store"
          title="Farm-fresh, certified organic, delivered"
          description="Shop produce sourced directly from SmartFarmin farmers, better for you, better for the soil, and fairer for the people who grow it."
        >
          <Button size="lg">Shop now</Button>
          <Button size="lg" variant="outline">
            How it works
          </Button>
        </PageHero>

        <section className="border-b border-border bg-card py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {promises.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Fresh from the farm this week
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Handpicked seasonal favourites, restocked daily.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <article
                  key={p.name}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1 text-sm text-accent-foreground">
                      <Star className="size-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{p.rating}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {p.unit}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold text-primary">{p.price}</span>
                      <Button size="sm">Add to cart</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
