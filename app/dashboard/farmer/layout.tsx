import { Metadata } from 'next'
import { FarmerSidebar } from '@/components/farmer/sidebar'
import { FarmerNav } from '@/components/farmer/nav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Farmer Dashboard | Rythu360',
  description: 'Manage your farm, crops, and bookings'
}

export default function FarmerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <FarmerSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <nav className="border-b border-border bg-card">
          <FarmerNav />
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
