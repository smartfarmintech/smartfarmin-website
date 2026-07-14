'use client'

import { MapPin, Leaf, TrendingUp } from 'lucide-react'

export function UserProfile() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20"></div>
      
      <div className="px-6 pb-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
          <div className="h-24 w-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold border-4 border-card shadow-md">
            RK
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">Rajesh Kumar</h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>Punjab, India</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-secondary/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Farm Size</span>
            </div>
            <p className="text-xl font-bold text-foreground">25 acres</p>
          </div>
          
          <div className="rounded-lg bg-accent/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">Crops</span>
            </div>
            <p className="text-xl font-bold text-foreground">Wheat, Rice</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
            Edit Profile
          </button>
          <button className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary/30 transition">
            View Orders
          </button>
          <button className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary/30 transition">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
