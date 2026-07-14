'use client'

import Image from 'next/image'
import { Star, MapPin, Calendar, Users, CheckCircle } from 'lucide-react'

interface MachineryContentProps {
  activeTab: 'drone' | 'tractor' | 'jcb' | 'solar'
}

const machineryData = {
  drone: [
    {
      id: 1,
      name: 'Spray Drone Pro',
      provider: 'AgriTech Solutions',
      rating: 4.8,
      reviews: 156,
      price: '₹800/hour',
      location: '5 km away',
      image: '/images/drone-improved.png',
      specs: 'Capacity: 10L, Range: 2km',
      availability: 'Available Today',
      services: ['Crop Spraying', 'Surveying', 'Monitoring']
    },
    {
      id: 2,
      name: 'DJI Agras T10',
      provider: 'Modern Farming Inc',
      rating: 4.7,
      reviews: 98,
      price: '₹750/hour',
      location: '8 km away',
      image: '/images/drone-improved.png',
      specs: 'Capacity: 10L, Flight Time: 14 min',
      availability: 'Available Tomorrow',
      services: ['Spraying', 'Crop Health Monitoring']
    },
    {
      id: 3,
      name: 'Mapping Drone',
      provider: 'Precision Farming',
      rating: 4.9,
      reviews: 203,
      price: '₹600/hour',
      location: '3 km away',
      image: '/images/drone-improved.png',
      specs: '4K Camera, GPS Mapping',
      availability: 'Available Now',
      services: ['Land Mapping', 'Crop Counting']
    },
  ],
  tractor: [
    {
      id: 1,
      name: 'John Deere 5050D',
      provider: 'Farm Equipment Rentals',
      rating: 4.9,
      reviews: 287,
      price: '₹2500/day',
      location: '2 km away',
      image: '/images/tractor-improved.png',
      specs: '50 HP, 4WD, Well Maintained',
      availability: 'Available Now',
      services: ['Ploughing', 'Tilling', 'Sowing']
    },
    {
      id: 2,
      name: 'Mahindra 475 DI',
      provider: 'Village Equipment Hub',
      rating: 4.6,
      reviews: 142,
      price: '₹1800/day',
      location: '6 km away',
      image: '/images/tractor-improved.png',
      specs: '47 HP, 2WD, Recently Serviced',
      availability: 'Available Tomorrow',
      services: ['Ploughing', 'Baling', 'Transport']
    },
    {
      id: 3,
      name: 'Swaraj 855 Super',
      provider: 'Community Farm Services',
      rating: 4.7,
      reviews: 165,
      price: '₹2000/day',
      location: '4 km away',
      image: '/images/tractor-improved.png',
      specs: '55 HP, Power Steering, AC Cabin',
      availability: 'Available Today',
      services: ['All Agricultural Operations']
    },
  ],
  jcb: [
    {
      id: 1,
      name: 'JCB 3DX Plus',
      provider: 'Construction & Farm Services',
      rating: 4.8,
      reviews: 124,
      price: '₹3500/day',
      location: '7 km away',
      image: '/images/jcb.png',
      specs: 'Backhoe Loader, Latest Model',
      availability: 'Available Now',
      services: ['Excavation', 'Land Leveling', 'Trenching']
    },
    {
      id: 2,
      name: 'JCB 3CX Eco',
      provider: 'Heavy Equipment Rentals',
      rating: 4.7,
      reviews: 98,
      price: '₹3200/day',
      location: '5 km away',
      image: '/images/jcb.png',
      specs: 'Fuel Efficient, Powerful Boom',
      availability: 'Available Today',
      services: ['Digging', 'Loading', 'Landscaping']
    },
    {
      id: 3,
      name: 'JCB Fastrac 3200',
      provider: 'Agricultural Machinery',
      rating: 4.9,
      reviews: 176,
      price: '₹4000/day',
      location: '3 km away',
      image: '/images/jcb.png',
      specs: 'Modern, AC Cabin, Fast',
      availability: 'Available Tomorrow',
      services: ['Heavy Duty Work', 'Road Building']
    },
  ],
  solar: [
    {
      id: 1,
      name: 'Solar Panel System 5kW',
      provider: 'SunPower Energy',
      rating: 4.9,
      reviews: 234,
      price: '₹3,50,000 (Install)',
      location: 'Service Area',
      image: '/images/solar.png',
      specs: '330W panels, 25-year warranty',
      availability: 'Installation in 5 days',
      services: ['Installation', 'Maintenance', 'Support']
    },
    {
      id: 2,
      name: 'Solar Water Pump 1HP',
      provider: 'AgriSolar Tech',
      rating: 4.8,
      reviews: 156,
      price: '₹1,20,000',
      location: 'Delivery Available',
      image: '/images/solar.png',
      specs: '1000 LPH, Weather Resistant',
      availability: 'Stock Available',
      services: ['Pump Supply', 'Installation', 'Training']
    },
    {
      id: 3,
      name: 'Solar Battery Setup 10kWh',
      provider: 'Energy Solutions',
      rating: 4.7,
      reviews: 89,
      price: '₹5,00,000',
      location: 'Service Area',
      image: '/images/solar.png',
      specs: 'Lithium Battery, Smart Controller',
      availability: 'Pre-order Available',
      services: ['Supply', 'Installation', '5-year warranty']
    },
  ],
}

export function MachineryContent({ activeTab }: MachineryContentProps) {
  const services = machineryData[activeTab]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div key={service.id} className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image/Icon */}
          <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border-b border-border relative overflow-hidden">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Header */}
            <h3 className="text-lg font-bold text-foreground mb-1">{service.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{service.provider}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(service.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{service.rating}</span>
              <span className="text-xs text-muted-foreground">({service.reviews})</span>
            </div>

            {/* Details Grid */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{service.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{service.availability}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{service.specs}</span>
              </div>
            </div>

            {/* Services Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {service.services.slice(0, 2).map((svc, idx) => (
                <span key={idx} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                  {svc}
                </span>
              ))}
            </div>

            {/* Price and Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-xl font-bold text-primary">{service.price}</p>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition text-sm">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
