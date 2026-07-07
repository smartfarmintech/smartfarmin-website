'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, Calendar, DollarSign, TrendingUp, Users, Zap } from 'lucide-react'

interface OverviewCard {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  variant: 'default' | 'success' | 'warning' | 'error'
}

const overviewCards: OverviewCard[] = [
  {
    title: 'Pending Requests',
    value: 5,
    icon: <AlertCircle className="w-5 h-5" />,
    variant: 'warning',
  },
  {
    title: 'Today\'s Jobs',
    value: 2,
    icon: <Calendar className="w-5 h-5" />,
    variant: 'default',
  },
  {
    title: 'This Month Earnings',
    value: '₹45,250',
    change: '+12% vs last month',
    icon: <DollarSign className="w-5 h-5" />,
    variant: 'success',
  },
  {
    title: 'Active Machines',
    value: 3,
    icon: <Zap className="w-5 h-5" />,
    variant: 'default',
  },
  {
    title: 'Total Bookings',
    value: 156,
    change: '+8 this week',
    icon: <TrendingUp className="w-5 h-5" />,
    variant: 'success',
  },
  {
    title: 'Average Rating',
    value: '4.8★',
    change: '(127 reviews)',
    icon: <Users className="w-5 h-5" />,
    variant: 'success',
  },
]

const variantColors = {
  default: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
}

const iconColors = {
  default: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

export default function OperatorOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {overviewCards.map((card, idx) => (
        <Card
          key={idx}
          className={`p-6 border-l-4 ${variantColors[card.variant]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{card.title}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
              {card.change && (
                <p className="text-xs mt-2 opacity-60">{card.change}</p>
              )}
            </div>
            <div className={`${iconColors[card.variant]} opacity-75`}>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
