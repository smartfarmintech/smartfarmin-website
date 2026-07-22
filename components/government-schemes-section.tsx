"use client"

import { motion } from "framer-motion"
import { Badge, CheckCircle, DollarSign, FileText, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const schemes = [
  {
    id: 1,
    name: "PM Kissan Samman Nidhi",
    description: "Direct income support to farmers",
    benefit: "₹6,000 per year",
    eligibility: "Small & marginal farmers",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance against natural calamities",
    benefit: "Full coverage & claim settlement",
    eligibility: "All farmers growing notified crops",
    icon: Badge,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC)",
    description: "Easy access to credit for farming",
    benefit: "₹1-3 lakhs credit at low interest",
    eligibility: "Individual & joint farmers",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    description: "Free soil testing and nutrient recommendations",
    benefit: "Improved yields, cost savings",
    eligibility: "All farmers in India",
    icon: Award,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "National Mission for Sustainable Agriculture",
    description: "Support for sustainable farming practices",
    benefit: "Subsidies on equipment & training",
    eligibility: "Farmers adopting sustainable methods",
    icon: Users,
    color: "from-teal-500 to-green-500",
  },
  {
    id: 6,
    name: "Atma Nirbhar Bharat Scheme",
    description: "Support for agricultural mechanization",
    benefit: "50% subsidy on farm equipment",
    eligibility: "All farmer groups & cooperatives",
    icon: CheckCircle,
    color: "from-indigo-500 to-blue-500",
  },
]

export function GovernmentSchemesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            Government Schemes Made Easy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AgreeConnect connects you with all available government benefits, subsidies, and schemes. Get eligibility checks and application assistance instantly.
          </p>
        </motion.div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 bg-white hover:shadow-lg">
                {/* Icon with Gradient */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <scheme.icon className="w-6 h-6 text-white" />
                </div>

                {/* Scheme Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {scheme.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {scheme.description}
                </p>

                {/* Benefit */}
                <div className="mb-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    Benefit
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {scheme.benefit}
                  </p>
                </div>

                {/* Eligibility */}
                <div className="mb-4 p-2 bg-accent/5 rounded-lg border border-accent/10">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                    Eligibility
                  </p>
                  <p className="text-sm text-gray-700">
                    {scheme.eligibility}
                  </p>
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary text-primary hover:bg-primary/5"
                >
                  Check Eligibility
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border-2 border-primary/20 p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Don't Miss Out on Government Benefits
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            AgreeConnect tracks all schemes, notifies you of new opportunities, and helps you apply in minutes—not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Explore All Schemes
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Get Personalized Recommendations
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
