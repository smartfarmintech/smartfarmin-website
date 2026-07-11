"use client"

import { motion } from "framer-motion"
import { Camera, CheckCircle, AlertTriangle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AICropDoctorShowcase() {
  const steps = [
    {
      number: "01",
      title: "Capture Image",
      description: "Simply take a photo of your crop or affected area using your smartphone.",
      icon: Camera,
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI instantly analyzes the image and identifies diseases, pests, or deficiencies.",
      icon: Zap,
    },
    {
      number: "03",
      title: "Get Diagnosis",
      description: "Receive detailed diagnosis with confidence score and disease severity assessment.",
      icon: AlertTriangle,
    },
    {
      number: "04",
      title: "Treatment Plan",
      description: "Get personalized treatment recommendations with step-by-step instructions.",
      icon: CheckCircle,
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
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
            Meet Akanksha:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your AI Crop Doctor</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced computer vision powered by deep learning. Detect diseases, pests, and nutrient deficiencies in seconds.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-3 w-6 h-1 bg-gradient-to-r from-primary to-accent opacity-30" />
              )}

              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>

                {/* Icon */}
                <step.icon className="w-10 h-10 text-primary mb-4" />

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border-2 border-primary/20 p-12 mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What Akanksha Can Detect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Crop Diseases",
                items: ["Leaf spots", "Mildew", "Blight", "Rust", "Yellowing"],
              },
              {
                title: "Pest Infestations",
                items: ["Locusts", "Armyworms", "Leaf folders", "Mites", "Whiteflies"],
              },
              {
                title: "Nutrient Deficiencies",
                items: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Magnesium", "Iron"],
              },
              {
                title: "Growth Stages",
                items: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"],
              },
              {
                title: "Soil Analysis",
                items: ["Moisture level", "Texture", "pH indicator", "Compaction", "Drainage"],
              },
              {
                title: "Environmental Stress",
                items: ["Water stress", "Heat stress", "Cold damage", "Hail damage", "Sunburn"],
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-4">{category.title}</h4>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg text-lg font-semibold shadow-lg">
            Try Akanksha Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
