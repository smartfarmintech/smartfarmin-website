import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CameraCropDoctor } from "@/components/ai/camera-crop-doctor"
import { FarmerBottomNav } from "@/components/farmer-bottom-nav"

export const metadata = {
  title: 'AI Crop Doctor | Rythu360',
  description: 'Diagnose crop diseases using AI-powered image analysis',
}

export default function CropDoctorPage() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            🏥 AI Crop Doctor
          </h1>
          <p className="text-lg text-gray-600">
            Identify crop diseases and get treatment recommendations instantly
          </p>
        </div>
        <CameraCropDoctor />
      </main>
      <FarmerBottomNav />
      <SiteFooter />
    </div>
  )
}
