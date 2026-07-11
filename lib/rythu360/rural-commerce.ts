export type RuralCommerceCategory = 
  | "Fresh Fruits"
  | "Fresh Vegetables"
  | "Grains & Cereals"
  | "Nursery & Plants"
  | "Livestock"
  | "Dairy"
  | "Organic Products"
  | "Farm Equipment"
  | "Agriculture Inputs"

export type NearbyBusinessType =
  | "Dhaba"
  | "Restaurant"
  | "Tea Shop"
  | "Coffee Shop"
  | "Milk Collection"
  | "Rice Mill"
  | "Kirana Store"
  | "Veterinary Clinic"
  | "Hospital"
  | "Medical Shop"
  | "Bank"
  | "Petrol Pump"
  | "EV Charging"
  | "Tractor Garage"
  | "Machinery Repair"
  | "Welding Shop"
  | "Spare Parts"
  | "Nursery"
  | "Dairy Collection"
  | "Poultry Farm"
  | "Goat Farm"
  | "Fish Market"
  | "Fruit Market"
  | "Vegetable Market"
  | "Grain Market"

export type RuralProduct = {
  id: string
  name: string
  category: RuralCommerceCategory
  price: number
  mrp?: number
  unit: string
  seller: string
  rating: number
  reviews: number
  image: string
  inStock: boolean
  location?: string
  distance?: string
  delivery?: string
  verified?: boolean
  organic?: boolean
  freshToday?: boolean
}

export type NearbyBusiness = {
  id: string
  name: string
  type: NearbyBusinessType
  rating: number
  distance: string
  location: string
  openNow: boolean
  image: string
  phone?: string
  whatsapp?: boolean
  directions?: boolean
  tags?: string[]
}

// Fresh Fruits
const FRESH_FRUITS: RuralProduct[] = [
  { id: "ff-1", name: "Fresh Lemons", category: "Fresh Fruits", price: 60, unit: "kg", seller: "Farmer Rajesh", rating: 4.8, reviews: 520, image: "fresh lemons", inStock: true, freshToday: true, verified: true },
  { id: "ff-2", name: "Mangoes (Alphonso)", category: "Fresh Fruits", price: 180, unit: "kg", seller: "Mango Orchard", rating: 4.7, reviews: 340, image: "alphonso mangoes", inStock: true, verified: true },
  { id: "ff-3", name: "Bananas (Dwarf Cavendish)", category: "Fresh Fruits", price: 40, unit: "kg", seller: "Banana Grower", rating: 4.6, reviews: 210, image: "cavendish bananas", inStock: true, freshToday: true },
  { id: "ff-4", name: "Fresh Guava", category: "Fresh Fruits", price: 50, unit: "kg", seller: "Local Farm", rating: 4.5, reviews: 180, image: "fresh guavas", inStock: true },
  { id: "ff-5", name: "Papaya", category: "Fresh Fruits", price: 35, unit: "kg", seller: "Papaya Farm", rating: 4.4, reviews: 120, image: "fresh papayas", inStock: true, freshToday: true },
  { id: "ff-6", name: "Sweet Lime", category: "Fresh Fruits", price: 70, unit: "kg", seller: "Citrus Orchard", rating: 4.7, reviews: 290, image: "sweet lime citrus", inStock: true, verified: true },
  { id: "ff-7", name: "Watermelon", category: "Fresh Fruits", price: 25, unit: "kg", seller: "Seasonal Farm", rating: 4.6, reviews: 410, image: "fresh watermelon", inStock: true },
  { id: "ff-8", name: "Fresh Grapes", category: "Fresh Fruits", price: 120, unit: "kg", seller: "Vineyard", rating: 4.8, reviews: 650, image: "fresh grapes", inStock: true, verified: true },
  { id: "ff-9", name: "Oranges", category: "Fresh Fruits", price: 55, unit: "kg", seller: "Citrus Farmer", rating: 4.5, reviews: 240, image: "fresh oranges", inStock: true },
  { id: "ff-10", name: "Fresh Coconut", category: "Fresh Fruits", price: 20, unit: "piece", seller: "Coconut Farm", rating: 4.7, reviews: 520, image: "fresh coconut", inStock: true, freshToday: true },
]

