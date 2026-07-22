"use client"

import { motion } from "framer-motion"
import {
  Leaf,
  Wheat,
  Package,
  Beef,
  Milk,
  Sprout,
  Wrench,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/agreeConnect/glass-card"
import Link from "next/link"

type ExploreCategory = {
  id: string
  name: string
  icon: typeof Leaf
  description: string
  count: number
  color: string
  href: string
}

const EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: "lemon-farmers",
    name: "Lemon Farmers",
    icon: Leaf,
    description: "Fresh lemon suppliers nearby",
    count: 12,
    color: "from-yellow-400 to-yellow-600",
    href: "?category=Fresh%20Fruits",
  },
  {
    id: "rice-sellers",
    name: "Rice Sellers",
    icon: Wheat,
    description: "Quality rice from local mills",
    count: 8,
    color: "from-amber-400 to-amber-600",
    href: "?category=Grains%20%26%20Cereals",
  },
  {
    id: "nurseries",
    name: "Nurseries",
    icon: Sprout,
    description: "Plants and seedlings",
    count: 15,
    color: "from-green-400 to-green-600",
    href: "?category=Nursery%20%26%20Plants",
  },
  {
    id: "vegetable-sellers",
    name: "Vegetable Sellers",
    icon: Package,
    description: "Fresh from local farms",
    count: 24,
    color: "from-green-500 to-emerald-600",
    href: "?category=Fresh%20Vegetables",
  },
  {
    id: "poultry-farms",
    name: "Poultry Farms",
    icon: Beef,
    description: "Chicken and eggs",
    count: 6,
    color: "from-red-400 to-red-600",
    href: "?category=Livestock",
  },
  {
    id: "dairy-farms",
    name: "Dairy Farms",
    icon: Milk,
    description: "Fresh milk and dairy products",
    count: 10,
    color: "from-blue-400 to-blue-600",
    href: "?category=Dairy",
  },
  {
    id: "organic-producers",
    name: "Organic Producers",
    icon: Leaf,
    description: "Certified organic products",
    count: 5,
    color: "from-lime-400 to-lime-600",
    href: "?category=Organic%20Products",
  },
  {
    id: "farm-equipment",
    name: "Farm Equipment",
    icon: Wrench,
    description: "Machinery and tools",
    count: 7,
    color: "from-slate-400 to-slate-600",
    href: "?category=Farm%20Equipment",
  },
]

export function VillageExplorer() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore Around You</h2>
          <p className="text-lg text-gray-600">
            Discover farmers, traders, and businesses in your village
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPLORE_CATEGORIES.map((category, idx) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/rural-marketplace${category.href}`}>
                  <GlassCard className="h-full p-6 bg-white/80 backdrop-blur-sm border border-white/20 hover:border-primary/30 cursor-pointer group transition-all hover:shadow-lg">
                    {/* Icon Background */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                    {/* Count & Arrow */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                        {category.count} sellers
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/rural-marketplace">
            <Button size="lg" className="gap-2">
              <MapPin className="w-5 h-5" />
              Browse Full Marketplace
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
