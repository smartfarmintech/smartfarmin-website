"use client"

import { motion } from "framer-motion"
import {
  Users,
  Tractor,
  Zap,
  Briefcase,
  UserCheck,
  BookOpen,
  Store,
  Building2,
  Landmark,
} from "lucide-react"

const personas = [
  {
    icon: Users,
    name: "Farmers",
    description: "Access machinery, AI guidance, and expert support for every farming need.",
    benefits: ["Save time & money", "AI crop advisory", "Government schemes"],
    color: "from-green-500/10 via-green-500/5 to-transparent",
    iconColor: "text-green-600",
  },
  {
    icon: Tractor,
    name: "Machinery Owners",
    description: "Maximize equipment utilization and earn steady income. Expand your customer base.",
    benefits: ["Increase utilization", "Verified bookings", "Fair payments"],
    color: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconColor: "text-amber-600",
  },
  {
    icon: Zap,
    name: "Drone Operators",
    description: "Find farmers who need drone services. Build a sustainable business.",
    benefits: ["Easy bookings", "Track operations", "Transparent payments"],
    color: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconColor: "text-blue-600",
  },
  {
    icon: Briefcase,
    name: "Farm Labour",
    description: "Find reliable work opportunities. Earn steady income with secure payments.",
    benefits: ["Daily bookings", "Fair wages", "Flexible scheduling"],
    color: "from-purple-500/10 via-purple-500/5 to-transparent",
    iconColor: "text-purple-600",
  },
  {
    icon: UserCheck,
    name: "Field Executives",
    description: "Coordinate services and manage operations efficiently on the ground.",
    benefits: ["Real-time tracking", "Easy dispatch", "Performance analytics"],
    color: "from-orange-500/10 via-orange-500/5 to-transparent",
    iconColor: "text-orange-600",
  },
  {
    icon: BookOpen,
    name: "Agricultural Experts",
    description: "Reach farmers directly. Offer expert advice and build your practice.",
    benefits: ["Direct client access", "Verified credentials", "Easy consultations"],
    color: "from-red-500/10 via-red-500/5 to-transparent",
    iconColor: "text-red-600",
  },
  {
    icon: Store,
    name: "Dealers",
    description: "Connect with farmers through our marketplace. Increase product visibility.",
    benefits: ["Wide reach", "Easy listings", "Customer insights"],
    color: "from-pink-500/10 via-pink-500/5 to-transparent",
    iconColor: "text-pink-600",
  },
  {
    icon: Building2,
    name: "Businesses",
    description: "B2B services and bulk bookings for agricultural companies and startups.",
    benefits: ["Volume discounts", "Dedicated support", "API integration"],
    color: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    iconColor: "text-indigo-600",
  },
  {
    icon: Landmark,
    name: "Government Partners",
    description: "Deliver government schemes and services directly to farmers.",
    benefits: ["Program integration", "Data insights", "Impact tracking"],
    color: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    iconColor: "text-cyan-600",
  },
]

export function AgreeConnectDesignedFor() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.320, 1] },
    },
  }

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Designed For Everyone
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re a farmer, machinery owner, or agricultural expert, AgreeConnect has something for you.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {personas.map((persona, idx) => {
            const Icon = persona.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants as any}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${persona.color} backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-lg hover:border-border`}
              >
                <div className={`inline-flex rounded-xl p-3 mb-4 bg-white/10 ${persona.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {persona.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {persona.description}
                </p>

                <div className="pt-4 border-t border-border/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Key Benefits</p>
                  <ul className="space-y-1">
                    {persona.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
