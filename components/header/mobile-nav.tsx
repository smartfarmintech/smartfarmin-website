"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { mainNavigation, secondaryNavigation } from "@/data/nav-data"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <>
      {/* Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-16 bottom-0 w-full max-w-xs bg-background border-r border-border z-40 overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {/* Main Navigation Items */}
              {mainNavigation.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
                  >
                    {item.label}
                    {item.megaMenu && (
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    )}
                  </button>

                  {/* Sub-menu items */}
                  <AnimatePresence>
                    {expandedItems.includes(item.id) && item.megaMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-1 mt-1"
                      >
                        {item.megaMenu.map((section) => (
                          <div key={section.title}>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">
                              {section.title}
                            </h4>
                            <div className="space-y-1">
                              {section.items.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex flex-col p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground/80 hover:text-foreground"
                                >
                                  {subitem.label}
                                  {subitem.desc && (
                                    <span className="text-xs text-muted-foreground">
                                      {subitem.desc}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Secondary Navigation */}
              <div className="space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex p-3 rounded-lg hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="border-t border-border mt-4 pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 rounded-lg border border-green-500 text-green-600 text-sm font-medium text-center hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium text-center hover:bg-green-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
