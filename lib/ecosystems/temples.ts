export interface Temple {
  id: string
  name: string
  deity: string
  location: string
  district: string
  state: string
  yearEstablished: number
  significance: string
  rating: number
  visitorsPerYear: string
  timings: { open: string; close: string }
  contactPhone: string
  website?: string
  festivalsPerYear: number
  services: string[]
  architecture: string
  distanceFromMain: string
  image: string
}

export interface TempleService {
  id: string
  name: string
  category: 'pooja' | 'offering' | 'guidance' | 'accommodation' | 'food' | 'miscellaneous'
  price: number
  description: string
  duration: string
  availability: string
}

export interface TempleMarketplaceItem {
  id: string
  name: string
  category: 'flowers' | 'incense' | 'offerings' | 'religious-items' | 'books' | 'crafts'
  price: number
  vendor: string
  rating: number
  reviews: number
  image: string
  inStock: boolean
}

export const temples: Temple[] = [
  {
    id: 'tirupati',
    name: 'Sri Venkateswara Temple',
    deity: 'Lord Venkateswara',
    location: 'Tirupati',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    yearEstablished: 800,
    significance: 'One of the richest temples in India',
    rating: 4.8,
    visitorsPerYear: '25+ million',
    timings: { open: '05:00', close: '22:00' },
    contactPhone: '+91-877-2256000',
    website: 'tirupatibalaji.org',
    festivalsPerYear: 12,
    services: ['Darshan', 'Special Pujas', 'Annadanam', 'Abhishekam', 'Archana'],
    architecture: 'Dravidian',
    distanceFromMain: 'Tirupati Junction',
    image: 'temple-tirupati'
  },
  {
    id: 'varanasi',
    name: 'Kashi Vishwanath Temple',
    deity: 'Lord Shiva',
    location: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    yearEstablished: 1780,
    significance: 'One of the 12 Jyotirlingas',
    rating: 4.7,
    visitorsPerYear: '3+ million',
    timings: { open: '03:00', close: '23:00' },
    contactPhone: '+91-542-2200697',
    festivalsPerYear: 8,
    services: ['Darshan', 'Abhishekam', 'Rudrabhishekam', 'Ghat Pujas', 'Annadanam'],
    architecture: 'North Indian',
    distanceFromMain: 'Varanasi City',
    image: 'temple-varanasi'
  },
  {
    id: 'madurai',
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi',
    location: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    yearEstablished: 1200,
    significance: 'Ancient Dravidian architecture',
    rating: 4.9,
    visitorsPerYear: '10+ million',
    timings: { open: '05:00', close: '22:00' },
    contactPhone: '+91-452-4345700',
    festivalsPerYear: 15,
    services: ['Darshan', 'Abishekam', 'Archana', 'Poojas', 'Temple Tours'],
    architecture: 'Dravidian',
    distanceFromMain: 'Madurai City',
    image: 'temple-madurai'
  },
  {
    id: 'ujjain',
    name: 'Mahakaleshwar Temple',
    deity: 'Lord Shiva',
    location: 'Ujjain',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    yearEstablished: 500,
    significance: 'One of the 12 Jyotirlingas',
    rating: 4.7,
    visitorsPerYear: '2+ million',
    timings: { open: '04:00', close: '23:00' },
    contactPhone: '+91-734-2512545',
    festivalsPerYear: 10,
    services: ['Darshan', 'Aarti', 'Rudrabhishekam', 'Yatra Guidance', 'Prasadam'],
    architecture: 'Medieval',
    distanceFromMain: 'Ujjain City',
    image: 'temple-ujjain'
  },
  {
    id: 'rameswaram',
    name: 'Rameswaram Temple',
    deity: 'Lord Rama',
    location: 'Rameswaram',
    district: 'Ramanathapuram',
    state: 'Tamil Nadu',
    yearEstablished: 1200,
    significance: 'One of the 12 Jyotirlingas',
    rating: 4.8,
    visitorsPerYear: '1+ million',
    timings: { open: '03:30', close: '22:00' },
    contactPhone: '+91-4573-221060',
    festivalsPerYear: 8,
    services: ['Darshan', 'Well Bath Ritual', 'Abhishekam', 'Temple Stay', 'Prasadam'],
    architecture: 'Dravidian',
    distanceFromMain: 'Rameswaram Town',
    image: 'temple-rameswaram'
  },
  {
    id: 'haridwar',
    name: 'Har Ki Pauri Temple',
    deity: 'Lord Shiva',
    location: 'Haridwar',
    district: 'Haridwar',
    state: 'Uttarakhand',
    yearEstablished: 1000,
    significance: 'Gateway to pilgrimage',
    rating: 4.6,
    visitorsPerYear: '15+ million',
    timings: { open: '05:00', close: '22:00' },
    contactPhone: '+91-1334-226755',
    festivalsPerYear: 6,
    services: ['Ghat Aarti', 'Ritual Bath', 'Puja Services', 'Accommodation', 'Food'],
    architecture: 'North Indian',
    distanceFromMain: 'Haridwar Railway Station',
    image: 'temple-haridwar'
  },
  {
    id: 'srisailam',
    name: 'Sri Bhramarambha Temple',
    deity: 'Goddess Bhramarambha',
    location: 'Srisailam',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    yearEstablished: 800,
    significance: 'Ancient pilgrimage site',
    rating: 4.7,
    visitorsPerYear: '2+ million',
    timings: { open: '04:00', close: '21:00' },
    contactPhone: '+91-8568-256000',
    festivalsPerYear: 12,
    services: ['Darshan', 'Abishekam', 'Yatra', 'Prasadam', 'Temple Hotel'],
    architecture: 'Dravidian',
    distanceFromMain: 'Srisailam Town',
    image: 'temple-srisailam'
  },
  {
    id: 'amritsar',
    name: 'Golden Temple',
    deity: 'Sikh Holy Place',
    location: 'Amritsar',
    district: 'Amritsar',
    state: 'Punjab',
    yearEstablished: 1604,
    significance: 'Holiest Gurdwara',
    rating: 4.9,
    visitorsPerYear: '20+ million',
    timings: { open: '03:30', close: '23:30' },
    contactPhone: '+91-183-2558802',
    festivalsPerYear: 6,
    services: ['Darshan', 'Langar', 'Lodging', 'Spiritual Guidance', 'Seva'],
    architecture: 'Sikh',
    distanceFromMain: 'Amritsar City',
    image: 'temple-amritsar'
  },
  {
    id: 'dwarka',
    name: 'Dwarkadhish Temple',
    deity: 'Lord Krishna',
    location: 'Dwarka',
    district: 'Dwarka',
    state: 'Gujarat',
    yearEstablished: 1147,
    significance: 'One of the 4 Dhams',
    rating: 4.8,
    visitorsPerYear: '1+ million',
    timings: { open: '06:00', close: '21:30' },
    contactPhone: '+91-2892-234400',
    festivalsPerYear: 10,
    services: ['Darshan', 'Aarti', 'Bhakti Programs', 'Prasadam', 'Accommodation'],
    architecture: 'Hindu',
    distanceFromMain: 'Dwarka Port',
    image: 'temple-dwarka'
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath Temple',
    deity: 'Lord Shiva',
    location: 'Kedarnath',
    district: 'Rudraprayag',
    state: 'Uttarakhand',
    yearEstablished: 800,
    significance: 'One of the 12 Jyotirlingas',
    rating: 4.9,
    visitorsPerYear: '500000',
    timings: { open: '06:00', close: '20:00' },
    contactPhone: '+91-1364-225087',
    festivalsPerYear: 4,
    services: ['Darshan', 'Rudrabhishekam', 'Mountain Trek', 'Yatra Support', 'Prasadam'],
    architecture: 'Stone',
    distanceFromMain: 'Kedarnath Village',
    image: 'temple-kedarnath'
  }
]

