"use client"

export const dynamic = "force-dynamic"

export default function CRMDashboard() {
  const kpis = [
    { label: "Total Contacts", value: "1,245", change: "+45 this month", icon: "👥" },
    { label: "Active Calls Today", value: "23", change: "2h 15m total", icon: "☎️" },
    { label: "Open Leads", value: "89", change: "12 converted", icon: "🎯" },
    { label: "Conversion Rate", value: "18.2%", change: "+2.1%", icon: "📈" },
  ]

  const recentCalls = [
    { name: "Ramakrishna - Nellore", duration: "12 min", status: "Interested", time: "2h ago" },
    { name: "Sunitha - Ongole", duration: "8 min", status: "Not Interested", time: "3h ago" },
    { name: "Venkatesh - Vijayawada", duration: "15 min", status: "Callback", time: "5h ago" },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-1">Sales Dashboard</h1>
        <p className="text-gray-400">Today&apos;s Performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="text-3xl mb-3">{kpi.icon}</div>
            <p className="text-gray-400 text-sm">{kpi.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Calls</h2>
          <div className="space-y-3">
            {recentCalls.map((call, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="font-semibold text-white">{call.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{call.time}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${call.status === "Interested" ? "bg-green-900/30 text-green-400" : call.status === "Callback" ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>
                    {call.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{call.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg">New Call</button>
            <button className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg">Add Contact</button>
            <button className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-lg">Create Lead</button>
            <button className="w-full py-2 px-4 bg-gray-700 text-white font-medium rounded-lg">View Territory</button>
          </div>
        </div>
      </div>
    </div>
  )
}
