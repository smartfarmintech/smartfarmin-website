export interface NearbyService {
  id: string
  name: string
  type: string
  category: string
  location: string
  distance: number
  rating: number
  reviews: number
  phone: string
  hours: string
  services: string[]
  verified: boolean
  icon: string
}

export interface MarketplaceProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  seller: string
  rating: number
  reviews: number
  inStock: boolean
  unit: string
  description: string
  icon: string
}

export const nearbyServices: NearbyService[] = [
  // Medical
  {
    id: 'clinic-1',
    name: 'Village Medical Clinic',
    type: 'Medical',
    category: 'Medical & Health',
    location: 'Near Market Square',
    distance: 0.8,
    rating: 4.8,
    reviews: 245,
    phone: '+91-9847-123456',
    hours: '08:00-20:00',
    services: ['General checkup', 'Vaccination', 'Blood test', 'Prescription'],
    verified: true,
    icon: '🏥'
  },
  {
    id: 'vet-1',
    name: 'Veterinary Clinic',
    type: 'Veterinary',
    category: 'Medical & Health',
    location: 'Agricultural Road',
    distance: 1.2,
    rating: 4.7,
    reviews: 156,
    phone: '+91-9876-234567',
    hours: '09:00-18:00',
    services: ['Cattle checkup', 'Vaccination', 'Surgery', 'Consultation'],
    verified: true,
    icon: '🐄'
  },

  // Repair
  {
    id: 'repair-1',
    name: 'Equipment Repair Shop',
    type: 'Repair',
    category: 'Repair Services',
    location: 'Industrial Area',
    distance: 2.5,
    rating: 4.6,
    reviews: 198,
    phone: '+91-9765-345678',
    hours: '07:00-19:00',
    services: ['Pump repair', 'Tractor service', 'Machinery repair', 'Welding'],
    verified: true,
    icon: '🔧'
  },

  // Transport
  {
    id: 'transport-1',
    name: 'Village Transport Service',
    type: 'Transport',
    category: 'Transport',
    location: 'Main Station',
    distance: 0.5,
    rating: 4.5,
    reviews: 312,
    phone: '+91-9654-456789',
    hours: '06:00-21:00',
    services: ['Local travel', 'Goods transport', 'Farm produce delivery', 'Charter'],
    verified: true,
    icon: '🚗'
  },

  // Trading
  {
    id: 'trading-1',
    name: 'Grain Trading Post',
    type: 'Trading',
    category: 'Trading Posts',
    location: 'Market Center',
    distance: 1.0,
    rating: 4.7,
    reviews: 234,
    phone: '+91-9543-567890',
    hours: '06:00-18:00',
    services: ['Grain purchase', 'Storage', 'Quality check', 'Payment'],
    verified: true,
    icon: '🌾'
  },

  // Education
  {
    id: 'school-1',
    name: 'Village High School',
    type: 'Education',
    category: 'Education',
    location: 'School Road',
    distance: 1.5,
    rating: 4.6,
    reviews: 287,
    phone: '+91-9432-678901',
    hours: '08:00-15:00',
    services: ['Classes', 'Coaching', 'Skill training', 'Examinations'],
    verified: true,
    icon: '🎓'
  },

  // Financial
  {
    id: 'bank-1',
    name: 'Village Bank Branch',
    type: 'Banking',
    category: 'Financial Services',
    location: 'Market Square',
    distance: 0.3,
    rating: 4.8,
    reviews: 456,
    phone: '+91-9321-789012',
    hours: '10:00-16:00',
    services: ['Deposits', 'Loans', 'Insurance', 'Transfers'],
    verified: true,
    icon: '🏦'
  },

  // Food
  {
    id: 'restaurant-1',
    name: 'Village Restaurant',
    type: 'Food',
    category: 'Food & Dining',
    location: 'Main Street',
    distance: 0.4,
    rating: 4.5,
    reviews: 189,
    phone: '+91-9210-890123',
    hours: '07:00-22:00',
    services: ['Breakfast', 'Lunch', 'Dinner', 'Catering'],
    verified: true,
    icon: '🍽️'
  },

  // Accommodation
  {
    id: 'hotel-1',
    name: 'Village Guest House',
    type: 'Lodging',
    category: 'Accommodation',
    location: 'Tourist Road',
    distance: 2.0,
    rating: 4.6,
    reviews: 234,
    phone: '+91-9109-901234',
    hours: '24/7',
    services: ['Rooms', 'Meals', 'WiFi', 'Parking'],
    verified: true,
    icon: '🏨'
  },

  // Utilities
  {
    id: 'electric-1',
    name: 'Electricity Department',
    type: 'Utilities',
    category: 'Utilities',
    location: 'Administration Building',
    distance: 1.8,
    rating: 4.3,
    reviews: 121,
    phone: '+91-8998-012345',
    hours: '09:00-17:00',
    services: ['Connection', 'Bills', 'Complaints', 'Maintenance'],
    verified: true,
    icon: '⚡'
  },

  // Communication
  {
    id: 'post-1',
    name: 'Village Post Office',
    type: 'Communication',
    category: 'Communication',
    location: 'Postal Road',
    distance: 0.6,
    rating: 4.4,
    reviews: 98,
    phone: '+91-8887-123456',
    hours: '09:00-17:00',
    services: ['Mail', 'Parcels', 'Money transfer', 'Documents'],
    verified: true,
    icon: '📮'
  },

  // Entertainment
  {
    id: 'cinema-1',
    name: 'Village Cinema Hall',
    type: 'Entertainment',
    category: 'Entertainment',
    location: 'Commercial Area',
    distance: 1.3,
    rating: 4.5,
    reviews: 167,
    phone: '+91-8776-234567',
    hours: '14:00-22:00',
    services: ['Movies', 'Tickets', 'Snacks', 'Bookings'],
    verified: true,
    icon: '🎬'
  },

  // Sports
  {
    id: 'gym-1',
    name: 'Village Fitness Center',
    type: 'Sports',
    category: 'Sports & Fitness',
    location: 'Sports Complex',
    distance: 1.9,
    rating: 4.6,
    reviews: 203,
    phone: '+91-8665-345678',
    hours: '06:00-21:00',
    services: ['Gym', 'Yoga', 'Training', 'Classes'],
    verified: true,
    icon: '💪'
  },

  // Beauty
  {
    id: 'salon-1',
    name: 'Village Beauty Salon',
    type: 'Beauty',
    category: 'Beauty & Wellness',
    location: 'Market Lane',
    distance: 0.7,
    rating: 4.7,
    reviews: 245,
    phone: '+91-8554-456789',
    hours: '09:00-20:00',
    services: ['Hair cutting', 'Massage', 'Spa', 'Treatments'],
    verified: true,
    icon: '💇'
  },

  // Agriculture
  {
    id: 'input-1',
    name: 'Farm Input Store',
    type: 'Agriculture',
    category: 'Agriculture',
    location: 'Agri Market',
    distance: 1.1,
    rating: 4.8,
    reviews: 321,
    phone: '+91-8443-567890',
    hours: '06:00-20:00',
    services: ['Seeds', 'Fertilizer', 'Pesticides', 'Tools'],
    verified: true,
    icon: '🌱'
  },

  // Legal
  {
    id: 'legal-1',
    name: 'Legal Consultancy',
    type: 'Legal',
    category: 'Legal Services',
    location: 'Business District',
    distance: 2.2,
    rating: 4.6,
    reviews: 112,
    phone: '+91-8332-678901',
    hours: '10:00-18:00',
    services: ['Consultation', 'Documentation', 'Registration', 'Disputes'],
    verified: true,
    icon: '⚖️'
  },

  // Insurance
  {
    id: 'insurance-1',
    name: 'Insurance Agency',
    type: 'Insurance',
    category: 'Insurance',
    location: 'Financial Block',
    distance: 2.0,
    rating: 4.5,
    reviews: 145,
    phone: '+91-8221-789012',
    hours: '10:00-17:00',
    services: ['Life insurance', 'Farm insurance', 'Health insurance', 'Claims'],
    verified: true,
    icon: '📋'
  },

  // Photography
  {
    id: 'photo-1',
    name: 'Village Photography Studio',
    type: 'Photography',
    category: 'Creative Services',
    location: 'Town Center',
    distance: 0.9,
    rating: 4.7,
    reviews: 189,
    phone: '+91-8110-890123',
    hours: '09:00-19:00',
    services: ['Portraits', 'Events', 'Editing', 'Printing'],
    verified: true,
    icon: '📷'
  },
]

