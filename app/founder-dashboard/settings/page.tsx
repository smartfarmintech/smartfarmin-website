"use client"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your dashboard</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Email alerts", enabled: true },
              { label: "Daily summary", enabled: true },
              { label: "Critical alerts only", enabled: false },
              { label: "Weekly report", enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-300">{item.label}</span>
                <button
                  className={`w-12 h-6 rounded-full transition ${
                    item.enabled ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition ${
                      item.enabled ? "ml-6" : "ml-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Theme</label>
              <select className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time Zone</label>
              <select className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700">
                <option>IST (UTC+5:30)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
          Save Settings
        </button>
      </div>
    </div>
  )
}
