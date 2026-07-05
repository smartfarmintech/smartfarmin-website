"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  Crown,
  Heart,
  Infinity as InfinityIcon,
  Leaf,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/rythu360/glass-card"
import { cn } from "@/lib/utils"
import {
  categoryImage,
  discountPct,
  formatINR,
  MEMBERSHIP,
  ORGANIC_CATEGORIES,
  ORGANIC_PRODUCTS,
  type OrganicCategory,
  type OrganicProduct,
} from "@/lib/rythu360/organic"

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

type CartLine = { product: OrganicProduct; qty: number }

export function OrganicStore() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<OrganicCategory | "All">("All")
  const [cart, setCart] = useState<Record<string, CartLine>>({})
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [member, setMember] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ORGANIC_PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false
      if (q && !(`${p.name} ${p.farm} ${p.category}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, category])

  const featured = useMemo(() => ORGANIC_PRODUCTS.filter((p) => p.featured).slice(0, 6), [])

  const cartLines = Object.values(cart)
  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0)
  const subtotal = cartLines.reduce((n, l) => n + l.product.price * l.qty, 0)
  const memberSaving = member ? Math.round(subtotal * 0.1) : 0
  const savings =
    cartLines.reduce((n, l) => n + (l.product.mrp - l.product.price) * l.qty, 0) + memberSaving

  function addToCart(p: OrganicProduct) {
    setCart((c) => {
      const line = c[p.id]
      return { ...c, [p.id]: { product: p, qty: (line?.qty ?? 0) + 1 } }
    })
    setCartOpen(true)
  }

  function setQty(id: string, qty: number) {
    setCart((c) => {
      if (qty <= 0) {
        const next = { ...c }
        delete next[id]
        return next
      }
      return { ...c, [id]: { ...c[id], qty } }
    })
  }

  function toggleWish(id: string) {
    setWishlist((w) => ({ ...w, [id]: !w[id] }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:px-6">
      {/* ---------- Header ---------- */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-foreground transition-colors hover:bg-card"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              <Leaf className="size-6 text-primary" />
              Organic Store
            </h1>
            <p className="text-sm text-muted-foreground">Certified farm-to-home, direct from growers</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
          className="relative flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card/70 text-foreground transition-colors hover:bg-card"
        >
          <ShoppingBag className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ---------- Search ---------- */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organic rice, honey, cold pressed oils…"
          className="h-12 w-full rounded-2xl border border-border/70 bg-card/70 pl-12 pr-4 text-sm outline-none backdrop-blur-xl transition-colors focus:border-primary/50 focus:ring-3 focus:ring-ring/40"
        />
      </div>

      {/* ---------- Hero ---------- */}
      <motion.div {...fade}>
        <GlassCard className="relative mb-6 overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <BadgeCheck className="size-3.5" /> 100% Certified Organic
              </span>
              <h2 className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Pure, seasonal harvests delivered to your door
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Traceable produce sourced directly from certified organic farms across Telangana &amp; Andhra Pradesh.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("organic-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Shop harvest <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-3xl sm:h-40 sm:w-64">
              <Image
                src="/organic/vegetables.png"
                alt="Fresh organic vegetables"
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ---------- Categories ---------- */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold tracking-tight">Shop by category</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          <CategoryTile
            label="All"
            active={category === "All"}
            onClick={() => setCategory("All")}
            image="/organic/fruits.png"
          />
          {ORGANIC_CATEGORIES.map((c) => (
            <CategoryTile
              key={c.key}
              label={c.key}
              active={category === c.key}
              onClick={() => setCategory(c.key)}
              image={c.image}
            />
          ))}
        </div>
      </div>

      {/* ---------- Membership ---------- */}
      <motion.div {...fade} className="mb-6">
        <GlassCard className="relative overflow-hidden p-6 sm:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -top-12 size-52 rounded-full bg-accent/12 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <div className="flex items-center gap-2">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <Crown className="size-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold tracking-tight">{MEMBERSHIP.name}</h3>
                  <p className="text-xs text-muted-foreground">Organic Membership</p>
                </div>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {MEMBERSHIP.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="leading-snug">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 rounded-3xl border border-border/70 bg-card/60 p-5 text-center backdrop-blur-xl lg:w-60">
              <p className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-3xl font-semibold tracking-tight">{formatINR(MEMBERSHIP.price)}</span>
                <span className="text-sm text-muted-foreground">/ {MEMBERSHIP.period}</span>
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <InfinityIcon className="size-3.5" /> Unlimited free delivery
              </p>
              <Button
                onClick={() => setMember((m) => !m)}
                className={cn("mt-4 w-full rounded-full", member && "bg-primary/90")}
              >
                {member ? (
                  <>
                    <Check className="size-4" /> Member active
                  </>
                ) : (
                  "Join membership"
                )}
              </Button>
              {member && (
                <p className="mt-2 text-xs text-primary">Extra 10% applied at checkout</p>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ---------- Featured ---------- */}
      {category === "All" && !query && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold tracking-tight">
              <Star className="size-4 text-accent" /> Featured harvest
            </h3>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((p) => (
              <div key={p.id} className="w-44 shrink-0 sm:w-52">
                <ProductCard
                  product={p}
                  wished={!!wishlist[p.id]}
                  onWish={() => toggleWish(p.id)}
                  onAdd={() => addToCart(p)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Product grid ---------- */}
      <div id="organic-grid" className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">
          {category === "All" ? "All products" : category}
        </h3>
        <span className="text-sm text-muted-foreground">{filtered.length} items</span>
      </div>
      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <p className="text-sm text-muted-foreground">No products match your search.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} {...fade} transition={{ delay: Math.min(i * 0.02, 0.2) }}>
              <ProductCard
                product={p}
                wished={!!wishlist[p.id]}
                onWish={() => toggleWish(p.id)}
                onAdd={() => addToCart(p)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ---------- Cart drawer ---------- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="flex items-center gap-2 font-semibold tracking-tight">
                  <ShoppingBag className="size-5" /> Your basket
                </h3>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setCartOpen(false)}
                  className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              {cartLines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="size-7 text-muted-foreground" />
                  </span>
                  <p className="text-sm text-muted-foreground">Your basket is empty.</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-5">
                    <ul className="flex flex-col gap-3">
                      {cartLines.map((line) => (
                        <li key={line.product.id} className="flex gap-3 rounded-2xl border border-border/70 p-3">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={categoryImage(line.product.category) || "/placeholder.svg"}
                              alt={line.product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="truncate text-sm font-medium">{line.product.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{line.product.unit}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() => setQty(line.product.id, line.qty - 1)}
                                  className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="w-5 text-center text-sm font-medium">{line.qty}</span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() => setQty(line.product.id, line.qty + 1)}
                                  className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                              <span className="text-sm font-semibold">{formatINR(line.product.price * line.qty)}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border p-5">
                    <div className="mb-3 flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="text-foreground">{formatINR(subtotal)}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-primary">
                          <span>You save</span>
                          <span>-{formatINR(savings)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Truck className="size-3.5" /> Delivery
                        </span>
                        <span className="text-primary">{member || subtotal > 500 ? "Free" : formatINR(40)}</span>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-semibold">Total</span>
                      <span className="font-serif text-xl font-semibold tracking-tight">
                        {formatINR(subtotal - memberSaving + (member || subtotal > 500 ? 0 : 40))}
                      </span>
                    </div>
                    <Button className="w-full rounded-full">Proceed to checkout</Button>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryTile({
  label,
  image,
  active,
  onClick,
}: {
  label: string
  image: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-3xl border p-2.5 text-center backdrop-blur-xl transition-colors",
        active ? "border-primary bg-primary/8" : "border-border/70 bg-card/70 hover:bg-card",
      )}
    >
      <span className="relative size-14 overflow-hidden rounded-2xl bg-muted">
        <Image src={image || "/placeholder.svg"} alt={label} fill sizes="56px" className="object-cover" />
      </span>
      <span
        className={cn(
          "text-[11px] font-medium leading-tight",
          active ? "text-primary" : "text-foreground",
        )}
      >
        {label}
      </span>
    </button>
  )
}

function ProductCard({
  product,
  wished,
  onWish,
  onAdd,
}: {
  product: OrganicProduct
  wished: boolean
  onWish: () => void
  onAdd: () => void
}) {
  const disc = discountPct(product)
  return (
    <GlassCard className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={categoryImage(product.category) || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={cn("object-cover transition-transform duration-300 hover:scale-105", !product.inStock && "opacity-50")}
        />
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWish}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={cn("size-4", wished ? "fill-destructive text-destructive" : "text-muted-foreground")} />
        </button>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.tags.map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                t === "Bestseller" && "bg-accent/90 text-accent-foreground",
                t === "New" && "bg-primary/90 text-primary-foreground",
                t === "Limited" && "bg-destructive/90 text-destructive-foreground",
                t === "Farm Fresh" && "bg-chart-2/90 text-primary-foreground",
              )}
            >
              {t}
            </span>
          ))}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {product.certified && (
          <span className="mb-1 inline-flex w-fit items-center gap-1 text-[10px] font-medium text-primary">
            <BadgeCheck className="size-3" /> Certified organic
          </span>
        )}
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{product.farm}</p>
        <div className="mt-1.5 flex items-center gap-1 text-xs">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-auto pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight">{formatINR(product.price)}</span>
            {disc > 0 && <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>}
            {disc > 0 && <span className="text-xs font-semibold text-primary">{disc}% off</span>}
          </div>
          <p className="text-[11px] text-muted-foreground">per {product.unit}</p>
          <Button
            onClick={onAdd}
            disabled={!product.inStock}
            size="sm"
            className="mt-2 w-full rounded-full"
          >
            {product.inStock ? (
              <>
                <Plus className="size-4" /> Add
              </>
            ) : (
              "Notify me"
            )}
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
