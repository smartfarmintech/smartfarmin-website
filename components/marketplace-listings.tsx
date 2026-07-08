"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type Listing = {
  name: string
  category: string
  price: string
  unit: string
  location: string
  seller: string
  verified: boolean
  image: string
}

const categories = ["All", "Grains", "Vegetables", "Inputs", "Equipment"]

const listings: Listing[] = [
  {
    name: "Sharbati Wheat",
    category: "Grains",
    price: "₹2,450",
    unit: "per quintal",
    location: "Sehore, MP",
    seller: "Rajesh Farms",
    verified: true,
    image: "/images/marketplace.png",
  },
  {
    name: "Hybrid Tomatoes",
    category: "Vegetables",
    price: "₹28",
    unit: "per kg",
    location: "Kolar, KA",
    seller: "Green Valley FPO",
    verified: true,
    image: "/images/marketplace.png",
  },
  {
    name: "Certified Seed Pack",
    category: "Inputs",
    price: "₹1,120",
    unit: "per 10 kg",
    location: "Guntur, AP",
    seller: "AgriSeed Co.",
    verified: true,
    image: "/images/marketplace.png",
  },
  {
    name: "45 HP Tractor",
    category: "Equipment",
    price: "₹1,800",
    unit: "per day rental",
    location: "Ludhiana, PB",
    seller: "FarmRent Hub",
    verified: false,
    image: "/images/marketplace.png",
  },
  {
    name: "Basmati Paddy",
    category: "Grains",
    price: "₹3,100",
    unit: "per quintal",
    location: "Karnal, HR",
    seller: "Sunrise Growers",
    verified: true,
    image: "/images/marketplace.png",
  },
  {
    name: "Farm-fresh Capsicum",
    category: "Vegetables",
    price: "₹42",
    unit: "per kg",
    location: "Pune, MH",
    seller: "Sahyadri FPO",
    verified: true,
    image: "/images/marketplace.png",
  },
]

export function MarketplaceListings() {
  const [active, setActive] = useState("All")

  const filtered =
    active === "All"
      ? listings
      : listings.filter((l) => l.category === active)

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <article
              key={l.name + l.seller}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={l.image || "/placeholder.svg"}
                  alt={l.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
                  {l.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {l.name}
                  </h3>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{l.price}</div>
                    <div className="text-xs text-muted-foreground">{l.unit}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {l.location}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  {l.verified && (
                    <BadgeCheck className="size-4 text-primary" />
                  )}
                  {l.seller}
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Contact seller
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
