'use client'

import { motion } from 'framer-motion'
import { Lightbulb, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface FarmingTip {
  id: string
  title: string
  description: string
  category: 'irrigation' | 'pest' | 'fertilizer' | 'harvest' | 'soil'
  readTime: number
  icon: string
}

interface FarmingTipsProps {
  tips: FarmingTip[]
}

const categoryColors = {
  irrigation: 'bg-blue-50 text-blue-700 border-blue-200',
  pest: 'bg-red-50 text-red-700 border-red-200',
  fertilizer: 'bg-green-50 text-green-700 border-green-200',
  harvest: 'bg-amber-50 text-amber-700 border-amber-200',
  soil: 'bg-orange-50 text-orange-700 border-orange-200',
}

const categoryEmoji = {
  irrigation: '💧',
  pest: '🐛',
  fertilizer: '🌾',
  harvest: '🌾',
  soil: '🪨',
}

export function FarmingTips({ tips }: FarmingTipsProps) {
  if (!tips || tips.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed">
        <Lightbulb className="w-12 h-12 text-amber-600 mx-auto mb-3 opacity-50" />
        <p className="text-gray-600">Farming tips coming soon</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, index) => (
        <motion.div
          key={tip.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`${categoryColors[tip.category]} border-2 p-4 cursor-pointer hover:shadow-md transition-shadow`}>
            <Link href={`/learning/${tip.id}`} className="block">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                  {categoryEmoji[tip.category]}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {tip.description}
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    📖 {tip.readTime} min read
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1" />
              </div>
            </Link>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
