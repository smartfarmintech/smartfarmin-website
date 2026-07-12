"use client"

export const dynamic = "force-dynamic"

export default function GovernmentDashboard() {
  const apSchemes = [
    { name: "PM Kisan Samman Nidhi", desc: "Direct income support to farmers", amount: "₹6000/year", eligible: true },
    { name: "Crop Insurance - PMFBY", desc: "Insurance against crop failures", amount: "Variable", eligible: true },
    { name: "AP Rythu Bandhu", desc: "Financial assistance per acre", amount: "₹5000/acre", eligible: true },
    { name: "AP Rythu Barosa", desc: "Crop insurance scheme", amount: "Variable", eligible: false },
  ]

  const nationalSchemes = [
    { name: "Pradhan Mantri Kisan Maan Dhan Yojana", desc: "Pension scheme for farmers", benefit: "₹3000/month pension" },
    { name: "Soil Health Card Scheme", desc: "Free soil testing and analysis", benefit: "Free soil card + advice" },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">e-Kranti</h1>
        <p className="text-gray-600">Government Benefits & Services</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <p className="text-blue-900 font-semibold">You&apos;re registered in: Andhra Pradesh</p>
        <p className="text-sm text-blue-800 mt-1">Viewing AP-specific schemes + National programs</p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Andhra Pradesh Schemes</h2>
        <div className="space-y-3">
          {apSchemes.map((scheme, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{scheme.name}</h3>
                  <p className="text-sm text-gray-600">{scheme.desc}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded ${scheme.eligible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {scheme.eligible ? "Eligible" : "Not Eligible"}
                </span>
              </div>
              <p className="text-lg font-bold text-blue-600">{scheme.amount}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">National Schemes</h2>
        <div className="space-y-3">
          {nationalSchemes.map((scheme, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900">{scheme.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{scheme.desc}</p>
              <p className="text-blue-600 font-semibold mt-2">{scheme.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
