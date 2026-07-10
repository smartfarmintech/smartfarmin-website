import { EligibilityChecker } from '@/components/schemes/eligibility-checker'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'Government Schemes | Rythu360',
  description: 'Check eligibility and apply for agricultural schemes and subsidies',
}

export default function GovernmentSchemesPage() {
  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Government Schemes</h1>
            <p className="text-gray-600 max-w-2xl">
              Discover schemes you're eligible for and get instant support. From crop insurance to income support,
              find the right benefits for your farm.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-sm font-semibold text-gray-600">ELIGIBLE</p>
              <p className="text-2xl font-bold text-green-600">4 Schemes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-yellow-200">
              <div className="text-3xl mb-2">⚠</div>
              <p className="text-sm font-semibold text-gray-600">REVIEW NEEDED</p>
              <p className="text-2xl font-bold text-yellow-600">2 Schemes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-red-200">
              <div className="text-3xl mb-2">✗</div>
              <p className="text-sm font-semibold text-gray-600">NOT ELIGIBLE</p>
              <p className="text-2xl font-bold text-red-600">1 Scheme</p>
            </div>
          </div>

          <EligibilityChecker />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
