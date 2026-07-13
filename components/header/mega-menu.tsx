"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import * as Icons from "lucide-react"

interface MenuItem {
  label: string
  href: string
  desc?: string
}

interface MegaMenuSection {
  title: string
  items: MenuItem[]
}

interface MegaMenuProps {
  isOpen: boolean
  sections: MegaMenuSection[]
}

export function MegaMenu({ isOpen, sections }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 pt-2 pointer-events-auto"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Grid of menu sections */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
                {sections.map((section, idx) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <ChevronRight size={16} className="text-muted-foreground group-hover:text-green-500 mt-0.5 transition-colors" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground group-hover:text-green-500 transition-colors">
                                {item.label}
                              </p>
                              {item.desc && (
                                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                                  {item.desc}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Footer with featured link */}
              <div className="border-t border-border px-8 py-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Trusted by 20,000+ farmers across India
                  </p>
                  <Link
                    href="/get-started"
                    className="text-xs font-semibold text-green-600 hover:text-green-500 transition-colors"
                  >
                    Get Started →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
