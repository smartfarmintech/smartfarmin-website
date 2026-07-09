'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Mail, Share2, Heart, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTAFooter() {
  const footerLinks = {
    Product: ['Solutions', 'Products', 'Marketplace', 'Pricing'],
    Resources: ['Documentation', 'Blog', 'Community', 'Support'],
    Company: ['About Us', 'Careers', 'Investors', 'News'],
    Legal: ['Privacy', 'Terms', 'Security', 'Contact'],
  }

  return (
    <>
      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Ready to Transform Agriculture?
            </h2>
            <p className="text-xl text-green-50 max-w-3xl mx-auto mb-12">
              Join thousands of farmers and agricultural businesses building a smarter, more sustainable future with Rythu360.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
            >
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold">
                Launch Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Book Machinery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              {['Secure & Verified', 'Government Backed', 'Enterprise Grade', 'Farmer Approved'].map((badge, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-green-50 text-sm font-semibold">
                  ✓ {badge}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Footer background pattern */}
        <div className="absolute inset-0 opacity-5">
          <Leaf className="w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Main footer content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-5 gap-12 mb-12"
            >
              {/* Brand section */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-6 h-6 text-green-500" />
                  <span className="text-xl font-bold">Rythu360</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Empowering farmers with AI-powered agriculture technology.
                </p>
                <div className="flex gap-4">
                  {[Share2, Link, Heart, Mail].map((Icon, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-bold text-white mb-4">{category}</h3>
                  <ul className="space-y-2">
                    {links.map((link, idx) => (
                      <li key={idx}>
                        <a href="#" className="text-gray-400 hover:text-green-500 text-sm transition-colors duration-300">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-gray-800 rounded-2xl p-8 mb-12"
            >
              <h3 className="text-xl font-bold mb-2">Subscribe to Updates</h3>
              <p className="text-gray-400 mb-4">Get the latest news and insights from the Rythu360 team.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Bottom section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="border-t border-gray-800 pt-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-gray-400 text-sm">
                  <p>© 2024 SmartFarmin Technologies. All rights reserved.</p>
                  <p className="mt-2">Built with ❤️ for India&apos;s farming community.</p>
                </div>

                {/* Closing quote */}
                <div className="text-center md:text-right">
                  <p className="text-green-400 font-semibold italic">
                    "Empowering Farmers with Technology"
                  </p>
                  <p className="text-gray-500 text-sm">- Rythu360 Vision</p>
                </div>
              </div>

              {/* QR Code and metrics */}
              <div className="mt-8 grid md:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">2,50,000+</p>
                  <p className="text-gray-400 text-sm">Farmers Connected</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">5,000+</p>
                  <p className="text-gray-400 text-sm">Villages Served</p>
                </div>
                <div className="text-center">
                  <p className="text-xl text-gray-400">Download QR</p>
                  <p className="text-sm text-gray-500">Scan for mobile app</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  )
}
