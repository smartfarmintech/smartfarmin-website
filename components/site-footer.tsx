import Link from "next/link"
import { Leaf } from "lucide-react"

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
    title: "Solutions",
    links: [
      { label: "Government", href: "/government" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Investors", href: "/investors" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="about" className="scroll-mt-20 relative border-t border-white/10 bg-gradient-to-b from-background via-background to-slate-900/30">
      {/* Sunrise theme gradient underlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/5 to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg group-hover:shadow-lg group-hover:shadow-emerald-600/30 transition-all">
                <Leaf className="size-6" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                SmartFarmin
              </span>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-slate-300">
              Cultivating a smarter, fairer and more sustainable food system for
              India, one field at a time.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors p-2 hover:bg-white/5 rounded-lg">
                <span className="sr-only">Twitter</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors p-2 hover:bg-white/5 rounded-lg">
                <span className="sr-only">LinkedIn</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm-1.337 9.763h2.674V7.985H3.668v8.353zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors p-2 hover:bg-white/5 rounded-lg">
                <span className="sr-only">Facebook</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-4.5-6.5h-1.5A2.5 2.5 0 0011 6.5v1.5h-1.5v2h1.5v5h2v-5h1.5v-2h-1.5V6.5z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400 hover:translate-x-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider with subtle Sunrise gradient */}
        <div className="mt-12 border-t border-white/10 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent h-px" />

        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs sm:text-sm text-slate-400">
            © {new Date().getFullYear()} SmartFarmin Technologies. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm text-slate-400">
            <Link href="/#about" className="hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="/#about" className="hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
