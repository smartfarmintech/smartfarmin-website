"use client"

export default function AdminDashboard() {
  const kpis = [
    { label: "Total Users", value: "12,450", change: "+8.2%", icon: "👥" },
    { label: "Total Revenue", value: "₹4,25,000", change: "+12.5%", icon: "💰" },
    { label: "Active Bookings", value: "1,230", change: "+5.3%", icon: "📦" },
    { label: "System Health", value: "99.8%", change: "Good", icon: "🟢" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition"
          >
            <div className="text-3xl mb-2">{kpi.icon}</div>
            <p className="text-gray-400 text-sm">{kpi.label}</p>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-green-400 mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>New user registration</span>
              <span className="text-green-400">+5 users</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Orders processed</span>
              <span className="text-blue-400">+45 orders</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Support tickets</span>
              <span className="text-yellow-400">+12 tickets</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">API Server</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Database</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Storage</span>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
