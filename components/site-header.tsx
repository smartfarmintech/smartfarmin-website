"use client"

import { useState } from "react"
import { Leaf, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  { name: "Rythu360", desc: "Farmer super-app" },
  { name: "Akanksha AI", desc: "AI crop advisory" },
  { name: "Marketplace", desc: "Buy & sell produce" },
  { name: "Organic Store", desc: "Farm-fresh goods" },
  { name: "Drone Services", desc: "Precision spraying" },
]

const nav = [
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products", children: products },
  { label: "Government", href: "#segments" },
  { label: "Enterprise", href: "#segments" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            SmartFarmin
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-60" />}
              </a>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-64 translate-y-1 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <a
                      key={child.name}
                      href="#products"
                      className="block rounded-lg px-3 py-2 hover:bg-secondary"
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {child.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {child.desc}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" className="text-foreground/80">
            Login
          </Button>
          <Button size="sm">Get Started</Button>
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
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
