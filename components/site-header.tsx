"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  { name: "Rythu360", desc: "Farmer super-app", href: "/products/rythu360" },
  { name: "Akanksha AI", desc: "AI crop advisory", href: "/products/akanksha-ai" },
  { name: "Marketplace", desc: "Buy & sell produce", href: "/marketplace" },
  { name: "Organic Store", desc: "Farm-fresh goods", href: "/organic-store" },
  { name: "Drone Services", desc: "Precision spraying", href: "/drone-services" },
]

const nav = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Products", href: "/#products", children: products },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Government", href: "/government" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-lg p-2 transition-all hover:shadow-lg hover:shadow-green-500/20">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white">
            <Leaf className="size-5" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            SmartFarmin
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-60" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 transition-all duration-200 hover:bg-white/10"
                    >
                      <span className="block text-sm font-medium text-white">
                        {child.name}
                      </span>
                      <span className="block text-xs text-white/60">
                        {child.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            render={<Link href="/roles" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            Login
          </Button>
          <Button 
            render={<Link href="/pricing" />} 
            nativeButton={false} 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/5 transition-colors lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-white/5 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-3">
              <Button
                render={<Link href="/roles" onClick={() => setOpen(false)} />}
                nativeButton={false}
                variant="outline"
                size="sm"
                className="border-white/10 text-white hover:bg-white/5"
              >
                Login
              </Button>
              <Button
                render={<Link href="/pricing" onClick={() => setOpen(false)} />}
                nativeButton={false}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0"
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
