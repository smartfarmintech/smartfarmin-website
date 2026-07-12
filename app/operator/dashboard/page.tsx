"use client"

export default function OperatorDashboard() {
  const stats = [
    { label: "Active Jobs", value: "3", icon: "💼" },
    { label: "This Month Earnings", value: "₹8,500", icon: "💰" },
    { label: "Completed Jobs", value: "45", icon: "✓" },
    { label: "Rating", value: "4.8/5", icon: "⭐" },
  ]

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Rythu Pro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition">
          View Available Jobs
        </button>
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition">
          Check Monthly Earnings
        </button>
      </div>
    </div>
  )
}
