"use client"

export default function TempleDashboard() {
  const featured = [
    { name: "Tirupati Balaji Temple", location: "Chittoor, AP", visitors: "25M/year", rating: 4.9 },
    { name: "Srisailam Temple", location: "Nandyal, AP", visitors: "8M/year", rating: 4.8 },
    { name: "Lepakshi Temple", location: "Anantapur, AP", visitors: "2M/year", rating: 4.7 },
  ]

  const upcomingFestivals = [
    { name: "Diwali Celebrations", date: "Nov 1, 2024", temples: "150+ temples" },
    { name: "Brahmotsavam", date: "Sep 15-23, 2024", temples: "75+ temples" },
    { name: "Maha Shivaratri", date: "Feb 24, 2025", temples: "200+ temples" },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Darshan</h1>
        <p className="text-gray-600">Pilgrimage & Rural Tourism</p>
      </div>

      <div className="mb-8 flex gap-4">
        <input
          type="search"
          placeholder="Search temples, experiences..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
          Search
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Temples</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((temple, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="h-40 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-5xl">
                🛕
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{temple.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{temple.location}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{temple.visitors}</span>
                  <span className="text-yellow-500">⭐ {temple.rating}</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                  Book Darshan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Festival Calendar</h2>
        <div className="space-y-3">
          {upcomingFestivals.map((fest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{fest.name}</h3>
                  <p className="text-sm text-gray-600">{fest.temples}</p>
                </div>
                <span className="text-purple-600 font-semibold">{fest.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
