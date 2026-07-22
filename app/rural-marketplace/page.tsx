import { Metadata } from "next"
import { RuralMarketplace } from "@/components/rural-commerce/rural-marketplace"

export const metadata: Metadata = {
  title: "Rural Commerce Marketplace | AgreeConnect",
  description: "Connect directly with farmers, traders, and local businesses. Fresh produce, grains, nursery plants, livestock, and farm equipment.",
}

export default function RuralMarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary/2 to-white py-8">
      <RuralMarketplace />
    </main>
  )
}
