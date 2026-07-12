"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SETTINGS_SECTIONS, SETTINGS_DETAILS, ROLE_DETAILS } from "@/lib/auth-system"
import Link from "next/link"

export function SettingsDashboard() {
  const [activeSection, setActiveSection] = useState("account")
  const [isDarkMode, setIsDarkMode] = useState(false)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              {Object.entries(SETTINGS_DETAILS).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === key
                      ? "bg-green-100 text-green-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl mr-3">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <motion.div {...fadeIn} className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {SETTINGS_DETAILS[activeSection as any]?.title}
              </h2>

              <div className="space-y-6">
                {/* Account Settings */}
                {activeSection === "account" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Farmer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="farmer@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 9876543210"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                      Save Changes
                    </button>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === "security" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-semibold text-blue-900">Two-Factor Authentication</p>
                      <p className="text-sm text-blue-700 mt-1">Enhance your account security with 2FA</p>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-900">Active Sessions</p>
                      <p className="text-sm text-gray-600 mt-1">You are logged in on 2 devices</p>
                      <button className="mt-3 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-semibold">
                        Manage Sessions
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                      Change Password
                    </button>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div className="space-y-4">
                    {["Location Sharing", "Camera Access", "Gallery Access", "Notification Permissions", "Microphone Usage"].map(
                      (item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{item}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-5 h-5 text-green-600 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-4">
                    {["Email Alerts", "SMS Alerts", "In-App Notifications", "Push Notifications", "Marketing Emails"].map(
                      (item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{item}</span>
                          <input
                            type="checkbox"
                            defaultChecked={item !== "Marketing Emails"}
                            className="w-5 h-5 text-green-600 rounded cursor-pointer"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Preferences */}
                {activeSection === "preferences" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                        <option>English</option>
                        <option>తెలుగు (Telugu)</option>
                        <option>हिन्दी (Hindi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={!isDarkMode}
                            onChange={() => setIsDarkMode(false)}
                            className="w-4 h-4"
                          />
                          <span>Light Mode</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={isDarkMode}
                            onChange={() => setIsDarkMode(true)}
                            className="w-4 h-4"
                          />
                          <span>Dark Mode</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>

                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                      Save Preferences
                    </button>
                  </div>
                )}

                {/* Danger Zone */}
                {activeSection === "danger" && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
                      <p className="text-red-800 mb-4">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
                        Delete Account Permanently
                      </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-yellow-900 mb-2">Logout All Devices</h3>
                      <p className="text-yellow-800 mb-4">
                        Sign out from all active sessions on your account.
                      </p>
                      <button className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
                        Logout All Devices
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Role Switcher Component
export function RoleSwitcher() {
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState("farmer")

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
      >
        <span className="text-xl">{ROLE_DETAILS[selectedRole as any]?.icon}</span>
        Switch Role
      </button>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Switch Your Role</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(ROLE_DETAILS).map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedRole(key)
                    setShowModal(false)
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedRole === key
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <p className="font-semibold text-gray-900 text-sm">{role.name}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