// Fresh Vegetables
const FRESH_VEGETABLES: RuralProduct[] = [
  { id: "fv-1", name: "Fresh Tomatoes", category: "Fresh Vegetables", price: 30, unit: "kg", seller: "Tomato Farm", rating: 4.8, reviews: 890, image: "fresh tomatoes", inStock: true, freshToday: true, verified: true },
  { id: "fv-2", name: "Red Onions", category: "Fresh Vegetables", price: 25, unit: "kg", seller: "Onion Farmer", rating: 4.6, reviews: 670, image: "red onions", inStock: true, verified: true },
  { id: "fv-3", name: "Potatoes", category: "Fresh Vegetables", price: 20, unit: "kg", seller: "Local Farm", rating: 4.7, reviews: 540, image: "fresh potatoes", inStock: true },
  { id: "fv-4", name: "Green Chillies", category: "Fresh Vegetables", price: 80, unit: "kg", seller: "Chilli Farmer", rating: 4.9, reviews: 420, image: "green chillies", inStock: true, freshToday: true, verified: true },
  { id: "fv-5", name: "Brinjal (Eggplant)", category: "Fresh Vegetables", price: 35, unit: "kg", seller: "Vegetable Farm", rating: 4.5, reviews: 180, image: "fresh brinjal", inStock: true },
  { id: "fv-6", name: "Ladies Finger (Okra)", category: "Fresh Vegetables", price: 45, unit: "kg", seller: "Organic Farm", rating: 4.7, reviews: 310, image: "ladies finger", inStock: true, organic: true },
  { id: "fv-7", name: "Fresh Drumstick", category: "Fresh Vegetables", price: 60, unit: "kg", seller: "Traditional Farm", rating: 4.6, reviews: 240, image: "fresh drumstick", inStock: true },
  { id: "fv-8", name: "Cabbage", category: "Fresh Vegetables", price: 28, unit: "kg", seller: "Vegetable Farmer", rating: 4.6, reviews: 290, image: "fresh cabbage", inStock: true, freshToday: true },
  { id: "fv-9", name: "Cauliflower", category: "Fresh Vegetables", price: 40, unit: "kg", seller: "Local Farm", rating: 4.7, reviews: 380, image: "fresh cauliflower", inStock: true },
  { id: "fv-10", name: "Fresh Carrots", category: "Fresh Vegetables", price: 32, unit: "kg", seller: "Carrot Farmer", rating: 4.6, reviews: 220, image: "fresh carrots", inStock: true },
  { id: "fv-11", name: "Leafy Vegetables", category: "Fresh Vegetables", price: 25, unit: "bundle", seller: "Greens Farm", rating: 4.8, reviews: 510, image: "fresh leafy greens", inStock: true, organic: true },
  { id: "fv-12", name: "Fresh Cucumbers", category: "Fresh Vegetables", price: 35, unit: "kg", seller: "Farm Fresh", rating: 4.5, reviews: 160, image: "fresh cucumbers", inStock: true },
  { id: "fv-13", name: "Pumpkin", category: "Fresh Vegetables", price: 22, unit: "kg", seller: "Local Farmer", rating: 4.6, reviews: 140, image: "fresh pumpkin", inStock: true },
]

