'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Video, X } from 'lucide-react'

interface SupportOption {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  action: () => void
}

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false)

  const supportOptions: SupportOption[] = [
    {
      id: 'chat',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Chat',
      color: 'bg-blue-500',
      action: () => {
        window.open('https://wa.me/919876543210', '_blank')
        setIsOpen(false)
      },
    },
    {
      id: 'call',
      icon: <Phone className="w-5 h-5" />,
      label: 'Call',
      color: 'bg-green-500',
      action: () => {
        window.location.href = 'tel:+919876543210'
        setIsOpen(false)
      },
    },
    {
      id: 'video',
      icon: <Video className="w-5 h-5" />,
      label: 'Video',
      color: 'bg-purple-500',
      action: () => {
        console.log('Video call initiated')
        setIsOpen(false)
      },
    },
  ]

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-green to-leaf-green text-white shadow-2xl flex items-center justify-center font-bold text-xl hover:shadow-2xl transition-all"
          animate={{ scale: isOpen ? 0.95 : 1 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="support"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <span>📞</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Support menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-32 md:bottom-24 right-4 md:right-8 z-30 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {supportOptions.map((option, idx) => (
              <motion.button
                key={option.id}
                onClick={option.action}
                className={`${option.color} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={option.label}
              >
                {option.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing indicator when closed */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-16 h-16 rounded-full pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-forest-green" />
        </motion.div>
      )}
    </>
  )
}
