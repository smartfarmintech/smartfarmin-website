import { Metadata } from 'next'
import { tourismDestinations, homestays, farmstays } from '@/lib/ecosystems/tourism'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Rural Tourism | AgreeConnect',
  description: 'Explore 100+ authentic tourism destinations including farm stays, homestays, and cultural experiences',
}

export default function TourismPage() {
  const categories = [
    { name: 'Backwaters', icon: '🚣', cat: 'backwater' },
    { name: 'Mountains', icon: '⛰️', cat: 'mountain' },
    { name: 'Beaches', icon: '🏖️', cat: 'beach' },
    { name: 'Heritage', icon: '🏛️', cat: 'heritage' },
    { name: 'Wildlife', icon: '🐅', cat: 'wildlife' },
    { name: 'Adventure', icon: '🎒', cat: 'adventure' },
    { name: 'Cultural', icon: '🎭', cat: 'cultural' },
    { name: 'Rural', icon: '🌾', cat: 'rural' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Rural Tourism Experiences
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover 100+ authentic destinations, farm stays, homestays, and cultural experiences across rural India
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.cat}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Destinations (100+)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourismDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl">
                  {dest.category === 'backwater' && '🚣'}
                  {dest.category === 'mountain' && '⛰️'}
                  {dest.category === 'beach' && '🏖️'}
                  {dest.category === 'heritage' && '🏛️'}
                  {dest.category === 'wildlife' && '🐅'}
                  {dest.category === 'adventure' && '🎒'}
                  {dest.category === 'cultural' && '🎭'}
                  {dest.category === 'rural' && '🌾'}
                  {dest.category === 'spiritual' && '🕉️'}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{dest.location}, {dest.state}</p>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dest.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      {dest.rating}/5 ({dest.reviews} reviews)
                    </p>
                    <p className="text-muted-foreground">Best: {dest.bestTime}</p>
                    {dest.altitude && <p className="text-muted-foreground">Altitude: {dest.altitude}</p>}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                    {dest.activities.slice(0, 2).map((act, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Homestays */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Homestays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homestays.map((stay) => (
              <div key={stay.id} className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{stay.name}</h3>
                  <p className="text-sm text-muted-foreground">{stay.location}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{stay.capacity} guests</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price/Night:</span>
                    <span className="font-bold text-lg text-primary">₹{stay.pricePerNight}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>⭐ {stay.rating} ({stay.reviews})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stay.amenities.map((am, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-secondary text-xs">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farm Stays */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12">Farm Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmstays.map((farm) => (
              <div key={farm.id} className="rounded-xl border border-border/50 bg-card p-6 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{farm.name}</h3>
                  <p className="text-sm text-muted-foreground">{farm.location}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Farm Size: </span>
                    <span className="font-medium">{farm.farmSize}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Crops: </span>
                    <span className="font-medium">{farm.crops.join(', ')}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">₹{farm.pricePerNight}/night</span>
                    <span className="text-sm font-medium">⭐ {farm.rating}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Activities:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.activities.map((act, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-primary/10 text-xs text-primary font-medium">
                        {act}
                      </span>
                    ))}
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
              <div className="text-3xl font-bold text-primary">100+</div>
              <p className="text-sm text-muted-foreground mt-2">Destinations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">9</div>
              <p className="text-sm text-muted-foreground mt-2">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <p className="text-sm text-muted-foreground mt-2">Homestays</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <p className="text-sm text-muted-foreground mt-2">Farm Stays</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
