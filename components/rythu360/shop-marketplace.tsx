"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  Beef,
  Bug,
  Check,
  Droplets,
  FlaskConical,
  Heart,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Tractor,
  Trash2,
  Truck,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/rythu360/glass-card"
import { cn } from "@/lib/utils"
import {
  CATEGORIES,
  PRODUCTS,
  discountPct,
  formatINR,
  productImage,
  type Product,
  type ShopCategory,
} from "@/lib/rythu360/shop"

const CATEGORY_ICONS: Record<string, typeof Sprout> = {
  Sprout,
  FlaskConical,
  Bug,
  Tractor,
  Beef,
  Sun,
  Droplets,
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

type SortKey = "relevance" | "priceLow" | "priceHigh" | "rating" | "discount"

export function ShopMarketplace() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ShopCategory | "All">("All")
  const [sort, setSort] = useState<SortKey>("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [maxPrice, setMaxPrice] = useState(60000)
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Record<string, number>>({})
  const [drawer, setDrawer] = useState<"cart" | "wishlist" | null>(null)

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const addToCart = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  const decCart = (id: string) =>
    setCart((prev) => {
      const n = (prev[id] ?? 0) - 1
      const next = { ...prev }
      if (n <= 0) delete next[id]
      else next[id] = n
      return next
    })
  const removeCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((x) => x.product)
  const cartTotal = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0)
  const cartSavings = cartItems.reduce((sum, { product, qty }) => sum + (product.mrp - product.price) * qty, 0)

  const wishItems = PRODUCTS.filter((p) => wishlist.has(p.id))
  const recommended = PRODUCTS.filter((p) => p.recommended)

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false
      if (p.price > maxPrice) return false
      if (p.rating < minRating) return false
      if (inStockOnly && !p.inStock) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q))
          return false
      }
      return true
    })
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "priceLow":
          return a.price - b.price
        case "priceHigh":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "discount":
          return discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp)
        default:
          return b.reviews - a.reviews
      }
    })
    return list
  }, [category, query, sort, maxPrice, minRating, inStockOnly])

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/app/dashboard"
          aria-label="Back to dashboard"
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-foreground transition-colors hover:bg-card"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Kisan Bazaar</h1>
          <p className="truncate text-sm text-muted-foreground">Genuine farm inputs, delivered to your village</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawer("wishlist")}
            aria-label="Open wishlist"
            className="relative flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-foreground transition-colors hover:bg-card"
          >
            <Heart className="size-5" />
            {wishItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishItems.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setDrawer("cart")}
            aria-label="Open cart"
            className="relative flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-foreground transition-colors hover:bg-card"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="mb-4 flex gap-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search seeds, fertilizers, machinery..."
            className="h-12 w-full rounded-2xl border border-border/70 bg-card/70 pl-12 pr-4 text-sm outline-none backdrop-blur-xl transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 rounded-2xl border px-4 text-sm font-medium backdrop-blur-xl transition-colors",
            showFilters
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border/70 bg-card/70 text-foreground hover:bg-card",
          )}
        >
          <SlidersHorizontal className="size-4" /> Filters
        </button>
      </div>

      {/* Category rail */}
      <div className="mb-4 -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryChip label="All" active={category === "All"} onClick={() => setCategory("All")} />
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.icon]
          return (
            <CategoryChip
              key={c.key}
              label={c.key}
              icon={<Icon className="size-4" />}
              active={category === c.key}
              onClick={() => setCategory(c.key)}
            />
          )
        })}
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <GlassCard className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Max price: {formatINR(maxPrice)}
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={60000}
                    step={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Minimum rating</label>
                  <div className="flex gap-1.5">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setMinRating(r)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          minRating === r
                            ? "border-primary/60 bg-primary/10 text-primary"
                            : "border-border/70 text-muted-foreground hover:bg-card",
                        )}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setInStockOnly((s) => !s)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      inStockOnly
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border/70 text-muted-foreground hover:bg-card",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        inStockOnly ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                    >
                      {inStockOnly && <Check className="size-3" />}
                    </span>
                    In stock only
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI recommendations */}
      {category === "All" && !query.trim() && (
        <motion.div {...fade} className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h2 className="font-semibold tracking-tight">Recommended for you</h2>
              <p className="text-xs text-muted-foreground">Based on your crops, region and season</p>
            </div>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recommended.map((p) => (
              <div key={p.id} className="w-72 shrink-0">
                <GlassCard className="flex gap-3 p-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image src={productImage(p) || "/placeholder.svg"} alt={p.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{p.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-accent">
                      <Sparkles className="size-3" /> <span className="line-clamp-1">{p.reason}</span>
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-sm font-semibold">{formatINR(p.price)}</span>
                      <Button size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => addToCart(p.id)}>
                        Add
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> products
        </p>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-xl border border-border/70 bg-card/70 px-3 text-xs font-medium outline-none focus:border-primary/60"
          >
            <option value="relevance">Relevance</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top rated</option>
            <option value="discount">Biggest discount</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <p className="font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              wished={wishlist.has(p.id)}
              qty={cart[p.id] ?? 0}
              onWish={() => toggleWishlist(p.id)}
              onAdd={() => addToCart(p.id)}
              onInc={() => addToCart(p.id)}
              onDec={() => decCart(p.id)}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(null)}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                  {drawer === "cart" ? (
                    <>
                      <ShoppingCart className="size-5" /> Your Cart ({cartCount})
                    </>
                  ) : (
                    <>
                      <Heart className="size-5" /> Wishlist ({wishItems.length})
                    </>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={() => setDrawer(null)}
                  aria-label="Close"
                  className="flex size-9 items-center justify-center rounded-xl border border-border/70 text-foreground transition-colors hover:bg-card"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {drawer === "cart" ? (
                  cartItems.length === 0 ? (
                    <EmptyState icon={<ShoppingCart className="size-6" />} text="Your cart is empty" />
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {cartItems.map(({ product, qty }) => (
                        <li key={product.id} className="flex gap-3 rounded-2xl border border-border/70 p-3">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <Image src={productImage(product) || "/placeholder.svg"} alt={product.name} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.unit}</p>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-sm font-semibold">{formatINR(product.price)}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => decCart(product.id)}
                                  aria-label="Decrease"
                                  className="flex size-7 items-center justify-center rounded-lg border border-border/70 hover:bg-card"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="w-5 text-center text-sm font-medium">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(product.id)}
                                  aria-label="Increase"
                                  className="flex size-7 items-center justify-center rounded-lg border border-border/70 hover:bg-card"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCart(product.id)}
                            aria-label="Remove"
                            className="self-start text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                ) : wishItems.length === 0 ? (
                  <EmptyState icon={<Heart className="size-6" />} text="No saved items yet" />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {wishItems.map((product) => (
                      <li key={product.id} className="flex gap-3 rounded-2xl border border-border/70 p-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image src={productImage(product) || "/placeholder.svg"} alt={product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
                          <span className="text-sm font-semibold">{formatINR(product.price)}</span>
                          <div className="mt-1.5 flex gap-2">
                            <Button size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => addToCart(product.id)}>
                              Add to cart
                            </Button>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              className="text-xs text-muted-foreground hover:text-destructive"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {drawer === "cart" && cartItems.length > 0 && (
                <div className="border-t border-border px-5 py-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatINR(cartTotal)}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">You save</span>
                      <span className="font-medium text-primary">{formatINR(cartSavings)}</span>
                    </div>
                  )}
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck className="size-3.5" /> Free delivery on this order
                  </div>
                  <Button className="w-full rounded-full">Proceed to checkout · {formatINR(cartTotal)}</Button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-xl transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/70 bg-card/70 text-foreground hover:bg-card",
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function ProductCard({
  product: p,
  index,
  wished,
  qty,
  onWish,
  onAdd,
  onInc,
  onDec,
}: {
  product: Product
  index: number
  wished: boolean
  qty: number
  onWish: () => void
  onAdd: () => void
  onInc: () => void
  onDec: () => void
}) {
  const off = discountPct(p.price, p.mrp)
  return (
    <motion.div {...fade} transition={{ delay: Math.min(index * 0.03, 0.3) }}>
      <GlassCard className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative aspect-square bg-muted">
          <Image src={productImage(p) || "/placeholder.svg"} alt={p.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {p.tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  t === "Bestseller" && "bg-accent text-accent-foreground",
                  t === "Deal" && "bg-destructive text-primary-foreground",
                  t === "New" && "bg-primary text-primary-foreground",
                  t === "Subsidy" && "bg-chart-3 text-primary-foreground",
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart className={cn("size-4", wished ? "fill-destructive text-destructive" : "text-muted-foreground")} />
          </button>
          {!p.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
              <span className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">Out of stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <p className="text-[11px] font-medium text-muted-foreground">{p.brand}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{p.name}</h3>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
              {p.rating.toFixed(1)} <Star className="size-3 fill-current" />
            </span>
            <span className="text-[11px] text-muted-foreground">({p.reviews.toLocaleString("en-IN")})</span>
          </div>

          <div className="mt-2 flex items-end gap-1.5">
            <span className="text-base font-semibold">{formatINR(p.price)}</span>
            {off > 0 && <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</span>}
            {off > 0 && <span className="text-xs font-semibold text-primary">{off}% off</span>}
          </div>
          <p className="text-[11px] text-muted-foreground">{p.unit}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Truck className="size-3" /> {p.delivery}
          </p>

          <div className="mt-auto pt-3">
            {qty === 0 ? (
              <Button
                size="sm"
                className="w-full rounded-full"
                disabled={!p.inStock}
                onClick={onAdd}
              >
                {p.inStock ? "Add to cart" : "Notify me"}
              </Button>
            ) : (
              <div className="flex items-center justify-between rounded-full border border-primary/40 bg-primary/5 p-1">
                <button
                  type="button"
                  onClick={onDec}
                  aria-label="Decrease"
                  className="flex size-7 items-center justify-center rounded-full bg-background text-foreground shadow-sm"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-sm font-semibold">{qty} in cart</span>
                <button
                  type="button"
                  onClick={onInc}
                  aria-label="Increase"
                  className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">{icon}</span>
      <p className="text-sm text-muted-foreground">{text}</p>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> 100% genuine products guaranteed
      </p>
    </div>
  )
}
