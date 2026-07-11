export interface TourismDestination {
  id: string
  name: string
  category: 'backwater' | 'mountain' | 'beach' | 'heritage' | 'wildlife' | 'adventure' | 'cultural' | 'rural' | 'spiritual'
  location: string
  state: string
  description: string
  rating: number
  reviews: number
  bestTime: string
  altitude?: string
  distance?: string
  accommodations: number
  activities: string[]
  price: 'budget' | 'moderate' | 'premium'
  image: string
}

export interface Homestay {
  id: string
  name: string
  location: string
  capacity: number
  pricePerNight: number
  rating: number
  reviews: number
  amenities: string[]
  meals: 'breakfast' | 'halfboard' | 'fullboard'
  owner: string
  phone: string
  image: string
}

export interface FarmStay {
  id: string
  name: string
  location: string
  farmSize: string
  crops: string[]
  activities: string[]
  pricePerNight: number
  rating: number
  reviews: number
  capacity: number
  meals: 'breakfast' | 'halfboard' | 'fullboard'
  image: string
}

export const tourismDestinations: TourismDestination[] = [
  {
    id: 'kerala-backwaters',
    name: 'Kerala Backwaters',
    category: 'backwater',
    location: 'Kottayam',
    state: 'Kerala',
    description: 'Serene lagoons and canals with houseboats',
    rating: 4.9,
    reviews: 2341,
    bestTime: 'Oct-Mar',
    distance: '220 km from Cochin',
    accommodations: 150,
    activities: ['Houseboat', 'Kayaking', 'Bird watching', 'Fishing'],
    price: 'moderate',
    image: 'kerala-backwaters'
  },
  {
    id: 'himalayas-trek',
    name: 'Himalayas Trek',
    category: 'mountain',
    location: 'Manali',
    state: 'Himachal Pradesh',
    description: 'Majestic mountain ranges with breathtaking views',
    rating: 4.8,
    reviews: 1893,
    bestTime: 'May-Oct',
    altitude: '3000-4500m',
    accommodations: 200,
    activities: ['Trekking', 'Mountaineering', 'Photography', 'Camping'],
    price: 'budget',
    image: 'himalayan-trek'
  },
  {
    id: 'goa-beaches',
    name: 'Goa Beaches',
    category: 'beach',
    location: 'Panaji',
    state: 'Goa',
    description: 'Golden beaches with Portuguese charm',
    rating: 4.7,
    reviews: 3456,
    bestTime: 'Nov-Feb',
    distance: '60 km from Panaji',
    accommodations: 300,
    activities: ['Beach', 'Surfing', 'Water sports', 'Heritage tours'],
    price: 'moderate',
    image: 'goa-beaches'
  },
  {
    id: 'rajasthan-heritage',
    name: 'Rajasthan Heritage',
    category: 'heritage',
    location: 'Jaipur',
    state: 'Rajasthan',
    description: 'Palaces, forts, and colorful deserts',
    rating: 4.8,
    reviews: 2765,
    bestTime: 'Oct-Mar',
    distance: 'Central Rajasthan',
    accommodations: 250,
    activities: ['Fort tours', 'Camel safari', 'Market', 'Photography'],
    price: 'moderate',
    image: 'rajasthan-heritage'
  },
  {
    id: 'tiger-sanctuary',
    name: 'Tiger Sanctuary',
    category: 'wildlife',
    location: 'Bandhavgarh',
    state: 'Madhya Pradesh',
    description: 'Prime tiger habitat and wildlife reserve',
    rating: 4.9,
    reviews: 987,
    bestTime: 'Nov-Jun',
    distance: '250 km from Jabalpur',
    accommodations: 80,
    activities: ['Safari', 'Photography', 'Nature walks', 'Bird watching'],
    price: 'premium',
    image: 'tiger-sanctuary'
  },
  {
    id: 'ladakh-adventure',
    name: 'Ladakh Adventure',
    category: 'adventure',
    location: 'Leh',
    state: 'Ladakh',
    description: 'High-altitude desert adventure',
    rating: 4.8,
    reviews: 1654,
    bestTime: 'Jul-Sep',
    altitude: '3500m+',
    accommodations: 120,
    activities: ['Biking', 'Trekking', 'River rafting', 'Cultural tours'],
    price: 'premium',
    image: 'ladakh-adventure'
  },
  {
    id: 'village-tourism',
    name: 'Traditional Village',
    category: 'rural',
    location: 'Various',
    state: 'Across India',
    description: 'Authentic rural life experience',
    rating: 4.6,
    reviews: 543,
    bestTime: 'All year',
    accommodations: 500,
    activities: ['Farming', 'Cooking', 'Craft', 'Local tours'],
    price: 'budget',
    image: 'village-tourism'
  },
  {
    id: 'varanasi-spiritual',
    name: 'Varanasi Spiritual',
    category: 'spiritual',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'Spiritual awakening at the holy Ganges',
    rating: 4.7,
    reviews: 2134,
    bestTime: 'Oct-Mar',
    distance: 'City center',
    accommodations: 180,
    activities: ['Ghat ceremony', 'Yoga', 'Meditation', 'Temple tours'],
    price: 'budget',
    image: 'varanasi-spiritual'
  },
  {
    id: 'darjeeling-tea',
    name: 'Darjeeling Tea Gardens',
    category: 'cultural',
    location: 'Darjeeling',
    state: 'West Bengal',
    description: 'Tea gardens and Himalayan views',
    rating: 4.8,
    reviews: 1456,
    bestTime: 'Mar-May',
    altitude: '2100m',
    accommodations: 100,
    activities: ['Tea tasting', 'Garden tour', 'Toy train', 'Trekking'],
    price: 'moderate',
    image: 'darjeeling-tea'
  },
  {
    id: 'munnar-hills',
    name: 'Munnar Hill Station',
    category: 'mountain',
    location: 'Munnar',
    state: 'Kerala',
    description: 'Verdant tea and spice hills',
    rating: 4.7,
    reviews: 1789,
    bestTime: 'Sep-Mar',
    altitude: '1600m',
    accommodations: 140,
    activities: ['Tea plantation', 'Trekking', 'Photography', 'Nature walks'],
    price: 'moderate',
    image: 'munnar-hills'
  }
]

