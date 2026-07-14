'use client'

import { useState } from 'react'
import { Drone, Truck, Zap, Sun, Star, MapPin, Calendar, Zap as ZapIcon, Users } from 'lucide-react'
import { MachineryContent } from './machinery-content'

interface MachineryTabsProps {
  activeTab: 'drone' | 'tractor' | 'jcb' | 'solar'
  setActiveTab: (tab: 'drone' | 'tractor' | 'jcb' | 'solar') => void
}

const tabs = [
  { id: 'drone', label: 'Drones', icon: Drone, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'tractor', label: 'Tractors', icon: Truck, color: 'bg-amber-500/10 text-amber-600' },
  { id: 'jcb', label: 'JCB', icon: ZapIcon, color: 'bg-orange-500/10 text-orange-600' },
  { id: 'solar', label: 'Solar', icon: Sun, color: 'bg-yellow-500/10 text-yellow-600' },
]

export function MachineryTabs({ activeTab, setActiveTab }: MachineryTabsProps) {
  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/40 text-foreground hover:bg-secondary/60'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <MachineryContent activeTab={activeTab} />
    </div>
  )
}
