"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Menu, X, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const products = [
  { name: "Rythu360", desc: "Farmer super-app", href: "/products/rythu360" },
  { name: "Akanksha AI", desc: "AI crop advisory", href: "/products/akanksha-ai" },
  { name: "Marketplace", desc: "Buy & sell produce", href: "/marketplace" },
  { name: "Organic Store", desc: "Farm-fresh goods", href: "/organic-store" },
  { name: "Drone Services", desc: "Precision spraying", href: "/drone-services" },
]

const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Products", href: "/#products", children: products },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Weather", href: "/weather" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Government", href: "/government" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
]

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState("en")

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-forest-green/10 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 rounded-xl p-2 transition-all hover:bg-forest-green/5 hover:shadow-lg hover:shadow-forest-green/10">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green to-leaf-green text-white font-bold text-lg">
            S
          </span>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-forest-green">
              SmartFarmin
            </span>
            <span className="text-xs text-gray-600 font-medium">
              Technologies
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-forest-green/5 hover:text-forest-green"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-60" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full mt-1 w-72 rounded-2xl bg-white/95 backdrop-blur-xl border border-forest-green/10 p-3 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-forest-green/10"
                    >
                      <span className="block text-sm font-semibold text-gray-900">
                        {child.name}
                      </span>
                      <span className="block text-xs text-gray-600">
                        {child.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden items-center gap-3 lg:flex ml-auto">
          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] border-forest-green/20 text-gray-700 hover:border-forest-green/40">
              <Globe className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-forest-green/20">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <Button
            render={<Link href="/roles" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-forest-green hover:bg-forest-green/5 rounded-lg font-medium"
          >
            Login
          </Button>
          <Button 
            render={<Link href="/dashboard" />} 
            nativeButton={false} 
            size="sm"
            className="bg-forest-green hover:bg-leaf-green text-white border-0 transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-semibold"
          >
            Launch Platform
          </Button>
          <Button 
            render={<Link href="/machinery" />} 
            nativeButton={false} 
            size="sm"
            variant="outline"
            className="border-forest-green/30 text-forest-green hover:bg-forest-green/5 rounded-lg font-medium"
          >
            Book Machinery
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-forest-green/5 transition-colors lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-forest-green/10 bg-white/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-forest-green/10 hover:text-forest-green transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-forest-green/10 pt-4">
              {/* Mobile Language Selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full border-forest-green/20 text-gray-700 rounded-lg">
                  <Globe className="size-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile Action Buttons */}
              <Button
                render={<Link href="/roles" onClick={() => setOpen(false)} />}
                nativeButton={false}
                variant="outline"
                size="sm"
                className="border-forest-green/30 text-forest-green hover:bg-forest-green/5 rounded-lg font-medium w-full"
              >
                Login
              </Button>
              <Button
                render={<Link href="/dashboard" onClick={() => setOpen(false)} />}
                nativeButton={false}
                size="sm"
                className="bg-forest-green hover:bg-leaf-green text-white border-0 rounded-lg font-semibold w-full"
              >
                Launch Platform
              </Button>
              <Button
                render={<Link href="/machinery" onClick={() => setOpen(false)} />}
                nativeButton={false}
                variant="outline"
                size="sm"
                className="border-forest-green/30 text-forest-green hover:bg-forest-green/5 rounded-lg font-medium w-full"
              >
                Book Machinery
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
