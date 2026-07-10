'use client'

import React, { useState } from 'react'
import { Check, AlertCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Scheme {
  id: number
  name: string
  description: string
  eligibility: 'eligible' | 'review' | 'ineligible'
  benefitAmount: string
  deadline: string
  requirements: string[]
  applyUrl?: string
}

const SCHEMES: Scheme[] = [
  {
    id: 1,
    name: 'PM-KISAN Scheme',
    description: 'Direct income support to farmers',
    eligibility: 'eligible',
    benefitAmount: '₹6,000 per year',
    deadline: '31 Dec 2024',
    requirements: ['Farmer with land', 'Age 18+', 'Income < ₹2 lakh'],
    applyUrl: '/apply/pm-kisan',
  },
  {
    id: 2,
    name: 'Soil Health Card Scheme',
    description: 'Free soil testing and health cards',
    eligibility: 'eligible',
    benefitAmount: 'Free soil test',
    deadline: 'Ongoing',
    requirements: ['Active farmer', 'Land with cultivation'],
    applyUrl: '/apply/soil-health',
  },
  {
    id: 3,
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance coverage',
    eligibility: 'review',
    benefitAmount: 'Variable premium subsidy',
    deadline: '31 Jul 2024',
    requirements: ['Crop cultivator', 'Have farm document', 'Age 18-60'],
    applyUrl: '/apply/crop-insurance',
  },
  {
    id: 4,
    name: 'Kisan Vikas Patra',
    description: 'Savings scheme for farmers',
    eligibility: 'ineligible',
    benefitAmount: '7.5% interest',
    deadline: 'Ongoing',
    requirements: ['Age 18+', 'Citizen of India', 'No other KVP'],
    applyUrl: '/apply/kvp',
  },
  {
    id: 5,
    name: 'Kisan Credit Card Scheme',
    description: 'Easy credit for agricultural needs',
    eligibility: 'review',
    benefitAmount: 'Up to ₹3 lakh',
    deadline: 'Ongoing',
    requirements: ['Land ownership', 'No negative record', 'Debt less than 2 years old'],
    applyUrl: '/apply/kcc',
  },
  {
    id: 6,
    name: 'Rashtriya Krishi Vikas Yojana',
    description: 'Support for agricultural development',
    eligibility: 'eligible',
    benefitAmount: '₹50,000 - ₹1 lakh subsidy',
    deadline: '15 Aug 2024',
    requirements: ['Small/Marginal farmer', 'Annual turnover < ₹50 lakh'],
    applyUrl: '/apply/rkvy',
  },
]

const getEligibilityColor = (status: string) => {
  switch (status) {
    case 'eligible':
      return 'bg-green-50 border-green-300 text-green-700'
    case 'review':
      return 'bg-yellow-50 border-yellow-300 text-yellow-700'
    case 'ineligible':
      return 'bg-red-50 border-red-300 text-red-700'
    default:
      return 'bg-gray-50'
  }
}

const getEligibilityBadge = (status: string) => {
  switch (status) {
    case 'eligible':
      return { icon: '✓', label: 'Eligible', color: 'bg-green-500' }
    case 'review':
      return { icon: '⚠', label: 'Review Needed', color: 'bg-yellow-500' }
    case 'ineligible':
      return { icon: '✗', label: 'Not Eligible', color: 'bg-red-500' }
    default:
      return { icon: '?', label: 'Unknown', color: 'bg-gray-500' }
  }
}

export function EligibilityChecker() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'eligible' | 'review' | 'ineligible'>('all')
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)

  const filteredSchemes =
    filterStatus === 'all' ? SCHEMES : SCHEMES.filter((s) => s.eligibility === filterStatus)

  const badge = (status: string) => {
    const b = getEligibilityBadge(status)
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-semibold text-sm ${b.color}`}>
        <span>{b.icon}</span>
        {b.label}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'eligible', 'review', 'ineligible'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as typeof filterStatus)}
            className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${
              filterStatus === status
                ? 'bg-leaf-green-500 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-leaf-green-300'
            }`}
          >
            {status === 'all'
              ? 'All Schemes'
              : status === 'eligible'
                ? `✓ Eligible (${SCHEMES.filter((s) => s.eligibility === 'eligible').length})`
                : status === 'review'
                  ? `⚠ Review (${SCHEMES.filter((s) => s.eligibility === 'review').length})`
                  : `✗ Not Eligible (${SCHEMES.filter((s) => s.eligibility === 'ineligible').length})`}
          </button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="space-y-3">
        {filteredSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className={`border-2 rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-md ${getEligibilityColor(scheme.eligibility)}`}
            onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
          >
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold">{scheme.name}</h3>
                  {badge(scheme.eligibility)}
                </div>
                <p className="text-sm opacity-90">{scheme.description}</p>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedScheme === scheme.id && (
              <div className="px-4 pb-4 pt-0 space-y-4 border-t-2 border-current border-opacity-20">
                {/* Benefit Amount */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold opacity-75">BENEFIT AMOUNT</p>
                  <p className="text-lg font-bold">{scheme.benefitAmount}</p>
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold opacity-75">DEADLINE</p>
                  <p className="font-medium">{scheme.deadline}</p>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold opacity-75">REQUIREMENTS</p>
                  <ul className="space-y-1">
                    {scheme.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Check size={16} className="mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                {scheme.eligibility !== 'ineligible' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (scheme.applyUrl) {
                        window.location.href = scheme.applyUrl
                      }
                    }}
                    className="w-full bg-leaf-green-600 hover:bg-leaf-green-700 text-white font-semibold"
                  >
                    {scheme.eligibility === 'eligible' ? 'Apply Now' : 'Check Eligibility & Apply'}
                  </Button>
                )}

                {/* Contact Support for Ineligible */}
                {scheme.eligibility === 'ineligible' && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-full"
                  >
                    <HelpCircle size={18} className="mr-2" /> Talk to Expert
                  </Button>
                )}
              </div>
            )}

            {/* Click to Expand Hint */}
            <div className="px-4 py-2 bg-black bg-opacity-5 text-xs font-medium opacity-60 text-center">
              {expandedScheme === scheme.id ? '△ Click to collapse' : '▽ Click for details'}
            </div>
          </Card>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <AlertCircle size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">No schemes in this category</p>
        </div>
      )}
    </div>
  )
}
