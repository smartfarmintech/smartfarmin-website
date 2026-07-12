"use client"

export const dynamic = "force-dynamic"

export default function DiscoverPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Discover Map</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center h-96 flex items-center justify-center">
        <div>
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-gray-600 text-lg">Google Maps Integration</p>
        </div>
      </div>
    </div>
  )
}
