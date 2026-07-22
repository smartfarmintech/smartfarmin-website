import { Metadata } from 'next'
import { temples, templeServices, templeMarketplace } from '@/lib/ecosystems/temples'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Temple & Pilgrimage | AgreeConnect',
  description: 'Discover sacred temples, pilgrimage services, and spiritual marketplace across India',
}

export default function TemplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Sacred Temples & Pilgrimage
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover 10+ revered temples, spiritual services, and sacred marketplace offerings
            </p>
          </div>
        </div>
      </section>

      {/* Temple Directory */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Sacred Temples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((temple) => (
              <Link
                key={temple.id}
                href={`/temple/${temple.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {temple.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{temple.deity}</p>
                    </div>
                    <span className="text-2xl">🕉️</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">📍 {temple.location}, {temple.state}</p>
                    <p className="text-muted-foreground">⭐ {temple.rating}/5 • {temple.visitorsPerYear} visitors/year</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {temple.services.slice(0, 3).map((service, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Temple Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Spiritual Services (26 types)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templeServices.map((service) => (
              <div key={service.id} className="rounded-xl border border-border/50 bg-card p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <span className="text-lg">
                    {service.category === 'pooja' && '🙏'}
                    {service.category === 'offering' && '🪴'}
                    {service.category === 'guidance' && '📖'}
                    {service.category === 'accommodation' && '🏨'}
                    {service.category === 'food' && '🍲'}
                    {service.category === 'miscellaneous' && '✨'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">₹{service.price}</span>
                  <span className="text-xs text-muted-foreground">{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temple Marketplace */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Sacred Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templeMarketplace.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-all">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 h-32 flex items-center justify-center text-3xl">
                  {item.category === 'flowers' && '🌸'}
                  {item.category === 'incense' && '🌫️'}
                  {item.category === 'offerings' && '🎁'}
                  {item.category === 'religious-items' && '🕉️'}
                  {item.category === 'books' && '📚'}
                  {item.category === 'crafts' && '🎨'}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.vendor}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    <span className="text-sm">⭐ {item.rating} ({item.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10+</div>
              <p className="text-sm text-muted-foreground mt-2">Sacred Temples</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">26</div>
              <p className="text-sm text-muted-foreground mt-2">Service Types</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10+</div>
              <p className="text-sm text-muted-foreground mt-2">Marketplace Items</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100M+</div>
              <p className="text-sm text-muted-foreground mt-2">Annual Visitors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
