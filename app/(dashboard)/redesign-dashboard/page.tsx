'use client'

import { useState } from 'react'
import { UserProfile } from '@/components/redesign/user-profile'
import { MachineryTabs } from '@/components/redesign/machinery-tabs'
import { MarketingSection } from '@/components/redesign/marketing-section'
import { AIAssistant } from '@/components/redesign/ai-assistant'
import { useRouter } from 'next/navigation'

export default function RedesignDashboard() {
  const [activeTab, setActiveTab] = useState<'drone' | 'tractor' | 'jcb' | 'solar'>('drone')
  const router = useRouter()

  const handleLogout = () => {
    router.push('/auth?mode=login')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                SF
              </div>
              <h1 className="text-2xl font-bold text-foreground">Akanksha AgreeTech</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <UserProfile />

        {/* Machinery Services Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Services</h2>
          <MachineryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Marketing Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Products & Services</h2>
          <MarketingSection />
        </div>

        {/* Community Section */}
        <div className="mt-12 rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h3 className="text-3xl font-bold mb-4">Join the Growing Community</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Connect with thousands of farmers, access expert advice, and grow your farming business with Akanksha AgreeTech.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:opacity-90 transition">
              Learn More
            </button>
            <button className="px-6 py-3 border-2 border-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Akanksha AgreeTech. All rights reserved. Your trusted farm marketplace.</p>
        </footer>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </main>
  )
}