export const templeServices: TempleService[] = [
  { id: '1', name: 'Darshan', category: 'pooja', price: 0, description: 'Free temple viewing', duration: '30-60 min', availability: 'Daily' },
  { id: '2', name: 'Special Darshan', category: 'pooja', price: 500, description: 'Priority viewing', duration: '15 min', availability: 'Daily' },
  { id: '3', name: 'Abhishekam', category: 'pooja', price: 1000, description: 'Ritual bathing ceremony', duration: '45 min', availability: 'Daily' },
  { id: '4', name: 'Rudrabhishekam', category: 'pooja', price: 2000, description: 'Shiva worship ceremony', duration: '60 min', availability: 'Daily' },
  { id: '5', name: 'Archana', category: 'pooja', price: 301, description: 'Personal worship ritual', duration: '20 min', availability: 'Daily' },
  { id: '6', name: 'Annadanam', category: 'food', price: 100, description: 'Temple meal offering', duration: 'Lunch time', availability: 'Daily' },
  { id: '7', name: 'Flower Offering', category: 'offering', price: 200, description: 'Fresh flower garland', duration: '10 min', availability: 'Daily' },
  { id: '8', name: 'Incense Package', category: 'offering', price: 150, description: 'Incense sticks bundle', duration: 'N/A', availability: 'Daily' },
  { id: '9', name: 'Coconut Offering', category: 'offering', price: 100, description: 'Blessed coconut', duration: '10 min', availability: 'Daily' },
  { id: '10', name: 'Bell Ringing', category: 'miscellaneous', price: 50, description: 'Ring temple bell', duration: '5 min', availability: 'Daily' },
  { id: '11', name: 'Temple Tour', category: 'guidance', price: 500, description: 'Guided temple tour', duration: '60 min', availability: 'Scheduled' },
  { id: '12', name: 'Spiritual Counseling', category: 'guidance', price: 1000, description: 'One-on-one guidance', duration: '30 min', availability: 'By appointment' },
  { id: '13', name: 'Temple Stay', category: 'accommodation', price: 500, description: 'Overnight accommodation', duration: 'Per night', availability: 'Available' },
  { id: '14', name: 'Yoga Session', category: 'miscellaneous', price: 200, description: 'Morning yoga class', duration: '60 min', availability: 'Daily' },
  { id: '15', name: 'Meditation Session', category: 'miscellaneous', price: 150, description: 'Guided meditation', duration: '45 min', availability: 'Daily' },
  { id: '16', name: 'Pujan Ritual', category: 'pooja', price: 2500, description: 'Complete family puja', duration: '90 min', availability: 'Daily' },
  { id: '17', name: 'Birthday Puja', category: 'pooja', price: 3000, description: 'Birthday blessing ceremony', duration: '60 min', availability: 'By appointment' },
  { id: '18', name: 'Marriage Blessing', category: 'pooja', price: 5000, description: 'Wedding blessing ceremony', duration: '45 min', availability: 'By appointment' },
  { id: '19', name: 'Prasadam Pack', category: 'food', price: 250, description: 'Blessed food offering', duration: 'N/A', availability: 'Daily' },
  { id: '20', name: 'Photo Darshan', category: 'miscellaneous', price: 100, description: 'Professional deity photos', duration: 'N/A', availability: 'Daily' },
  { id: '21', name: 'Astrology Consultation', category: 'guidance', price: 500, description: 'Temple astrologer reading', duration: '30 min', availability: 'Scheduled' },
  { id: '22', name: 'Mantra Chanting', category: 'pooja', price: 1500, description: 'Vedic mantra recitation', duration: '45 min', availability: 'Daily' },
  { id: '23', name: 'Kalash Abhishekam', category: 'pooja', price: 3000, description: 'Sacred water ceremony', duration: '60 min', availability: 'Daily' },
  { id: '24', name: 'Havan Ceremony', category: 'pooja', price: 4000, description: 'Sacred fire ritual', duration: '90 min', availability: 'Scheduled' },
  { id: '25', name: 'Sacred Bath', category: 'miscellaneous', price: 200, description: 'Ritual bath in holy waters', duration: '30 min', availability: 'Daily' },
  { id: '26', name: 'Relic Blessing', category: 'offering', price: 500, description: 'Get items blessed', duration: '15 min', availability: 'Daily' },
]

