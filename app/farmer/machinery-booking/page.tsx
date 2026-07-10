import { MachineryBookingWizard } from '@/components/farmer/machinery-booking-wizard'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'Book Machinery | Rythu360',
  description: 'Easy 5-step machinery booking for your farm',
}

export default function MachineryBookingPage() {
  return (
    <div className="min-h-screen bg-soft-mint-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Book Farm Machinery</h1>
            <p className="text-gray-600">Get the equipment you need in 5 simple steps</p>
          </div>

          <MachineryBookingWizard />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
