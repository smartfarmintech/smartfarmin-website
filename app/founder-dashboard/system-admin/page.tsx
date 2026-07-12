"use client"

export const dynamic = "force-dynamic"

export default function SystemAdminPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">System Admin</h1>
        <p className="text-gray-400">Platform health & configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { service: "Database", status: "healthy", uptime: "99.98%" },
          { service: "API Gateway", status: "healthy", uptime: "99.95%" },
          { service: "Cache Layer", status: "healthy", uptime: "99.99%" },
          { service: "Email Service", status: "healthy", uptime: "99.87%" },
          { service: "Payment Gateway", status: "healthy", uptime: "99.92%" },
          { service: "Analytics", status: "degraded", uptime: "98.45%" },
        ].map((item) => (
          <div key={item.service} className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <div className="flex justify-between items-start">
              <p className="text-white font-semibold">{item.service}</p>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === "healthy"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-yellow-900/30 text-yellow-400"
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Uptime: {item.uptime}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">System Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: "API Latency", value: "245ms", status: "good" },
            { metric: "Error Rate", value: "0.02%", status: "good" },
            { metric: "Request/sec", value: "12,450", status: "good" },
            { metric: "Active Sessions", value: "2,345", status: "good" },
          ].map((item) => (
            <div key={item.metric} className="bg-gray-800 rounded p-4">
              <p className="text-gray-400 text-sm">{item.metric}</p>
              <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