// Grains & Cereals
const GRAINS_CEREALS: RuralProduct[] = [
  { id: "gc-1", name: "Paddy (Raw Rice)", category: "Grains & Cereals", price: 1800, unit: "quintal", seller: "Paddy Farmer", rating: 4.9, reviews: 1200, image: "paddy raw rice", inStock: true, verified: true },
  { id: "gc-2", name: "Basmati Rice", category: "Grains & Cereals", price: 65, unit: "kg", seller: "Rice Mill", rating: 4.8, reviews: 890, image: "basmati rice", inStock: true, verified: true },
  { id: "gc-3", name: "Brown Rice", category: "Grains & Cereals", price: 45, unit: "kg", seller: "Health Rice", rating: 4.6, reviews: 420, image: "brown rice", inStock: true },
  { id: "gc-4", name: "Wheat", category: "Grains & Cereals", price: 2200, unit: "quintal", seller: "Wheat Farmer", rating: 4.7, reviews: 680, image: "fresh wheat", inStock: true },
  { id: "gc-5", name: "Maize", category: "Grains & Cereals", price: 1900, unit: "quintal", seller: "Maize Farm", rating: 4.5, reviews: 340, image: "maize grain", inStock: true },
  { id: "gc-6", name: "Millets", category: "Grains & Cereals", price: 55, unit: "kg", seller: "Millet Farmer", rating: 4.8, reviews: 520, image: "millets grain", inStock: true, organic: true },
  { id: "gc-7", name: "Jowar (Sorghum)", category: "Grains & Cereals", price: 2400, unit: "quintal", seller: "Jowar Farm", rating: 4.6, reviews: 280, image: "jowar sorghum", inStock: true },
  { id: "gc-8", name: "Ragi (Finger Millet)", category: "Grains & Cereals", price: 3200, unit: "quintal", seller: "Ragi Farmer", rating: 4.7, reviews: 410, image: "ragi finger millet", inStock: true },
  { id: "gc-9", name: "Bajra", category: "Grains & Cereals", price: 3000, unit: "quintal", seller: "Bajra Farm", rating: 4.5, reviews: 190, image: "bajra grain", inStock: true },
]

// Nursery & Plants
const NURSERY_PLANTS: RuralProduct[] = [
  { id: "np-1", name: "Rose Plant", category: "Nursery & Plants", price: 120, unit: "plant", seller: "Flower Nursery", rating: 4.8, reviews: 620, image: "rose plant", inStock: true },
  { id: "np-2", name: "Jasmine Plant", category: "Nursery & Plants", price: 100, unit: "plant", seller: "Jasmine Nursery", rating: 4.7, reviews: 480, image: "jasmine plant", inStock: true },
  { id: "np-3", name: "Lemon Plant", category: "Nursery & Plants", price: 150, unit: "plant", seller: "Fruit Nursery", rating: 4.9, reviews: 740, image: "lemon fruit plant", inStock: true, verified: true },
  { id: "np-4", name: "Mango Plant", category: "Nursery & Plants", price: 200, unit: "plant", seller: "Mango Nursery", rating: 4.8, reviews: 520, image: "mango fruit plant", inStock: true },
  { id: "np-5", name: "Tomato Seedling", category: "Nursery & Plants", price: 5, unit: "seedling", seller: "Vegetable Nursery", rating: 4.7, reviews: 890, image: "tomato seedling", inStock: true, freshToday: true },
  { id: "np-6", name: "Chilli Seedling", category: "Nursery & Plants", price: 8, unit: "seedling", seller: "Spice Nursery", rating: 4.8, reviews: 650, image: "chilli seedling", inStock: true },
  { id: "np-7", name: "Neem Tree", category: "Nursery & Plants", price: 180, unit: "plant", seller: "Timber Nursery", rating: 4.6, reviews: 320, image: "neem tree plant", inStock: true },
  { id: "np-8", name: "Indoor Spider Plant", category: "Nursery & Plants", price: 80, unit: "plant", seller: "Indoor Nursery", rating: 4.9, reviews: 410, image: "spider plant indoor", inStock: true },
]

