"use client"

import { motion } from "framer-motion"
import { Check, LogIn, Search, Calendar, MapPin, Zap, FileText } from "lucide-react"

const timelineSteps = [
  {
    icon: LogIn,
    step: "Register",
    title: "Create Your Account",
    description: "Simple signup in minutes with your mobile number",
  },
  {
    icon: Search,
    step: "Choose Service",
    title: "Browse Services",
    description: "Explore machinery, drones, and other farming solutions",
  },
  {
    icon: Calendar,
    step: "Select Date",
    title: "Pick Your Slot",
    description: "Choose convenient date and time for your booking",
  },
  {
    icon: Zap,
    step: "Book & Pay",
    title: "Secure Booking",
    description: "Complete payment with multiple secure options",
  },
  {
    icon: MapPin,
    step: "Live Tracking",
    title: "GPS Monitoring",
    description: "Real-time location tracking of your service provider",
  },
  {
    icon: Check,
    step: "Complete",
    title: "Service Done",
    description: "Get digital invoice and feedback on service quality",
  },
]

export function WhyChooseTimeline() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br from-emerald-100/20 to-transparent blur-3xl"
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            Simple & Transparent
          </p>
          <h2 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl">
            Why Choose Rythu360?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/60">
            A seamless farming experience from discovery to completion
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-emerald-200 to-emerald-100"
            initial={{ scaleY: 0, transformOrigin: "top" }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
          />

          {/* Timeline steps */}
          <div className="space-y-12">
            {timelineSteps.map((item, index) => {
              const Icon = item.icon
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={item.step}
                  className={`flex gap-8 ${isLeft ? "lg:flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Left or right content */}
                  <div className={`flex-1 ${isLeft ? "lg:text-right" : ""}`}>
                    <motion.div
                      className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6"
                      whileHover={{ scale: 1.02, borderColor: "#059669" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-foreground/60">{item.description}</p>
                    </motion.div>
                  </div>

                  {/* Center icon */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="size-8 text-white" />
                    </motion.div>
                    {index < timelineSteps.length - 1 && (
                      <motion.div
                        className="mt-4 text-2xl font-bold text-emerald-200"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        ↓
                      </motion.div>
                    )}
                  </div>

                  {/* Empty space for alignment */}
                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              )
            })}
          </div>

          {/* Final result */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-lg border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 px-8 py-6">
              <p className="text-sm font-medium text-emerald-700">Complete & Verified</p>
              <h3 className="mt-2 text-3xl font-bold text-emerald-600">Digital Invoice & Rating</h3>
              <p className="mt-2 text-sm text-foreground/60">Track all services and build your reputation</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
