"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/marketplace/types"

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-muted h-64" />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/marketplace/${product.slug || product.id}`}
          className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative aspect-square bg-muted overflow-hidden">
            {product.tags?.includes("featured") && (
              <div className="absolute top-2 right-2 z-10 rounded-full bg-accent/90 px-2 py-1 text-xs font-medium text-accent-foreground">
                Featured
              </div>
            )}
            <div className="w-full h-full bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/10 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary">
              {product.name}
            </p>
            {product.short_description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {product.short_description}
              </p>
            )}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-semibold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.compare_at_price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {product.rating_count > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3",
                        i < Math.round(product.rating_avg)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.rating_count})
                </span>
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                <Heart className="size-3.5" />
              </Button>
              <Button
                size="sm"
                className="flex-1 h-8"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                <ShoppingCart className="size-3.5" />
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
