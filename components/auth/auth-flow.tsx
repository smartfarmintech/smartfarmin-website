"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AUTH_METHODS, AUTH_METHOD_DETAILS, REGISTRATION_STEPS, ROLE_DETAILS, AUTH_ROLES } from "@/lib/auth-system"
import Link from "next/link"

export function AuthFlow({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot">(initialMode)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    otp: "",
    role: "",
    name: "",
    fullDetails: {} as Record<string, any>,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

  // Login Flow
  if (mode === "login") {
    return (
      <motion.div {...fadeIn} className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Login to access your farming platform</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Phone OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 "
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  setError("")
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              onClick={async () => {
                setLoading(true)
                setError("")
                // Simulate OTP send
                setTimeout(() => {
                  setMode("otp")
                  setSuccess("OTP sent to your phone")
                  setLoading(false)
                }, 1000)
              }}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={loading || !formData.phone}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Other auth methods */}
            {[AUTH_METHODS.EMAIL_PASSWORD, AUTH_METHODS.GOOGLE].map((method) => (
              <button
                key={method}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">{AUTH_METHOD_DETAILS[method as any].icon}</span>
                {AUTH_METHOD_DETAILS[method as any].name}
              </button>
            ))}

            {/* Signup Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="text-green-600 font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // OTP Verification
  if (mode === "otp") {
    return (
      <motion.div {...fadeIn} className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600 mb-8">Enter the 6-digit OTP sent to {formData.phone}</p>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                className="w-full px-4 py-3 text-2xl text-center letter-spacing border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-mono"
              />
            </div>

            <button
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  setSuccess("Login successful! Redirecting...")
                  setLoading(false)
                }, 1000)
              }}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={loading || formData.otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => setMode("login")}
              className="w-full py-2 text-gray-600 font-semibold hover:text-gray-900 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Registration Flow
  if (mode === "register") {
    return (
      <motion.div {...fadeIn} className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {REGISTRATION_STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${
                    s.id === step
                      ? "bg-green-600 text-white scale-110"
                      : s.id < step
                        ? "bg-green-200 text-green-900"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.id < step ? "✓" : s.id}
                </button>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(step / REGISTRATION_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{REGISTRATION_STEPS[step - 1].title}</h1>
          <p className="text-gray-600 mb-8">{REGISTRATION_STEPS[step - 1].description}</p>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-3">
              {Object.entries(ROLE_DETAILS).map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => {
                    setFormData({ ...formData, role: key })
                    setStep(2)
                  }}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    formData.role === key
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{role.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{role.name}</p>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Steps 3-7: Location, Agriculture, Services, Language, Permissions */}
          {step >= 3 && step <= 7 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700">Step {step} details would be configured here</p>
              <p className="text-sm text-gray-600 mt-2">(Name, location selects, services, language, permissions)</p>
            </div>
          )}

          {/* Step 8: Success */}
          {step === 8 && (
            <div className="text-center space-y-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">
                🎉
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AgreeConnect!</h2>
                <p className="text-gray-600">Your account is ready to explore farming solutions.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-900">
                  <strong>Role:</strong> {ROLE_DETAILS[formData.role as any]?.name}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition"
              >
                Previous
              </button>
            )}
            {step < 8 && (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Next
              </button>
            )}
            {step === 8 && (
              <Link
                href="/"
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-center"
              >
                Start Exploring
              </Link>
            )}
          </div>

          {/* Back to login */}
          {step === 1 && (
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-green-600 font-semibold hover:underline">
                Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  return null
}
