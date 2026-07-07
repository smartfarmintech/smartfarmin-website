'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = {
  id: string
  title: string
  description: string
  route: string
  illustration: string
  gradient: string
}

const roles: Role[] = [
  {
    id: 'farmer',
    title: 'Farmer',
    description: 'Manage crops, equipment rentals, and farm operations',
    route: '/login/farmer',
    illustration: '👨‍🌾',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    id: 'operator',
    title: 'Machinery Operator',
    description: 'Offer machinery services and manage bookings',
    route: '/login/operator',
    illustration: '👨‍🔧',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'drone',
    title: 'Drone Operator',
    description: 'Provide drone services for crop monitoring',
    route: '/login/drone',
    illustration: '🚁',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'telecaller',
    title: 'Telecaller',
    description: 'Manage leads and farmer communications',
    route: '/login/telecaller',
    illustration: '👨‍💼',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'field-agent',
    title: 'Field Agent',
    description: 'Conduct farm visits and verifications',
    route: '/login/field-agent',
    illustration: '🕵️',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'dealer',
    title: 'Fertilizer Dealer',
    description: 'Manage fertilizer inventory and sales',
    route: '/login/dealer',
    illustration: '🏪',
    gradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'organic-store',
    title: 'Organic Store Seller',
    description: 'Sell certified organic products',
    route: '/login/organic-store',
    illustration: '🏬',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'crop-buyer',
    title: 'Crop Buyer',
    description: 'Purchase agricultural products',
    route: '/login/crop-buyer',
    illustration: '👨‍🏫',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'delivery',
    title: 'Delivery Partner',
    description: 'Deliver products to customers',
    route: '/login/delivery',
    illustration: '🚚',
    gradient: 'from-red-500 to-orange-600'
  },
  {
    id: 'agri-expert',
    title: 'Agriculture Expert',
    description: 'Provide farming expertise and consultation',
    route: '/login/agri-expert',
    illustration: '👨‍🎓',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'government',
    title: 'Government Officer',
    description: 'Manage government schemes and programs',
    route: '/login/government',
    illustration: '👮',
    gradient: 'from-slate-600 to-gray-700'
  },
  {
    id: 'enterprise',
    title: 'Enterprise Customer',
    description: 'Corporate account for bulk operations',
    route: '/login/enterprise',
    illustration: '🏢',
    gradient: 'from-slate-700 to-slate-900'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Platform administration and management',
    route: '/login/admin',
    illustration: '👑',
    gradient: 'from-red-600 to-pink-700'
  },
  {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'Full system control and oversight',
    route: '/login/super-admin',
    illustration: '👨‍💻',
    gradient: 'from-black to-gray-800'
  }
]

export default function RolesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="pt-8 pb-12 px-4 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Rythu360
          </h1>
          <p className="text-lg text-gray-300 mb-8">Select your role to get started</p>
        </div>

        <div className="container max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => router.push(role.route)}
                className="group text-left"
              >
                <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer hover:-translate-y-1">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {role.illustration}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                    {role.description}
                  </p>
                  <div className="flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors font-semibold text-sm">
                    <span>Continue</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="py-8 px-4 text-center text-gray-400 text-sm">
          <p>
            Need help?{' '}
            <Link href="/contact" className="text-green-400 hover:text-green-300">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
