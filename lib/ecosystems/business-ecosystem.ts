export interface MarketPrice {
  id: string
  product: string
  currentPrice: number
  previousPrice: number
  trend: 'up' | 'down' | 'stable'
  percentChange: number
  unit: string
  location: string
  updatedAt: string
  forecast?: {
    nextWeek: number
    nextMonth: number
    confidence: number
  }
}

export interface Business {
  id: string
  name: string
  type: string
  category: string
  location: string
  district: string
  state: string
  foundedYear: number
  employees: number
  rating: number
  reviews: number
  phone: string
  email: string
  website?: string
  verified: boolean
  specialization: string[]
  image: string
}

export const marketPrices: MarketPrice[] = [
  { id: '1', product: 'Wheat', currentPrice: 2200, previousPrice: 2150, trend: 'up', percentChange: 2.3, unit: 'quintal', location: 'Punjab', updatedAt: '2024-01-15', forecast: { nextWeek: 2250, nextMonth: 2300, confidence: 85 } },
  { id: '2', product: 'Rice', currentPrice: 4500, previousPrice: 4400, trend: 'up', percentChange: 2.3, unit: 'quintal', location: 'Andhra Pradesh', updatedAt: '2024-01-15', forecast: { nextWeek: 4550, nextMonth: 4600, confidence: 82 } },
  { id: '3', product: 'Tomato', currentPrice: 30, previousPrice: 35, trend: 'down', percentChange: -14.3, unit: 'kg', location: 'Maharashtra', updatedAt: '2024-01-15', forecast: { nextWeek: 28, nextMonth: 32, confidence: 78 } },
  { id: '4', product: 'Onion', currentPrice: 20, previousPrice: 22, trend: 'down', percentChange: -9.1, unit: 'kg', location: 'Karnataka', updatedAt: '2024-01-15', forecast: { nextWeek: 21, nextMonth: 23, confidence: 80 } },
  { id: '5', product: 'Potato', currentPrice: 18, previousPrice: 16, trend: 'up', percentChange: 12.5, unit: 'kg', location: 'Himachal', updatedAt: '2024-01-15', forecast: { nextWeek: 19, nextMonth: 17, confidence: 75 } },
  { id: '6', product: 'Milk', currentPrice: 60, previousPrice: 58, trend: 'up', percentChange: 3.4, unit: 'liter', location: 'Gujarat', updatedAt: '2024-01-15', forecast: { nextWeek: 62, nextMonth: 65, confidence: 88 } },
  { id: '7', product: 'Cotton', currentPrice: 5800, previousPrice: 5600, trend: 'up', percentChange: 3.6, unit: 'quintal', location: 'Telangana', updatedAt: '2024-01-15', forecast: { nextWeek: 5900, nextMonth: 6000, confidence: 83 } },
  { id: '8', product: 'Sugarcane', currentPrice: 320, previousPrice: 310, trend: 'up', percentChange: 3.2, unit: 'quintal', location: 'Uttar Pradesh', updatedAt: '2024-01-15', forecast: { nextWeek: 330, nextMonth: 340, confidence: 79 } },
  { id: '9', product: 'Coffee', currentPrice: 18000, previousPrice: 17500, trend: 'up', percentChange: 2.9, unit: 'quintal', location: 'Karnataka', updatedAt: '2024-01-15', forecast: { nextWeek: 18200, nextMonth: 18500, confidence: 81 } },
  { id: '10', product: 'Tea', currentPrice: 15000, previousPrice: 14800, trend: 'up', percentChange: 1.4, unit: 'quintal', location: 'Tamil Nadu', updatedAt: '2024-01-15', forecast: { nextWeek: 15100, nextMonth: 15300, confidence: 77 } },
]

