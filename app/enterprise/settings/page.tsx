"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Building2,
  Bell,
  Lock,
  Users,
  FileText,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSave = () => {
    setSaveMessage({
      type: "success",
      message: "Settings saved successfully",
    })
    setTimeout(() => setSaveMessage({ type: null, message: "" }), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Organization Settings</h1>
          <p className="text-slate-400 mt-2">Manage your organization profile, security, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10">
          {[
            { id: "general", label: "General", icon: Building2 },
            { id: "members", label: "Members", icon: Users },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Lock },
            { id: "billing", label: "Billing", icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Save Message */}
        {saveMessage.type && (
          <Card className={`mb-6 p-4 ${saveMessage.type === "success" ? "card-glass border-l-4 border-l-emerald-400" : "card-glass border-l-4 border-l-red-400"}`}>
            <div className="flex items-center gap-3">
              {saveMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <p className={saveMessage.type === "success" ? "text-emerald-400" : "text-red-400"}>
                {saveMessage.message}
              </p>
            </div>
          </Card>
        )}

        {/* Tab Content */}
        <div>
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card className="card-glass p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Organization Profile</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="SmartFarmin Cooperative"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Organization Type</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50">
                        <option value="fpo">FPO (Farmer Producer Organization)</option>
                        <option value="corporate">Corporate Farm</option>
                        <option value="distributor">Distributor</option>
                        <option value="dealer">Dealer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Registration Number</label>
                      <input
                        type="text"
                        defaultValue="REG/FPO/2025/001"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      rows={4}
                      defaultValue="A leading agricultural cooperative supporting 500+ farmers with advanced farming solutions, machinery services, and market access."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">State</label>
                      <input
                        type="text"
                        defaultValue="Maharashtra"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">District</label>
                      <input
                        type="text"
                        defaultValue="Pune"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Postal Code</label>
                      <input
                        type="text"
                        defaultValue="411028"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="contact@smartfarmin.com"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        defaultValue="+91-XXXXXXXXXX"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button className="btn-primary gap-2" onClick={handleSave}>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Members Settings */}
          {activeTab === "members" && (
            <Card className="card-glass p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Member Management</h2>
              <p className="text-slate-400 mb-4">Configure member permissions and roles</p>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Role Hierarchy</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• <span className="text-red-400">Admin</span>: Full access, can manage organization</li>
                    <li>• <span className="text-purple-400">Manager</span>: Can manage operations and view reports</li>
                    <li>• <span className="text-blue-400">Operator</span>: Can operate machinery and log activities</li>
                    <li>• <span className="text-green-400">Farmer</span>: Can view crop data and get advice</li>
                  </ul>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button className="btn-secondary">Go to Members</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <Card className="card-glass p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { label: "Maintenance Alerts", description: "Receive alerts for upcoming maintenance schedules" },
                  { label: "Low Stock Warnings", description: "Get notified when inventory is low" },
                  { label: "Fleet Updates", description: "Receive updates on fleet asset status" },
                  { label: "Report Generation", description: "Notification when new reports are ready" },
                  { label: "Member Activity", description: "Get notified of member activities" },
                  { label: "System Updates", description: "Receive system maintenance and update notifications" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  </div>
                ))}

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="btn-primary gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card className="card-glass p-6">
                <h2 className="text-xl font-semibold text-white mb-6">API Keys</h2>

                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Use these keys to integrate with third-party services</p>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">API Key</label>
                    <div className="flex items-center gap-2">
                      <input
                        type={showApiKey ? "text" : "password"}
                        defaultValue="sk_prod_1234567890abcdef"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                        readOnly
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-slate-400"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Regenerate API Key
                  </Button>
                </div>
              </Card>

              <Card className="card-glass p-6 border-l-4 border-l-red-400">
                <h2 className="text-xl font-semibold text-white mb-6">Danger Zone</h2>

                <div className="space-y-4">
                  <p className="text-sm text-slate-400">These actions are irreversible</p>

                  <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Delete Organization
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <Card className="card-glass p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Billing Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">GST Number</label>
                    <input
                      type="text"
                      defaultValue="27AABCT1234H1Z5"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">PAN Number</label>
                    <input
                      type="text"
                      defaultValue="AAACT1234H"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bank Account Number</label>
                  <input
                    type="text"
                    defaultValue="1234567890"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">IFSC Code</label>
                  <input
                    type="text"
                    defaultValue="SBIN0001234"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="btn-primary gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Billing Info
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
