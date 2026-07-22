"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"

const ecosystems = [
  {
    label: "Temple & Pilgrimage",
    href: "/temple",
    desc: "Sacred experiences",
    icon: "🕉️",
    items: [
      { name: "Nearby Temples", desc: "Find sacred sites", href: "/temple" },
      { name: "Temple Services", desc: "Pooja & rituals", href: "/temple#services" },
      { name: "Temple Marketplace", desc: "Offerings & gifts", href: "/temple#marketplace" },
      { name: "Temple Directory", desc: "10+ temples", href: "/temple/directory" },
    ]
  },
  {
    label: "Rural Tourism",
    href: "/tourism",
    desc: "Authentic experiences",
    icon: "🏞️",
    items: [
      { name: "Destinations", desc: "100+ places", href: "/tourism" },
      { name: "Homestays", desc: "Local stays", href: "/tourism#homestays" },
      { name: "Farm Stays", desc: "Agritourism", href: "/tourism#farmstays" },
      { name: "Adventure", desc: "Outdoor activities", href: "/tourism#adventure" },
      { name: "Cultural Tours", desc: "Local experiences", href: "/tourism#cultural" },
    ]
  },
  {
    label: "Nearby Services",
    href: "/services",
    desc: "Essential services",
    icon: "🔧",
    items: [
      { name: "All Services", desc: "20+ categories", href: "/services" },
      { name: "Medical & Health", desc: "Clinics & vets", href: "/services?cat=medical" },
      { name: "Repair Services", desc: "Equipment & tools", href: "/services?cat=repair" },
      { name: "Transport", desc: "Local travel", href: "/services?cat=transport" },
      { name: "Trading Posts", desc: "Buy & sell", href: "/services?cat=trading" },
    ]
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    desc: "Rural commerce",
    icon: "🛒",
    items: [
      { name: "All Products", desc: "150+ items", href: "/marketplace" },
      { name: "Fresh Produce", desc: "Fruits & vegetables", href: "/marketplace?cat=produce" },
      { name: "Livestock", desc: "Animals & poultry", href: "/marketplace?cat=livestock" },
      { name: "Dairy Products", desc: "Fresh dairy", href: "/marketplace?cat=dairy" },
      { name: "Flowers & Plants", desc: "Nursery items", href: "/marketplace?cat=flowers" },
    ]
  },
  {
    label: "Market Intelligence",
    href: "/market-intelligence",
    desc: "Price data & AI insights",
    icon: "📊",
    items: [
      { name: "Price Trends", desc: "50+ products", href: "/market-intelligence" },
      { name: "AI Forecast", desc: "ML price predictions", href: "/market-intelligence#forecast" },
      { name: "Market Analysis", desc: "Seasonal trends", href: "/market-intelligence#analysis" },
      { name: "Export Data", desc: "Download reports", href: "/market-intelligence#export" },
    ]
  },
  {
    label: "Business Directory",
    href: "/business-directory",
    desc: "B2B network",
    icon: "🏢",
    items: [
      { name: "All Businesses", desc: "15+ categories", href: "/business-directory" },
      { name: "Traders", desc: "Wholesale dealers", href: "/business-directory?cat=traders" },
      { name: "Processors", desc: "Food processing", href: "/business-directory?cat=processors" },
      { name: "Exporters", desc: "International trade", href: "/business-directory?cat=exporters" },
      { name: "Post Business", desc: "Register your business", href: "/business-directory/register" },
    ]
  },
  {
    label: "Careers",
    href: "/careers",
    desc: "Job opportunities",
    icon: "💼",
    items: [
      { name: "All Jobs", desc: "Browse opportunities", href: "/careers" },
      { name: "Agricultural Jobs", desc: "Farm roles", href: "/careers?dept=agriculture" },
      { name: "Technical Jobs", desc: "IT & engineering", href: "/careers?dept=technical" },
      { name: "Management", desc: "Leadership roles", href: "/careers?dept=management" },
    ]
  },
]

const products = [
  { name: "AgreeConnect", desc: "Farmer super-app", href: "/products/agreeConnect" },
  { name: "Akanksha AI", desc: "AI crop advisory", href: "/products/akanksha-ai" },
  { name: "Marketplace", desc: "Buy & sell produce", href: "/marketplace" },
  { name: "Organic Store", desc: "Farm-fresh goods", href: "/organic-store" },
  { name: "Drone Services", desc: "Precision spraying", href: "/drone-services" },
]

const nav = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Products", href: "/#products", children: products },
  { label: "Ecosystems", href: "/", children: ecosystems.map(e => ({ name: e.label, desc: e.desc, href: e.href })) },
  { label: "Government", href: "/government" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            SmartFarmin
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-60" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-auto translate-y-1 rounded-xl border border-border bg-popover p-4 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.label === "Ecosystems" ? (
                    <div className="grid grid-cols-2 gap-6 min-w-max">
                      {ecosystems.map((eco) => (
                        <div key={eco.label} className="space-y-2">
                          <Link href={eco.href} className="font-semibold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <span>{eco.icon}</span>
                            {eco.label}
                          </Link>
                          <div className="space-y-1.5">
                            {eco.items.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <span className="font-medium">{subitem.name}</span>
                                <span className="block text-xs opacity-70">{subitem.desc}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1 w-64">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 hover:bg-secondary"
                        >
                          <span className="block text-sm font-medium text-foreground">
                            {child.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {child.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSelector />
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="text-foreground/80"
          >
            Login
          </Button>
          <Button render={<Link href="/auth?mode=register" />} nativeButton={false} size="sm">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <Button
                render={<Link href="/contact" onClick={() => setOpen(false)} />}
                nativeButton={false}
                variant="outline"
                size="sm"
              >
                Login
              </Button>
              <Button
                render={<Link href="/auth?mode=register" onClick={() => setOpen(false)} />}
                nativeButton={false}
                size="sm"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
