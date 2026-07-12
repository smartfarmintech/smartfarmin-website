"use client"

export const dynamic = "force-dynamic"

export default function MarketInsightsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Market Insights</h1>
        <p className="text-gray-400">Geographic & competitive analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Geographic Distribution</h2>
          <div className="space-y-3">
            {[
              { region: "Chittoor", users: "2,345", penetration: "18.5%", trend: "↑" },
              { region: "Anantapur", users: "1,892", penetration: "15.2%", trend: "↑" },
              { region: "Kadapa", users: "1,456", penetration: "12.1%", trend: "→" },
              { region: "Nellore", users: "982", penetration: "8.3%", trend: "↓" },
              { region: "Ongole", users: "845", penetration: "7.1%", trend: "↑" },
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-semibold">{item.region}</p>
                  <p className="text-sm text-gray-400">{item.users} users</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">{item.penetration}</p>
                  <p className="text-sm text-gray-400">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Services</h2>
          <div className="space-y-4">
            {[
              { service: "Farm Equipment Rental", revenue: "₹45L", share: "35%" },
              { service: "Agricultural Products", revenue: "₹38L", share: "30%" },
              { service: "Expert Consultation", revenue: "₹25L", share: "20%" },
              { service: "Logistics & Delivery", revenue: "₹15L", share: "15%" },
            ].map((item) => (
              <div key={item.service}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{item.service}</span>
                  <span className="text-green-400 font-semibold">{item.revenue}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: item.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Market Opportunity</h3>
          <p className="text-3xl font-bold text-blue-400 mb-2">₹250L</p>
          <p className="text-sm text-gray-400">Addressable market (annual)</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Market Share</h3>
          <p className="text-3xl font-bold text-purple-400 mb-2">12.5%</p>
          <p className="text-sm text-gray-400">Current penetration</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Growth Rate</h3>
          <p className="text-3xl font-bold text-green-400 mb-2">24.8%</p>
          <p className="text-sm text-gray-400">YoY growth</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Competitive Landscape</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 text-gray-400 font-medium">Competitor</th>
                <th className="text-left py-3 text-gray-400 font-medium">Market Share</th>
                <th className="text-left py-3 text-gray-400 font-medium">Strength</th>
                <th className="text-left py-3 text-gray-400 font-medium">Our Position</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Rythu360", share: "12.5%", strength: "AI, Multi-platform", position: "Us" },
                { name: "Competitor A", share: "22.3%", strength: "Scale, Brand", position: "Above" },
                { name: "Competitor B", share: "18.7%", strength: "Niche focus", position: "Above" },
                { name: "Competitor C", share: "8.2%", strength: "Local presence", position: "Below" },
              ].map((row) => (
                <tr key={row.name} className="border-b border-gray-800">
                  <td className="py-3 text-white">{row.name}</td>
                  <td className="py-3 text-blue-400 font-semibold">{row.share}</td>
                  <td className="py-3 text-gray-300">{row.strength}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.position === "Us"
                          ? "bg-blue-900/30 text-blue-400"
                          : row.position === "Above"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-green-900/30 text-green-400"
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
