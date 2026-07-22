import { Metadata } from "next"
import { CropDoctorInteractive } from "@/components/crop-doctor-interactive"

export const metadata: Metadata = {
  title: "AI Crop Doctor | Akanksha AgreeTech",
  description: "AI-powered crop disease detection, pest identification, nutrient analysis, and growth stage monitoring",
}

export default function CropDoctorPage() {
  return (
    <main className="min-h-screen">
      <CropDoctorInteractive />
    </main>
  )
}