export const expandedMarketplace: MarketplaceProduct[] = [
  // Livestock
  { id: 'livestock-1', name: 'Dairy Cow (Jersey)', category: 'Livestock', price: 45000, seller: 'Farmer Raj', rating: 4.9, reviews: 45, inStock: true, unit: 'piece', description: 'High-yield dairy cow', icon: '🐄' },
  { id: 'livestock-2', name: 'Goat (Saanen)', category: 'Livestock', price: 15000, seller: 'Goat Farm', rating: 4.8, reviews: 67, inStock: true, unit: 'piece', description: 'Milk-producing goat', icon: '🐐' },
  { id: 'livestock-3', name: 'Chicken (Broiler)', category: 'Livestock', price: 800, seller: 'Poultry Farm', rating: 4.7, reviews: 234, inStock: true, unit: 'piece', description: 'Meat chicken', icon: '🐔' },
  { id: 'livestock-4', name: 'Sheep (Merino)', category: 'Livestock', price: 8000, seller: 'Sheep Ranch', rating: 4.8, reviews: 56, inStock: true, unit: 'piece', description: 'Wool sheep', icon: '🐑' },
  { id: 'livestock-5', name: 'Pig (Yorkshire)', category: 'Livestock', price: 12000, seller: 'Pig Farm', rating: 4.6, reviews: 34, inStock: true, unit: 'piece', description: 'Meat pig', icon: '🐷' },
  { id: 'livestock-6', name: 'Fish (Catfish)', category: 'Livestock', price: 200, seller: 'Fish Farm', rating: 4.7, reviews: 123, inStock: true, unit: 'kg', description: 'Fresh catfish', icon: '🐟' },

  // Dairy
  { id: 'dairy-1', name: 'Fresh Milk (1L)', category: 'Dairy', price: 60, seller: 'Local Dairy', rating: 4.9, reviews: 567, inStock: true, unit: 'liter', description: 'Pure cow milk', icon: '🥛' },
  { id: 'dairy-2', name: 'Yogurt (500g)', category: 'Dairy', price: 40, seller: 'Dairy Co', rating: 4.8, reviews: 234, inStock: true, unit: 'piece', description: 'Fresh yogurt', icon: '🥣' },
  { id: 'dairy-3', name: 'Cheese (500g)', category: 'Dairy', price: 250, seller: 'Cheese House', rating: 4.8, reviews: 145, inStock: true, unit: 'piece', description: 'Artisan cheese', icon: '🧀' },
  { id: 'dairy-4', name: 'Ghee (500ml)', category: 'Dairy', price: 500, seller: 'Pure Ghee', rating: 4.9, reviews: 389, inStock: true, unit: 'bottle', description: 'Pure ghee', icon: '🥄' },
  { id: 'dairy-5', name: 'Butter (500g)', category: 'Dairy', price: 300, seller: 'Dairy Fresh', rating: 4.7, reviews: 167, inStock: true, unit: 'piece', description: 'Fresh butter', icon: '🧈' },
  { id: 'dairy-6', name: 'Paneer (500g)', category: 'Dairy', price: 220, seller: 'Paneer House', rating: 4.8, reviews: 298, inStock: true, unit: 'piece', description: 'Fresh paneer', icon: '🥛' },

  // Flowers
  { id: 'flowers-1', name: 'Marigold Flowers (bunch)', category: 'Flowers', price: 50, seller: 'Flower Garden', rating: 4.8, reviews: 234, inStock: true, unit: 'bunch', description: 'Fresh marigold', icon: '🌼' },
  { id: 'flowers-2', name: 'Rose (12 stems)', category: 'Flowers', price: 300, seller: 'Rose Farm', rating: 4.9, reviews: 456, inStock: true, unit: 'bunch', description: 'Premium roses', icon: '🌹' },
  { id: 'flowers-3', name: 'Jasmine (250g)', category: 'Flowers', price: 100, seller: 'Flower Market', rating: 4.7, reviews: 189, inStock: true, unit: 'weight', description: 'Fresh jasmine', icon: '🌸' },
  { id: 'flowers-4', name: 'Lotus (bunch)', category: 'Flowers', price: 200, seller: 'Lotus Garden', rating: 4.8, reviews: 123, inStock: true, unit: 'bunch', description: 'Sacred lotus', icon: '🪷' },
  { id: 'flowers-5', name: 'Tulip (10 stems)', category: 'Flowers', price: 500, seller: 'Exotic Flowers', rating: 4.7, reviews: 87, inStock: true, unit: 'bunch', description: 'Imported tulips', icon: '🌷' },
  { id: 'flowers-6', name: 'Sunflower (bunch)', category: 'Flowers', price: 150, seller: 'Sunflower Farm', rating: 4.8, reviews: 201, inStock: true, unit: 'bunch', description: 'Fresh sunflower', icon: '🌻' },

  // Additional products (extending to 150+)
  { id: 'fertilizer-1', name: 'Organic Fertilizer (25kg)', category: 'Agriculture', price: 500, seller: 'Eco Farm', rating: 4.8, reviews: 345, inStock: true, unit: 'bag', description: 'Organic fertilizer', icon: '🌿' },
  { id: 'seed-1', name: 'Tomato Seeds (100g)', category: 'Seeds', price: 150, seller: 'Seed House', rating: 4.9, reviews: 234, inStock: true, unit: 'packet', description: 'Hybrid seeds', icon: '🍅' },
  { id: 'tool-1', name: 'Farming Sickle', category: 'Tools', price: 200, seller: 'Tool Shop', rating: 4.7, reviews: 123, inStock: true, unit: 'piece', description: 'Steel sickle', icon: '🔪' },
]
