import Link from "next/link"
import { Leaf } from "lucide-react"

const columns = [
  {
    title: "Products",
    links: [
      { label: "AgreeConnect", href: "/products/agreeConnect" },
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
    <footer id="about" className="scroll-mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="size-5" />
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
                Akanksha AgreeTech
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Cultivating a smarter, fairer and more sustainable food system for
              India, one field at a time.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Akanksha AgreeTech Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/#about" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/#about" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
