"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"

export default function LocalBusinessDashboard() {
  const categories = [
    { name: "Mechanic", icon: "🔧", count: "24", desc: "Farm equipment repair" },
    { name: "Agricultural Shop", icon: "🌾", count: "18", desc: "Seeds & fertilizers" },
    { name: "Veterinary", icon: "🐄", count: "8", desc: "Livestock care" },
    { name: "Tractor Rental", icon: "🚜", count: "12", desc: "Heavy machinery" },
    { name: "Food Processor", icon: "🍚", count: "6", desc: "Rice mills & processing" },
    { name: "Transport", icon: "🚚", count: "14", desc: "Logistics & delivery" },
    { name: "Warehousing", icon: "🏭", count: "9", desc: "Storage facilities" },
    { name: "Cooperative", icon: "👥", count: "5", desc: "Farmer groups" },
  ]

  const nearby = [
    { name: "Rajesh's Farm Mechanic", category: "Mechanic", distance: "0.8 km", rating: 4.8 },
    { name: "Green Valley Seeds", category: "Agricultural Shop", distance: "1.2 km", rating: 4.6 },
    { name: "Dr. Ramakrishna Vet Clinic", category: "Veterinary", distance: "1.5 km", rating: 4.9 },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Local Rythu</h1>
        <p className="text-gray-600">Find village services near you</p>
      </div>

      <div className="mb-8 flex gap-4">
        <input
          type="search"
          placeholder="Search services, businesses..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg">
          Search
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
              <p className="text-xs text-gray-600">{cat.count} nearby</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Services</h2>
        <div className="space-y-3">
          {nearby.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.category}</p>
                  <p className="text-xs text-gray-500 mt-1">{service.distance} away</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-500">⭐ {service.rating}</p>
                  <button className="mt-2 px-4 py-1 bg-orange-100 text-orange-600 font-medium rounded text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
