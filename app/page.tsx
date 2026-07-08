'use client'

import { useState } from 'react'
import { SiteHeader } from "@/components/site-header"
import { FarmerHeroSection } from "@/components/farmer-hero-section"
import { FarmerWelcomeGreeting } from "@/components/farmer-welcome-greeting"
import { FarmerActionCard } from "@/components/farmer-action-card"
import { SiteFooter } from "@/components/site-footer"
import { motion } from 'framer-motion'

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en')

  // Content in multiple languages
  const content = {
    en: {
      services: 'Quick Services',
      shortcuts: 'Frequently Used',
      trust: 'Why Choose Rythu360',
      services_list: [
        { icon: '🚜', title: 'Book Machinery', desc: 'Rent tractor or harvester', href: '/farmer/machinery-booking', color: 'green' as const },
        { icon: '🚁', title: 'Book Drone', desc: 'Drone spraying services', href: '/farmer/drone-booking', color: 'orange' as const },
        { icon: '🏥', title: 'Crop Doctor', desc: 'AI disease detection', href: '/farmer/ai-crop-doctor', color: 'blue' as const },
        { icon: '🌤', title: 'Weather', desc: 'Today forecast', href: '/farmer/weather', color: 'purple' as const },
        { icon: '🛒', title: 'Marketplace', desc: 'Buy seeds & fertilizers', href: '/farmer/marketplace', color: 'green' as const },
        { icon: '💰', title: 'Sell Crops', desc: 'Direct to buyer', href: '/farmer/sell-crops', color: 'orange' as const },
        { icon: '📍', title: 'Track Booking', desc: 'Check status', href: '/farmer/bookings', color: 'blue' as const },
        { icon: '📞', title: 'Support', desc: '24/7 help available', href: '/farmer/support', color: 'red' as const },
      ],
    },
    te: {
      services: 'వేగవంతమైన సేవలు',
      shortcuts: 'తరచుగా ఉపయోగించిన',
      trust: 'Rythu360 ఎందుకు ఎంచుకోండి',
      services_list: [
        { icon: '🚜', title: 'యంత్రం బుక్ చేయండి', desc: 'ట్రాక్టర్ లేదా కంబైన్', href: '/farmer/machinery-booking', color: 'green' as const },
        { icon: '🚁', title: 'డ్రోన్ బుక్ చేయండి', desc: 'డ్రోన్ స్ప్రేయింగ్', href: '/farmer/drone-booking', color: 'orange' as const },
        { icon: '🏥', title: 'పంట డాక్టర్', desc: 'AI రోగ గుర్తింపు', href: '/farmer/ai-crop-doctor', color: 'blue' as const },
        { icon: '🌤', title: 'వాతావరణం', desc: 'ఈ రోజు సూచన', href: '/farmer/weather', color: 'purple' as const },
        { icon: '🛒', title: 'మార్కెట్ప్లేస్', desc: 'విత్తనాలు కొనండి', href: '/farmer/marketplace', color: 'green' as const },
        { icon: '💰', title: 'పంట విక్రయం', desc: 'నేరుగా కొనుగోలుదారుకు', href: '/farmer/sell-crops', color: 'orange' as const },
        { icon: '📍', title: 'బుకింగ్ ట్రాక్ చేయండి', desc: 'స్థితిని చెక్ చేయండి', href: '/farmer/bookings', color: 'blue' as const },
        { icon: '📞', title: 'సపోర్టు', desc: '24/7 సహాయం', href: '/farmer/support', color: 'red' as const },
      ],
    },
    hi: {
      services: 'त्वरित सेवाएं',
      shortcuts: 'अक्सर उपयोग की गई',
      trust: 'Rythu360 क्यों चुनें',
      services_list: [
        { icon: '🚜', title: 'मशीन बुक करें', desc: 'ट्रैक्टर या कंबाइन', href: '/farmer/machinery-booking', color: 'green' as const },
        { icon: '🚁', title: 'ड्रोन बुक करें', desc: 'ड्रोन स्प्रेयिंग', href: '/farmer/drone-booking', color: 'orange' as const },
        { icon: '🏥', title: 'फसल डॉक्टर', desc: 'AI रोग पहचान', href: '/farmer/ai-crop-doctor', color: 'blue' as const },
        { icon: '🌤', title: 'मौसम', desc: 'आज का पूर्वानुमान', href: '/farmer/weather', color: 'purple' as const },
        { icon: '🛒', title: 'मार्केटप्लेस', desc: 'बीज खरीदें', href: '/farmer/marketplace', color: 'green' as const },
        { icon: '💰', title: 'फसल बेचें', desc: 'सीधे खरीदार को', href: '/farmer/sell-crops', color: 'orange' as const },
        { icon: '📍', title: 'बुकिंग ट्रैक करें', desc: 'स्थिति जांचें', href: '/farmer/bookings', color: 'blue' as const },
        { icon: '📞', title: 'समर्थन', desc: '24/7 सहायता', href: '/farmer/support', color: 'red' as const },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="space-y-0 overflow-hidden">
        <FarmerHeroSection />

        {/* Welcome greeting section */}
        <FarmerWelcomeGreeting language={language} />

        {/* Quick Services Grid */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentContent.services}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentContent.services_list.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <FarmerActionCard
                    icon={service.icon}
                    title={service.title}
                    description={service.desc}
                    href={service.href}
                    color={service.color}
                    size="md"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-soft-mint-50">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentContent.trust}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '✅', title: 'AI Powered', desc: 'Advanced technology' },
                { icon: '🇮🇳', title: 'Made for Farmers', desc: 'Indian agriculture' },
                { icon: '📞', title: '24/7 Support', desc: 'Always available' },
                { icon: '🔒', title: 'Secure Payments', desc: 'Your money safe' },
              ].map((trust, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-6 rounded-2xl bg-white border-2 border-forest-green/10 hover:shadow-lg transition-all"
                  whileHover={{ y: -8 }}
                >
                  <div className="text-5xl mb-4">{trust.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{trust.title}</h3>
                  <p className="text-gray-600">{trust.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
