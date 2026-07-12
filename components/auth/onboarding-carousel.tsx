"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ONBOARDING_SCREENS } from "@/lib/auth-system"
import Link from "next/link"

export function OnboardingCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrent((prev) => {
      const next = prev + newDirection
      if (next < 0) return ONBOARDING_SCREENS.length - 1
      if (next >= ONBOARDING_SCREENS.length) return 0
      return next
    })
  }

  const screen = ONBOARDING_SCREENS[current]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="text-center space-y-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl"
            >
              {screen.icon}
            </motion.div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {screen.title}
              </h1>
              <p className="text-xl text-gray-600">{screen.subtitle}</p>
            </div>

            {/* Content based on screen type */}
            {current === 1 && (
              <div className="grid grid-cols-2 gap-3 py-6">
                {screen.services?.map((service: string) => (
                  <div
                    key={service}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    <p className="text-2xl mb-1">{service.split(" ")[0]}</p>
                    <p className="text-sm text-gray-600">{service.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            )}

            {current === 2 && (
              <div className="grid grid-cols-2 gap-3 py-6">
                {screen.features?.map((feature: string) => (
                  <div
                    key={feature}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <p className="text-sm font-semibold text-gray-900">{feature}</p>
                  </div>
                ))}
              </div>
            )}

            {current === 3 && (
              <div className="grid grid-cols-2 gap-3 py-6">
                {screen.categories?.map((cat: string) => (
                  <div
                    key={cat}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <p className="text-2xl mb-1">{cat.split(" ")[0]}</p>
                    <p className="text-xs text-gray-600">{cat.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            )}

            {current === 4 && (
              <div className="space-y-2 py-6">
                {screen.schemes?.map((scheme: string) => (
                  <div
                    key={scheme}
                    className="bg-white rounded-lg p-3 shadow-sm border border-green-200 hover:border-green-400 transition"
                  >
                    <p className="font-semibold text-gray-900">{scheme}</p>
                  </div>
                ))}
              </div>
            )}

            {current === 5 && (
              <div className="space-y-2 py-6">
                {screen.products?.map((product: string) => (
                  <div
                    key={product}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900">{product}</p>
                  </div>
                ))}
              </div>
            )}

            {current === 6 && (
              <div className="grid grid-cols-2 gap-3 py-6">
                {screen.services?.map((service: string) => (
                  <div
                    key={service}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <p className="text-2xl mb-1">{service.split(" ")[0]}</p>
                    <p className="text-xs text-gray-600">{service.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-600 text-lg">{screen.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-6">
              <button
                onClick={() => paginate(-1)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
              >
                Previous
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {ONBOARDING_SCREENS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > current ? 1 : -1)
                      setCurrent(idx)
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === current
                        ? "w-8 bg-green-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {current === ONBOARDING_SCREENS.length - 1 ? (
                <Link
                  href="/auth?mode=register"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {screen.cta || "Get Started"}
                </Link>
              ) : (
                <button
                  onClick={() => paginate(1)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Next
                </button>
              )}
            </div>

            {/* Skip button */}
            <Link
              href="/auth?mode=login"
              className="text-gray-500 hover:text-gray-700 transition text-sm"
            >
              Skip →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
