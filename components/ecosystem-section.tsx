'use client'

import { motion } from 'framer-motion'
import { Users, Leaf, Zap, TrendingUp, Cloud, Smartphone } from 'lucide-react'
import { useState } from 'react'

interface EcosystemNode {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  description: string
  angle: number
}

export function EcosystemSection() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes: EcosystemNode[] = [
    {
      id: 'farmers',
      label: 'Farmers',
      icon: <Leaf className="w-6 h-6" />,
      color: 'from-green-400 to-green-600',
      description: 'Small, marginal, and commercial farmers',
      angle: 0,
    },
    {
      id: 'ai',
      label: 'AI & Analytics',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      description: 'Real-time insights and recommendations',
      angle: 45,
    },
    {
      id: 'drones',
      label: 'Drones',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      description: 'Precision spraying and monitoring',
      angle: 90,
    },
    {
      id: 'machinery',
      label: 'Machinery',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-400 to-orange-600',
      description: 'Smart equipment and services',
      angle: 135,
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: <Cloud className="w-6 h-6" />,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Real-time weather intelligence',
      angle: 180,
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <Users className="w-6 h-6" />,
      color: 'from-rose-400 to-rose-600',
      description: 'Direct buyer connections',
      angle: 225,
    },
    {
      id: 'government',
      label: 'Government',
      icon: <Leaf className="w-6 h-6" />,
      color: 'from-indigo-400 to-indigo-600',
      description: 'Digital services and subsidies',
      angle: 270,
    },
    {
      id: 'enterprises',
      label: 'Enterprises',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-teal-400 to-teal-600',
      description: 'B2B agricultural solutions',
      angle: 315,
    },
  ]

  const getNodePosition = (angle: number, radius: number = 180) => {
    const radians = (angle * Math.PI) / 180
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.15,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section
      id="ecosystem"
      className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-accent/5 via-background to-background"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
            The Digital Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rythu360 is the operating system connecting every stakeholder in Indian agriculture
          </p>
        </motion.div>

        {/* Ecosystem Diagram */}
        <div className="relative w-full aspect-square max-w-2xl mx-auto">
          {/* SVG Lines connecting nodes */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="-400 -400 800 800"
            style={{ zIndex: 0 }}
          >
            {/* Center circle */}
            <motion.circle
              cx="0"
              cy="0"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent/30"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              viewport={{ once: true }}
            />

            {/* Lines to nodes with animation */}
            {nodes.map((node, i) => {
              const pos = getNodePosition(node.angle)
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1="0"
                  y1="0"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent/20"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2 + i * 0.05,
                  }}
                  viewport={{ once: true }}
                />
              )
            })}
          </svg>

          {/* Center Logo/Text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <p className="font-serif font-bold text-foreground text-sm">Rythu360</p>
            </div>
          </motion.div>

          {/* Nodes */}
          <motion.div
            className="absolute inset-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {nodes.map((node) => {
              const pos = getNodePosition(node.angle)
              return (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  }}
                  variants={nodeVariants}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.button
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transition-all cursor-pointer bg-gradient-to-br ${node.color}`}
                    whileHover="hover"
                    variants={nodeVariants}
                  >
                    {node.icon}

                    {/* Hover Info Card */}
                    {hoveredNode === node.id && (
                      <motion.div
                        className="absolute top-24 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-3 shadow-xl whitespace-nowrap z-50"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-semibold text-foreground text-sm">
                          {node.label}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {node.description}
                        </p>
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mt-24"
        >
          <div className="space-y-4 p-8 rounded-xl border border-accent/20 bg-accent/5">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              One Platform
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              All the tools, markets, and expertise a modern farmer needs—integrated in one
              seamless platform designed for the realities of Indian agriculture.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-xl border border-accent/20 bg-accent/5">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              For Everyone
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you&apos;re a small farmer, equipment owner, government agency, or enterprise—
              Rythu360 has a role for you in the digital agriculture revolution.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
