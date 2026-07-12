"use client"

export default function MarketplaceDashboard() {
  const categories = [
    { name: "Seeds", icon: "🌱", count: "450+" },
    { name: "Fertilizers", icon: "🧪", count: "320+" },
    { name: "Equipment", icon: "🛠️", count: "580+" },
    { name: "Organic", icon: "🥬", count: "240+" },
    { name: "Pesticides", icon: "🐛", count: "180+" },
    { name: "Tools", icon: "⚒️", count: "350+" },
  ]

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Marketplace</h1>

      <div className="mb-8 flex gap-4">
        <input
          type="search"
          placeholder="Search products, sellers..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg">Search</button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-600">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
