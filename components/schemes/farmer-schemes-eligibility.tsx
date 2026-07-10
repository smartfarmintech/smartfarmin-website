'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, AlertCircle, XCircle, Phone } from 'lucide-react'

interface Scheme {
  id: string
  name: string
  emoji: string
  description: string
  benefit: string
  deadline: string
  status: 'eligible' | 'review' | 'ineligible'
  eligibilityDetails: string[]
}

interface FarmerSchemesEligibilityProps {
  schemes?: Scheme[]
  onApply?: (schemeId: string) => void
}

const defaultSchemes: Scheme[] = [
  {
    id: 'pmksy',
    name: 'PMKSY - Pradhan Mantri Krishi Sinchayee Yojana',
    emoji: '💧',
    description: 'Irrigation support for farmers',
    benefit: 'Up to ₹1,00,000 subsidy',
    deadline: '31 Dec 2024',
    status: 'eligible',
    eligibilityDetails: [
      'Own agricultural land (minimum 0.5 acre)',
      'Annual income below ₹5 lakhs',
      'No pending loans',
    ],
  },
  {
    id: 'pkvy',
    name: 'PKVY - Paramparagat Krishi Vikas Yojana',
    emoji: '🌱',
    description: 'Organic farming support',
    benefit: 'Up to ₹50,000 per acre',
    deadline: '15 Nov 2024',
    status: 'eligible',
    eligibilityDetails: [
      'Willing to adopt organic farming',
      'Minimum 1 acre of land',
      'Cluster formation required',
    ],
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN - Pradhan Mantri Kisan Samman Nidhi',
    emoji: '💰',
    description: 'Income support scheme',
    benefit: '₹6,000 per year (₹2,000 x 3)',
    deadline: '30 Jun 2025',
    status: 'review',
    eligibilityDetails: [
      'Must be landholding farmer',
      'Holding size up to 2 hectares',
      'Age 18-75 years',
    ],
  },
  {
    id: 'kcc',
    name: 'KCC - Kisan Credit Card',
    emoji: '🏦',
    description: 'Agricultural credit facility',
    benefit: 'Up to ₹3,00,000 credit',
    deadline: 'Open ended',
    status: 'ineligible',
    eligibilityDetails: [
      'Must be a cultivator (not met)',
      'Good credit history required',
      'No agricultural arrears',
    ],
  },
]

export function FarmerSchemesEligibility({
  schemes = defaultSchemes,
  onApply,
}: FarmerSchemesEligibilityProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'eligible' | 'review' | 'ineligible'>('all')

  const filteredSchemes = schemes.filter((s) => filter === 'all' || s.status === filter)

  const getStatusConfig = (status: Scheme['status']) => {
    switch (status) {
      case 'eligible':
        return {
          color: 'green',
          icon: CheckCircle2,
          label: 'Eligible',
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-900',
          badgeClass: 'bg-green-500 text-white',
        }
      case 'review':
        return {
          color: 'yellow',
          icon: AlertCircle,
          label: 'Under Review',
          bgClass: 'bg-yellow-50 border-yellow-200',
          textClass: 'text-yellow-900',
          badgeClass: 'bg-yellow-500 text-white',
        }
      case 'ineligible':
        return {
          color: 'red',
          icon: XCircle,
          label: 'Not Eligible',
          bgClass: 'bg-red-50 border-red-200',
          textClass: 'text-red-900',
          badgeClass: 'bg-red-500 text-white',
        }
    }
  }

  const eligibleCount = schemes.filter((s) => s.status === 'eligible').length
  const reviewCount = schemes.filter((s) => s.status === 'review').length

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-green-600">{eligibleCount}</div>
          <p className="text-sm font-semibold text-green-900">Eligible Schemes</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-yellow-600">{reviewCount}</div>
          <p className="text-sm font-semibold text-yellow-900">Under Review</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-blue-600">{schemes.length}</div>
          <p className="text-sm font-semibold text-blue-900">Total Schemes</p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'eligible', 'review', 'ineligible'] as const).map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-forest-green text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all'
              ? 'All Schemes'
              : f === 'eligible'
                ? 'Eligible'
                : f === 'review'
                  ? 'Review'
                  : 'Not Eligible'}
          </motion.button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme, idx) => {
          const config = getStatusConfig(scheme.status)
          const StatusIcon = config.icon

          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border-2 rounded-2xl overflow-hidden transition-all ${config.bgClass}`}
            >
              {/* Scheme Header */}
              <motion.button
                onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                className="w-full p-4 flex items-start gap-4 hover:opacity-80 transition-opacity"
              >
                {/* Emoji */}
                <div className="text-4xl mt-1">{scheme.emoji}</div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold text-lg ${config.textClass}`}>{scheme.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.badgeClass}`}>
                      <div className="flex items-center gap-1">
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-gray-900">🎁 {scheme.benefit}</span>
                    <span className="text-gray-600">📅 {scheme.deadline}</span>
                  </div>
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: expandedId === scheme.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2"
                >
                  <ChevronDown className={`w-6 h-6 ${config.textClass}`} />
                </motion.div>
              </motion.button>

              {/* Scheme Details */}
              <AnimatePresence>
                {expandedId === scheme.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t-2 ${config.bgClass} p-4 space-y-4`}
                  >
                    {/* Eligibility Details */}
                    <div>
                      <h4 className="font-bold text-sm mb-2">Eligibility Requirements:</h4>
                      <ul className="space-y-2">
                        {scheme.eligibilityDetails.map((detail, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-lg">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t-2 opacity-50 border-current">
                      {scheme.status === 'eligible' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onApply?.(scheme.id)}
                          className="flex-1 bg-forest-green text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-forest-green/90 transition-colors"
                        >
                          Apply Now
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-white text-forest-green border-2 border-forest-green py-3 px-4 rounded-xl font-bold text-sm hover:bg-forest-green/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Expert Help
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
