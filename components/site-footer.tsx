import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

const columns = [
  {
    title: "Products",
    links: [
      { label: "Rythu360", href: "/products/rythu360" },
      { label: "Akanksha AI", href: "/products/akanksha-ai" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Organic Store", href: "/organic-store" },
      { label: "Drone Services", href: "/drone-services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Investor Relations",
    links: [
      { label: "About", href: "/about" },
      { label: "Investors", href: "/investors" },
      { label: "Careers", href: "/careers" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="about" className="scroll-mt-20 relative bg-gradient-to-b from-soft-mint-50 to-cream-50 border-t border-forest-green/10">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-green to-leaf-green text-white shadow-lg group-hover:shadow-xl group-hover:shadow-forest-green/30 transition-all">
                <Leaf className="size-6 font-bold" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-forest-green">
                  SmartFarmin
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Technologies Pvt. Ltd.
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-gray-700 font-medium">
              Empowering every farmer with AI-powered agriculture technology. India&apos;s super platform for modern farming.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="size-4 text-forest-green flex-shrink-0" />
                <a href="mailto:hello@smartfarmin.com" className="hover:text-forest-green transition-colors">
                  hello@smartfarmin.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="size-4 text-forest-green flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-forest-green transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <MapPin className="size-4 text-forest-green flex-shrink-0 mt-0.5" />
                <span>
                  Tech Park, Hyderabad<br />
                  Telangana, India
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              <a href="#" className="text-gray-600 hover:text-forest-green hover:bg-forest-green/10 transition-all p-2.5 rounded-xl" aria-label="Twitter">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-forest-green hover:bg-forest-green/10 transition-all p-2.5 rounded-xl" aria-label="LinkedIn">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm-1.337 9.763h2.674V7.985H3.668v8.353zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-forest-green hover:bg-forest-green/10 transition-all p-2.5 rounded-xl" aria-label="Facebook">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-4.5-6.5h-1.5A2.5 2.5 0 0011 6.5v1.5h-1.5v2h1.5v5h2v-5h1.5v-2h-1.5V6.5z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-forest-green hover:bg-forest-green/10 transition-all p-2.5 rounded-xl" aria-label="Instagram">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm12 1a1 1 0 100-2 1 1 0 000 2zm-5 4a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-sm font-bold text-forest-green uppercase tracking-widest">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-700 font-medium transition-all duration-200 hover:text-forest-green hover:translate-x-0.5 inline-flex"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-forest-green/10" />

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            © {new Date().getFullYear()} SmartFarmin Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-forest-green font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-forest-green font-medium transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-forest-green font-medium transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
