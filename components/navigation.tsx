"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white font-bold">
              R
            </div>
            <span className="hidden sm:inline font-semibold text-foreground">Rythu360</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </Link>
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/machinery" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Machinery
            </Link>
            <Link href="/ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI
            </Link>
            <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/investors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Investors
            </Link>
            <Link href="/careers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Register
            </Button>
            <Button variant="outline" size="sm">
              Download App
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2 py-4">
              <Link href="/solutions" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Solutions
              </Link>
              <Link href="/services" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Services
              </Link>
              <Link href="/machinery" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Machinery
              </Link>
              <Link href="/ai" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                AI
              </Link>
              <Link href="/marketplace" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Marketplace
              </Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                About
              </Link>
              <Link href="/investors" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Investors
              </Link>
              <Link href="/careers" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Careers
              </Link>
              <Link href="/contact" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                Contact
              </Link>
              <div className="flex gap-2 pt-4">
                <Button variant="ghost" size="sm" className="flex-1">
                  Login
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  Register
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