// Livestock
const LIVESTOCK: RuralProduct[] = [
  { id: "ls-1", name: "Chicken (per bird)", category: "Livestock", price: 250, unit: "bird", seller: "Poultry Farm", rating: 4.8, reviews: 1200, image: "fresh chicken", inStock: true, freshToday: true, verified: true },
  { id: "ls-2", name: "Country Chicken", category: "Livestock", price: 350, unit: "bird", seller: "Local Farm", rating: 4.9, reviews: 890, image: "country chicken", inStock: true, verified: true },
  { id: "ls-3", name: "Fresh Eggs", category: "Livestock", price: 60, unit: "dozen", seller: "Farm Fresh Eggs", rating: 4.8, reviews: 2100, image: "fresh eggs", inStock: true, freshToday: true },
  { id: "ls-4", name: "Goat Meat", category: "Livestock", price: 450, unit: "kg", seller: "Local Goat Farm", rating: 4.7, reviews: 520, image: "goat meat", inStock: true },
  { id: "ls-5", name: "Fish (Tilapia)", category: "Livestock", price: 180, unit: "kg", seller: "Fish Farm", rating: 4.6, reviews: 340, image: "tilapia fish", inStock: true, freshToday: true },
  { id: "ls-6", name: "Fresh Prawns", category: "Livestock", price: 580, unit: "kg", seller: "Shrimp Farm", rating: 4.8, reviews: 620, image: "fresh prawns", inStock: true, verified: true },
]

// Dairy
const DAIRY: RuralProduct[] = [
  { id: "dy-1", name: "Fresh Milk", category: "Dairy", price: 55, unit: "liter", seller: "Dairy Farm", rating: 4.9, reviews: 3200, image: "fresh milk", inStock: true, freshToday: true, verified: true },
  { id: "dy-2", name: "Fresh Curd", category: "Dairy", price: 60, unit: "kg", seller: "Traditional Dairy", rating: 4.8, reviews: 1840, image: "fresh curd", inStock: true, freshToday: true },
  { id: "dy-3", name: "Paneer", category: "Dairy", price: 320, unit: "kg", seller: "Cottage Cheese", rating: 4.9, reviews: 2140, image: "fresh paneer", inStock: true, verified: true },
  { id: "dy-4", name: "Ghee (Clarified Butter)", category: "Dairy", price: 580, unit: "kg", seller: "Dairy Ghee", rating: 4.8, reviews: 1520, image: "ghee butter", inStock: true },
  { id: "dy-5", name: "Butter", category: "Dairy", price: 280, unit: "kg", seller: "Fresh Butter", rating: 4.7, reviews: 840, image: "fresh butter", inStock: true },
]

// Organic Products
const ORGANIC_PRODUCTS: RuralProduct[] = [
  { id: "og-1", name: "Organic Honey", category: "Organic Products", price: 350, unit: "kg", seller: "Bee Farm", rating: 4.9, reviews: 1680, image: "organic honey", inStock: true, organic: true, verified: true },
  { id: "og-2", name: "Organic Turmeric", category: "Organic Products", price: 180, unit: "kg", seller: "Organic Spice", rating: 4.8, reviews: 920, image: "organic turmeric", inStock: true, organic: true },
  { id: "og-3", name: "Cold Pressed Oil", category: "Organic Products", price: 280, unit: "liter", seller: "Oil Press", rating: 4.7, reviews: 640, image: "cold pressed oil", inStock: true, organic: true },
  { id: "og-4", name: "Organic Millets", category: "Organic Products", price: 65, unit: "kg", seller: "Organic Farm", rating: 4.8, reviews: 510, image: "organic millets", inStock: true, organic: true },
  { id: "og-5", name: "Organic Fertilizer", category: "Organic Products", price: 400, unit: "25kg bag", seller: "Compost Farm", rating: 4.6, reviews: 340, image: "organic fertilizer", inStock: true, organic: true },
]

