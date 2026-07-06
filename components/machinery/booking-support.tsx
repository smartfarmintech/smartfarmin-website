'use client'

import { useState } from 'react'
import { HelpCircle, MessageSquare, Phone, Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export function BookingSupport() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [supportType, setSupportType] = useState<'chat' | 'email' | 'call' | null>(null)
  const [message, setMessage] = useState('')

  const faqs = [
    {
      id: 'cancel-booking',
      question: 'How do I cancel a booking?',
      answer:
        'You can cancel your booking anytime before the operator has started traveling to your location. Visit your booking details and click "Cancel Booking". For cancellations within 2 hours of booking, a small fee may apply.',
    },
    {
      id: 'operator-no-show',
      question: 'What if the operator doesn\'t show up?',
      answer:
        'If the operator hasn\'t arrived 15 minutes after the scheduled time, you can file a complaint immediately. SmartFarmin will refund the full amount and help you find an alternative operator. We take no-shows very seriously.',
    },
    {
      id: 'payment-methods',
      question: 'What payment methods do you accept?',
      answer:
        'We accept UPI, credit/debit cards, net banking, and SmartFarmin wallet. All payments are secure and encrypted. You also get a detailed invoice for every booking.',
    },
    {
      id: 'modify-booking',
      question: 'Can I modify my booking after confirmation?',
      answer:
        'Yes, you can modify the date/time if the machinery is available. Visit your booking and click "Reschedule". Changes must be made at least 4 hours before the scheduled time.',
    },
    {
      id: 'refund-policy',
      question: 'What\'s your refund policy?',
      answer:
        'Full refund if cancelled 24 hours before booking. 50% refund between 12-24 hours. No refund if cancelled within 12 hours. Refunds are processed within 3-5 business days.',
    },
    {
      id: 'emergency-support',
      question: 'Is emergency support available?',
      answer:
        'Yes! We have 24/7 emergency support for urgent machinery issues during your booking. Call our emergency line or use the in-app emergency button to reach our team immediately.',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Support Channels */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg cursor-pointer transition-shadow" onClick={() => setSupportType('chat')}>
          <MessageSquare className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Chat Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get instant help from our support team. Average response time: 2 minutes
          </p>
          <p className="text-xs text-blue-600 font-semibold">Available now</p>
        </Card>

        <Card className="p-6 hover:shadow-lg cursor-pointer transition-shadow" onClick={() => setSupportType('call')}>
          <Phone className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold mb-2">Call Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Speak directly with our team. 24/7 support for emergencies
          </p>
          <p className="text-xs text-green-600 font-semibold">1800-FARMING (1800-327-6464)</p>
        </Card>

        <Card className="p-6 hover:shadow-lg cursor-pointer transition-shadow" onClick={() => setSupportType('email')}>
          <Mail className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Send us detailed information. Response within 24 hours
          </p>
          <p className="text-xs text-purple-600 font-semibold">support@smartfarmin.com</p>
        </Card>
      </div>

      {/* Support Form */}
      {supportType && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold">
              {supportType === 'chat'
                ? 'Start a Chat'
                : supportType === 'call'
                  ? 'Call Support'
                  : 'Email Support'}
            </h3>
            <button
              onClick={() => setSupportType(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {supportType === 'chat' && (
            <div className="space-y-3">
              <Textarea
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button className="w-full">Start Chat Session</Button>
            </div>
          )}

          {supportType === 'call' && (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white border border-blue-200">
                <p className="text-sm text-muted-foreground mb-1">Tap to call</p>
                <p className="text-2xl font-bold text-green-600">1800-327-6464</p>
              </div>
              <Button className="w-full" disabled>
                <Clock className="h-4 w-4 mr-2" />
                Estimated wait: 2 minutes
              </Button>
            </div>
          )}

          {supportType === 'email' && (
            <div className="space-y-3">
              <Input
                placeholder="Your email"
                type="email"
              />
              <Input placeholder="Subject" />
              <Textarea
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button className="w-full">Send Email</Button>
            </div>
          )}
        </Card>
      )}

      {/* FAQ Section */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full p-4 text-left font-semibold hover:bg-muted/50 transition-colors flex items-center justify-between"
              >
                {faq.question}
                <span className="text-muted-foreground">
                  {openFAQ === faq.id ? '−' : '+'}
                </span>
              </button>

              {openFAQ === faq.id && (
                <div className="p-4 bg-muted/30 border-t border-border text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Policies */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Important Timelines
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking confirmation:</span>
              <span className="font-semibold">Instant</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator assignment:</span>
              <span className="font-semibold">5-10 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator arrival:</span>
              <span className="font-semibold">15-30 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refund processing:</span>
              <span className="font-semibold">3-5 days</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Safety Guidelines
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Clear the field of obstacles before machinery arrives</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Ensure all personnel are aware of machinery operation</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Follow operator instructions at all times</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Report any issues immediately to operator</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