export const homestays: Homestay[] = [
  {
    id: 'kottayam-1',
    name: 'Backwater Homestay',
    location: 'Kottayam, Kerala',
    capacity: 4,
    pricePerNight: 2500,
    rating: 4.8,
    reviews: 234,
    amenities: ['Kitchen', 'Garden', 'Terrace', 'WiFi'],
    meals: 'halfboard',
    owner: 'Rajesh Kumar',
    phone: '+91-9847123456',
    image: 'homestay-backwater'
  },
  {
    id: 'himachal-1',
    name: 'Mountain View Homestay',
    location: 'Manali, Himachal',
    capacity: 6,
    pricePerNight: 2000,
    rating: 4.7,
    reviews: 156,
    amenities: ['Fireplace', 'Kitchen', 'Parking', 'Bonfire'],
    meals: 'fullboard',
    owner: 'Priya Singh',
    phone: '+91-9965234567',
    image: 'homestay-mountain'
  },
  {
    id: 'goa-1',
    name: 'Beach Shack Homestay',
    location: 'Goa',
    capacity: 3,
    pricePerNight: 1500,
    rating: 4.6,
    reviews: 198,
    amenities: ['Beach access', 'Kitchen', 'Hammock', 'Bar'],
    meals: 'breakfast',
    owner: 'Maria Silva',
    phone: '+91-9876543210',
    image: 'homestay-beach'
  },
  {
    id: 'rajasthan-1',
    name: 'Desert Homestead',
    location: 'Jaisalmer, Rajasthan',
    capacity: 4,
    pricePerNight: 1800,
    rating: 4.8,
    reviews: 212,
    amenities: ['Rooftop', 'Kitchen', 'Camel rides', 'Traditional'],
    meals: 'halfboard',
    owner: 'Vikram Desai',
    phone: '+91-9123456789',
    image: 'homestay-desert'
  },
  {
    id: 'kerala-2',
    name: 'Village Homestay',
    location: 'Trivandrum, Kerala',
    capacity: 5,
    pricePerNight: 2200,
    rating: 4.7,
    reviews: 145,
    amenities: ['Garden', 'Kitchen', 'Library', 'Yoga space'],
    meals: 'halfboard',
    owner: 'Anjali Nair',
    phone: '+91-9847567891',
    image: 'homestay-village'
  }
]

export const farmstays: FarmStay[] = [
  {
    id: 'punjab-farm-1',
    name: 'Wheat Farm Experience',
    location: 'Punjabi Village, Punjab',
    farmSize: '50 acres',
    crops: ['Wheat', 'Rice', 'Vegetables'],
    activities: ['Harvesting', 'Cooking', 'Tractor ride', 'Market visit'],
    pricePerNight: 1500,
    rating: 4.9,
    reviews: 289,
    capacity: 6,
    meals: 'fullboard',
    image: 'farmstay-punjab'
  },
  {
    id: 'karnataka-farm-1',
    name: 'Coffee Plantation Stay',
    location: 'Coorg, Karnataka',
    farmSize: '25 acres',
    crops: ['Coffee', 'Spices', 'Tea'],
    activities: ['Coffee picking', 'Processing', 'Trekking', 'Bird watching'],
    pricePerNight: 2500,
    rating: 4.8,
    reviews: 167,
    capacity: 4,
    meals: 'fullboard',
    image: 'farmstay-coffee'
  },
  {
    id: 'tamil-farm-1',
    name: 'Tea Garden Stay',
    location: 'Coonoor, Tamil Nadu',
    farmSize: '40 acres',
    crops: ['Tea', 'Vegetables', 'Spices'],
    activities: ['Tea picking', 'Garden walk', 'Cooking class', 'Photography'],
    pricePerNight: 2000,
    rating: 4.7,
    reviews: 134,
    capacity: 5,
    meals: 'fullboard',
    image: 'farmstay-tea'
  },
  {
    id: 'maharashtra-farm-1',
    name: 'Organic Vegetable Farm',
    location: 'Lonavala, Maharashtra',
    farmSize: '15 acres',
    crops: ['Vegetables', 'Fruits', 'Herbs'],
    activities: ['Harvesting', 'Composting', 'Yoga', 'Farm-to-table cooking'],
    pricePerNight: 1800,
    rating: 4.8,
    reviews: 201,
    capacity: 4,
    meals: 'fullboard',
    image: 'farmstay-organic'
  },
  {
    id: 'himachal-farm-1',
    name: 'Pomegranate Orchard Stay',
    location: 'Himachal Pradesh',
    farmSize: '20 acres',
    crops: ['Pomegranate', 'Apple', 'Vegetables'],
    activities: ['Fruit picking', 'Jam making', 'Trekking', 'Bonfire'],
    pricePerNight: 2200,
    rating: 4.9,
    reviews: 176,
    capacity: 5,
    meals: 'fullboard',
    image: 'farmstay-orchard'
  }
]