// Farm Equipment
const FARM_EQUIPMENT: RuralProduct[] = [
  { id: "fe-1", name: "Mini Tractor", category: "Farm Equipment", price: 450000, unit: "unit", seller: "Equipment Dealer", rating: 4.8, reviews: 420, image: "mini tractor", inStock: true, verified: true },
  { id: "fe-2", name: "Rotavator", category: "Farm Equipment", price: 45000, unit: "unit", seller: "Farm Equipment", rating: 4.6, reviews: 280, image: "rotavator", inStock: true },
  { id: "fe-3", name: "Cultivator", category: "Farm Equipment", price: 28000, unit: "unit", seller: "Equipment Shop", rating: 4.5, reviews: 190, image: "cultivator", inStock: true },
  { id: "fe-4", name: "Drone Sprayer", category: "Farm Equipment", price: 120000, unit: "unit", seller: "Tech Farm", rating: 4.9, reviews: 680, image: "drone sprayer", inStock: true, verified: true },
  { id: "fe-5", name: "Water Pump", category: "Farm Equipment", price: 18000, unit: "unit", seller: "Pump Dealer", rating: 4.7, reviews: 520, image: "water pump", inStock: true },
]

// Nearby Businesses
const NEARBY_BUSINESSES: NearbyBusiness[] = [
  { id: "nb-1", name: "Ram's Dhaba", type: "Dhaba", rating: 4.7, distance: "0.8 km", location: "Main Road", openNow: true, image: "dhaba restaurant", phone: "9876543210", whatsapp: true },
  { id: "nb-2", name: "Family Restaurant", type: "Restaurant", rating: 4.8, distance: "1.2 km", location: "Market Road", openNow: true, image: "restaurant", directions: true },
  { id: "nb-3", name: "Morning Tea Shop", type: "Tea Shop", rating: 4.6, distance: "0.3 km", location: "Village Center", openNow: true, image: "tea shop", phone: "9876543211" },
  { id: "nb-4", name: "Milk Collection Center", type: "Milk Collection", rating: 4.9, distance: "1.5 km", location: "Dairy Area", openNow: true, image: "milk collection", phone: "9876543212", whatsapp: true },
  { id: "nb-5", name: "Local Rice Mill", type: "Rice Mill", rating: 4.5, distance: "2.1 km", location: "Industrial Area", openNow: false, image: "rice mill", phone: "9876543213" },
  { id: "nb-6", name: "Kirana Store", type: "Kirana Store", rating: 4.4, distance: "0.5 km", location: "Market", openNow: true, image: "kirana store", phone: "9876543214" },
  { id: "nb-7", name: "Veterinary Clinic", type: "Veterinary Clinic", rating: 4.8, distance: "1.8 km", location: "Medical Area", openNow: true, image: "vet clinic", phone: "9876543215", directions: true },
  { id: "nb-8", name: "Government Hospital", type: "Hospital", rating: 4.6, distance: "3.2 km", location: "Town Center", openNow: true, image: "hospital", phone: "9876543216", directions: true },
  { id: "nb-9", name: "Medical Shop", type: "Medical Shop", rating: 4.7, distance: "0.7 km", location: "Main Street", openNow: true, image: "medical shop", phone: "9876543217", whatsapp: true },
  { id: "nb-10", name: "SBI Bank", type: "Bank", rating: 4.5, distance: "2.5 km", location: "Town", openNow: true, image: "bank", phone: "9876543218", directions: true },
]

export const RURAL_PRODUCTS: RuralProduct[] = [
  ...FRESH_FRUITS,
  ...FRESH_VEGETABLES,
  ...GRAINS_CEREALS,
  ...NURSERY_PLANTS,
  ...LIVESTOCK,
  ...DAIRY,
  ...ORGANIC_PRODUCTS,
  ...FARM_EQUIPMENT,
]

export const NEARBY_BUSINESS_LIST: NearbyBusiness[] = NEARBY_BUSINESSES

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

export function discountPct(price: number, mrp?: number) {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}