export const businesses: Business[] = [
  {
    id: 'trader-1',
    name: 'Sharma Grain Traders',
    type: 'Wholesale Trader',
    category: 'Traders',
    location: 'Market Square',
    district: 'Indore',
    state: 'Madhya Pradesh',
    foundedYear: 1995,
    employees: 25,
    rating: 4.8,
    reviews: 234,
    phone: '+91-9876543210',
    email: 'sharma@graintraders.com',
    website: 'www.sharma-traders.com',
    verified: true,
    specialization: ['Wheat', 'Rice', 'Corn', 'Pulses'],
    image: 'trader-1'
  },
  {
    id: 'processor-1',
    name: 'Premium Food Processing',
    type: 'Food Processor',
    category: 'Processors',
    location: 'Industrial Area',
    district: 'Nashik',
    state: 'Maharashtra',
    foundedYear: 2005,
    employees: 50,
    rating: 4.7,
    reviews: 189,
    phone: '+91-9765432109',
    email: 'info@premfood.com',
    website: 'www.premiumfoodproc.com',
    verified: true,
    specialization: ['Canning', 'Drying', 'Packaging', 'Export'],
    image: 'processor-1'
  },
  {
    id: 'exporter-1',
    name: 'Global Agro Exports',
    type: 'Exporter',
    category: 'Exporters',
    location: 'Port Area',
    district: 'Kochi',
    state: 'Kerala',
    foundedYear: 2008,
    employees: 45,
    rating: 4.9,
    reviews: 267,
    phone: '+91-9654321098',
    email: 'trade@globalagro.com',
    website: 'www.globalagroexp.com',
    verified: true,
    specialization: ['Spices', 'Coffee', 'Tea', 'Organic produce'],
    image: 'exporter-1'
  },
  {
    id: 'coop-1',
    name: 'Farmers Cooperative Society',
    type: 'Cooperative',
    category: 'Cooperatives',
    location: 'Village Center',
    district: 'Pune',
    state: 'Maharashtra',
    foundedYear: 1980,
    employees: 100,
    rating: 4.6,
    reviews: 312,
    phone: '+91-9543210987',
    email: 'coop@farmers.org',
    website: 'www.farmerscoop.org',
    verified: true,
    specialization: ['Procurement', 'Storage', 'Distribution', 'Credit'],
    image: 'coop-1'
  },
  {
    id: 'input-1',
    name: 'Quality Farm Inputs Ltd',
    type: 'Input Supplier',
    category: 'Input Suppliers',
    location: 'Agricultural Hub',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    foundedYear: 2000,
    employees: 35,
    rating: 4.8,
    reviews: 201,
    phone: '+91-9432109876',
    email: 'sales@qualityinputs.com',
    website: 'www.qualityfarminputs.com',
    verified: true,
    specialization: ['Seeds', 'Fertilizers', 'Pesticides', 'Soil amendments'],
    image: 'input-1'
  },
  {
    id: 'equipment-1',
    name: 'Modern Farm Equipment Co',
    type: 'Equipment Dealer',
    category: 'Equipment Dealers',
    location: 'Industrial Zone',
    district: 'Surat',
    state: 'Gujarat',
    foundedYear: 1998,
    employees: 40,
    rating: 4.7,
    reviews: 156,
    phone: '+91-9321098765',
    email: 'sales@modernfarm.com',
    website: 'www.modernfarmequip.com',
    verified: true,
    specialization: ['Tractors', 'Harvesters', 'Irrigation', 'Repairs'],
    image: 'equipment-1'
  },
  {
    id: 'transport-1',
    name: 'Agro Logistics Express',
    type: 'Transport Company',
    category: 'Transport',
    location: 'Highway Area',
    district: 'Bangalore',
    state: 'Karnataka',
    foundedYear: 2010,
    employees: 60,
    rating: 4.5,
    reviews: 189,
    phone: '+91-9210987654',
    email: 'logistics@agroexp.com',
    website: 'www.agrologistics.com',
    verified: true,
    specialization: ['Cold chain', 'Long distance', 'Container', 'International'],
    image: 'transport-1'
  },
  {
    id: 'retail-1',
    name: 'Village Retail Store',
    type: 'Retail',
    category: 'Retailers',
    location: 'Main Market',
    district: 'Jaipur',
    state: 'Rajasthan',
    foundedYear: 1990,
    employees: 15,
    rating: 4.6,
    reviews: 234,
    phone: '+91-8998765432',
    email: 'shop@villageretail.com',
    website: 'www.villageretailstore.com',
    verified: true,
    specialization: ['Vegetables', 'Fruits', 'Dairy', 'Staples'],
    image: 'retail-1'
  },
  {
    id: 'organic-1',
    name: 'Organic Farming Collective',
    type: 'Organic Producer',
    category: 'Organic Producers',
    location: 'Rural Area',
    district: 'Kozhikode',
    state: 'Kerala',
    foundedYear: 2012,
    employees: 20,
    rating: 4.9,
    reviews: 289,
    phone: '+91-8887654321',
    email: 'organic@collective.com',
    website: 'www.organicfarmers.com',
    verified: true,
    specialization: ['Organic crops', 'Certification', 'Marketing', 'Distribution'],
    image: 'organic-1'
  },
  {
    id: 'finance-1',
    name: 'Agricultural Finance Bureau',
    type: 'Finance',
    category: 'Finance',
    location: 'Business District',
    district: 'Delhi',
    state: 'Delhi',
    foundedYear: 1995,
    employees: 55,
    rating: 4.7,
    reviews: 201,
    phone: '+91-8776543210',
    email: 'finance@agribureau.com',
    website: 'www.agrifinance.com',
    verified: true,
    specialization: ['Farm loans', 'Crop insurance', 'Advisory', 'Subsidies'],
    image: 'finance-1'
  },
]
