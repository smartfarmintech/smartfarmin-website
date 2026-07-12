"use client"

export const dynamic = "force-dynamic"

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
          <p className="text-gray-400">Generate and export reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "Revenue Report", updated: "Today at 3:45 PM", format: "PDF, CSV" },
          { name: "User Analytics", updated: "Today at 2:30 PM", format: "Excel, PDF" },
          { name: "Operational Overview", updated: "Yesterday at 11:20 PM", format: "PDF, CSV" },
          { name: "Market Intelligence", updated: "2 days ago", format: "Excel, PDF" },
        ].map((report) => (
          <div key={report.name} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-2">{report.name}</h3>
            <p className="text-sm text-gray-400 mb-4">Updated: {report.updated}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded transition">View</button>
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded transition">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
