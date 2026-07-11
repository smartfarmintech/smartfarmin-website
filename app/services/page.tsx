import { Metadata } from 'next'
import { nearbyServices } from '@/lib/ecosystems/services-and-marketplace'

export const metadata: Metadata = {
  title: 'Nearby Services | Rythu360',
  description: 'Find 20+ nearby essential services in your village',
}

export default function ServicesPage() {
  const categories = [...new Set(nearbyServices.map(s => s.category))]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Nearby Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and connect with 20+ verified local services in your area
          </p>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {categories.map((category) => {
            const categoryServices = nearbyServices.filter(s => s.category === category)
            return (
              <div key={category} className="mb-16">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <span>{categoryServices[0]?.icon}</span>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{service.type}</p>
                          </div>
                          <span className="text-3xl">{service.icon}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{service.location}</p>

                        <div className="space-y-2 mb-4 text-sm">
                          <p className="flex items-center gap-2">
                            <span>⭐</span>
                            {service.rating}/5 ({service.reviews} reviews)
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📍</span>
                            {service.distance} km away
                          </p>
                          <p className="flex items-center gap-2">
                            <span>⏰</span>
                            {service.hours}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border/50 mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Services:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {service.services.slice(0, 3).map((svc, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-primary/10 text-xs text-primary">
                                {svc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <a href={`tel:${service.phone}`} className="flex-1 mr-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm text-center hover:bg-primary/90 transition-colors">
                            Call
                          </a>
                          {service.verified && (
                            <span className="px-3 py-2 rounded-lg bg-green-500/10 text-green-700 text-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">20+</div>
              <p className="text-sm text-muted-foreground mt-2">Service Types</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <p className="text-sm text-muted-foreground mt-2">Verified</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <p className="text-sm text-muted-foreground mt-2">Emergency Support</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.6+</div>
              <p className="text-sm text-muted-foreground mt-2">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
