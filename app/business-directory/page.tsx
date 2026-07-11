import { Metadata } from 'next'
import { businesses } from '@/lib/ecosystems/business-ecosystem'

export const metadata: Metadata = {
  title: 'Business Directory | Rythu360',
  description: 'Connect with 100+ verified agricultural businesses and traders',
}

export default function BusinessDirectoryPage() {
  const categories = [...new Set(businesses.map(b => b.category))]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">Business Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            100+ verified agricultural businesses, from traders to exporters
          </p>
        </div>
        
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-4">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Register Business</button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted">All Businesses</button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Traders</button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Processors</button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Exporters</button>
        </div>
      </section>

      {/* Businesses by Category */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {categories.map((category) => {
            const catBusinesses = businesses.filter(b => b.category === category)
            return (
              <div key={category} className="mb-16">
                <h2 className="text-2xl font-bold mb-8">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all group"
                    >
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20" />
                      
                      <div className="p-6 -mt-12 relative">
                        <div className="mb-4">
                          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {biz.type}
                          </div>
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {biz.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{biz.location}</p>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          <p className="flex items-center gap-2">
                            <span>⭐</span>
                            {biz.rating}/5 ({biz.reviews} reviews)
                          </p>
                          <p className="flex items-center gap-2">
                            <span>👥</span>
                            {biz.employees} employees
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📍</span>
                            {biz.district}, {biz.state}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border/50 mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Specialization:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {biz.specialization.slice(0, 3).map((spec, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-secondary text-xs">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <a href={`tel:${biz.phone}`} className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm text-center hover:bg-primary/90 transition-colors">
                            Call
                          </a>
                          <a href={`mailto:${biz.email}`} className="flex-1 px-3 py-2 rounded-lg border border-border hover:bg-muted font-medium text-sm text-center transition-colors">
                            Email
                          </a>
                        </div>

                        {biz.verified && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <span className="text-xs font-medium text-green-700 bg-green-500/10 px-2.5 py-1 rounded-full">
                              Verified Business
                            </span>
                          </div>
                        )}
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
              <div className="text-3xl font-bold text-primary">100+</div>
              <p className="text-sm text-muted-foreground mt-2">Businesses</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15+</div>
              <p className="text-sm text-muted-foreground mt-2">Categories</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <p className="text-sm text-muted-foreground mt-2">Verified</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.7+</div>
              <p className="text-sm text-muted-foreground mt-2">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
