"use client"

import { motion } from "framer-motion"
import { Building2, Users, BarChart3, Truck, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const enterpriseModules = [
  {
    icon: Building2,
    title: "Corporate Farms Management",
    description: "Manage multi-location operations with centralized control",
    features: [
      "Multi-farm dashboard",
      "Unified crop planning",
      "Centralized resource allocation",
      "Fleet coordination",
      "Financial aggregation",
    ],
  },
  {
    icon: Users,
    title: "FPO Organization Portal",
    description: "Manage farmer producer organizations and member networks",
    features: [
      "Member directory",
      "Collective procurement",
      "Revenue sharing automation",
      "Governance tools",
      "Training management",
    ],
  },
  {
    icon: BarChart3,
    title: "Dealer & Distributor Portal",
    description: "Complete sales and inventory management system",
    features: [
      "Real-time inventory tracking",
      "Sales commission tracking",
      "Customer lead management",
      "Target management",
      "Analytics dashboard",
    ],
  },
  {
    icon: Truck,
    title: "Fleet Management System",
    description: "Track and optimize agricultural machinery and equipment",
    features: [
      "Asset tracking with GPS",
      "Maintenance scheduling",
      "Operator assignment",
      "Fuel management",
      "Utilization reports",
    ],
  },
  {
    icon: Package,
    title: "Warehouse Management",
    description: "Multi-warehouse inventory and stock management",
    features: [
      "Real-time stock levels",
      "Batch tracking",
      "FIFO rotation",
      "Reorder automation",
      "Expiry management",
    ],
  },
  {
    icon: Settings,
    title: "Business Intelligence",
    description: "Advanced analytics and reporting for enterprise operations",
    features: [
      "Real-time KPI dashboard",
      "Predictive analytics",
      "Regional comparisons",
      "Export to CSV/PDF",
      "Custom reports",
    ],
  },
]

export function EnterpriseModulesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Enterprise Solutions for Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Purpose-built modules for agricultural enterprises, corporate farms, FPOs, dealers, and distributors. Manage every aspect of your business efficiently.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {enterpriseModules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 bg-white hover:shadow-xl">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <module.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {module.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {module.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary/5 to-accent/10 rounded-2xl border-2 border-primary/20 p-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Enterprise Teams Choose Rythu360
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "99.9%",
                label: "Platform Uptime",
              },
              {
                number: "500+",
                label: "Enterprise Customers",
              },
              {
                number: "<100ms",
                label: "Response Time",
              },
              {
                number: "24/7",
                label: "Dedicated Support",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-700">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Enterprise?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get personalized demo from our enterprise team. See how leading agricultural companies use Rythu360 to scale operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              Schedule Enterprise Demo
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Download Solution Guide
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
