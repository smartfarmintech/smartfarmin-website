import { CropDoctorUpload } from '@/components/ai/crop-doctor-upload'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'AI Crop Doctor | Rythu360',
  description: 'Get instant disease and pest diagnosis using AI',
}

export default function AICropDoctorPage() {
  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">AI Crop Doctor</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Identify diseases, pests, and nutrient deficiencies instantly. Get personalized treatment
              recommendations and nearby shop locations.
            </p>
          </div>

          <CropDoctorUpload />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