export const templeMarketplace: TempleMarketplaceItem[] = [
  { id: '1', name: 'Fresh Flower Garland', category: 'flowers', price: 100, vendor: 'Temple Flowers Co', rating: 4.8, reviews: 234, image: 'flower-garland', inStock: true },
  { id: '2', name: 'Premium Incense Sticks', category: 'incense', price: 150, vendor: 'Sacred Incense', rating: 4.7, reviews: 189, image: 'incense-sticks', inStock: true },
  { id: '3', name: 'Religious Books', category: 'books', price: 500, vendor: 'Holy Scriptures', rating: 4.9, reviews: 456, image: 'religious-books', inStock: true },
  { id: '4', name: 'Blessed Oil', category: 'religious-items', price: 200, vendor: 'Temple Oil House', rating: 4.6, reviews: 123, image: 'blessed-oil', inStock: true },
  { id: '5', name: 'Deity Idols', category: 'religious-items', price: 1000, vendor: 'Sacred Crafts', rating: 4.8, reviews: 298, image: 'deity-idol', inStock: true },
  { id: '6', name: 'Camphor Blocks', category: 'incense', price: 80, vendor: 'Pure Camphor', rating: 4.7, reviews: 167, image: 'camphor', inStock: true },
  { id: '7', name: 'Silk Shawl', category: 'crafts', price: 2000, vendor: 'Textile Arts', rating: 4.9, reviews: 321, image: 'silk-shawl', inStock: true },
  { id: '8', name: 'Holy Water', category: 'offerings', price: 100, vendor: 'Temple Water', rating: 4.8, reviews: 512, image: 'holy-water', inStock: true },
  { id: '9', name: 'Bell Metal', category: 'religious-items', price: 500, vendor: 'Bell Metals', rating: 4.7, reviews: 245, image: 'bell-metal', inStock: true },
  { id: '10', name: 'Prayer Beads', category: 'religious-items', price: 300, vendor: 'Sacred Beads', rating: 4.8, reviews: 389, image: 'prayer-beads', inStock: true },
]
