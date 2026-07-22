"use client"

import { motion } from "framer-motion"
import { Sprout, Droplets, Zap, TrendingUp, Brain, Shield, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Brain,
    title: "AI Crop Doctor",
    description: "Real-time disease detection, pest identification, and personalized treatment recommendations powered by advanced computer vision.",
    features: ["Disease Detection", "Pest Identification", "Treatment Plans", "Confidence Scoring"],
  },
  {
    icon: Droplets,
    title: "Drone Services",
    description: "Book certified drone operators for precision spraying, monitoring, and crop health assessment across your fields.",
    features: ["Aerial Surveys", "Precision Spraying", "Real-time Monitoring", "GPS Mapping"],
  },
  {
    icon: Zap,
    title: "Machinery Booking",
    description: "Access verified machinery operators and equipment rental. From tractors to harvesters—available on-demand.",
    features: ["Equipment Rental", "Verified Operators", "Real-time Availability", "Fair Pricing"],
  },
  {
    icon: TrendingUp,
    title: "Marketplace",
    description: "Direct access to quality seeds, fertilizers, pesticides, and agricultural tools at competitive prices.",
    features: ["Organic Products", "Fair Pricing", "Quality Assured", "Fast Delivery"],
  },
]

export function PremiumFeaturesSection() {
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
            Everything Farmers Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AgreeConnect brings together AI intelligence, verified service providers, marketplace access, and 24/7 expert support.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 border-2 border-gray-200 rounded-2xl hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                  Learn More
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/10 p-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Farmers Trust AgreeConnect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "100% Verified", desc: "All operators & products verified" },
              { icon: Clock, title: "24/7 Support", desc: "Round-the-clock farmer assistance" },
              { icon: MapPin, title: "Pan-India", desc: "Available in 18+ states" },
              { icon: Sprout, title: "AI-Powered", desc: "Advanced technology for better yields" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <benefit.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
