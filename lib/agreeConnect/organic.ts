export type OrganicCategory =
  | "Organic Rice"
  | "Millets"
  | "Honey"
  | "Cold Pressed Oils"
  | "Vegetables"
  | "Fruits"
  | "Dry Fruits"
  | "Jaggery"
  | "Spices"

export type OrganicProduct = {
  id: string
  name: string
  farm: string
  category: OrganicCategory
  price: number
  mrp: number
  unit: string
  rating: number
  reviews: number
  tags: ("Bestseller" | "New" | "Limited" | "Farm Fresh")[]
  certified: boolean
  inStock: boolean
  featured?: boolean
}

export const ORGANIC_CATEGORIES: {
  key: OrganicCategory
  icon: string
  image: string
}[] = [
  { key: "Organic Rice", icon: "Wheat", image: "/organic/rice.png" },
  { key: "Millets", icon: "Wheat", image: "/organic/millets.png" },
  { key: "Honey", icon: "Droplets", image: "/organic/honey.png" },
  { key: "Cold Pressed Oils", icon: "Droplets", image: "/organic/oils.png" },
  { key: "Vegetables", icon: "Leaf", image: "/organic/vegetables.png" },
  { key: "Fruits", icon: "Apple", image: "/organic/fruits.png" },
  { key: "Dry Fruits", icon: "Nut", image: "/organic/dryfruits.png" },
  { key: "Jaggery", icon: "Candy", image: "/organic/jaggery.png" },
  { key: "Spices", icon: "Flame", image: "/organic/spices.png" },
]

export const ORGANIC_PRODUCTS: OrganicProduct[] = [
  // Organic Rice
  {
    id: "or-1",
    name: "Sona Masoori Organic Rice",
    farm: "Rythu Organics, Warangal",
    category: "Organic Rice",
    price: 145,
    mrp: 180,
    unit: "5 kg",
    rating: 4.8,
    reviews: 1240,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "or-2",
    name: "Black Rice (Kavuni)",
    farm: "Kaveri Farms, Nizamabad",
    category: "Organic Rice",
    price: 220,
    mrp: 260,
    unit: "1 kg",
    rating: 4.7,
    reviews: 486,
    tags: ["New"],
    certified: true,
    inStock: true,
  },
  {
    id: "or-3",
    name: "Brown Basmati Rice",
    farm: "Godavari Naturals",
    category: "Organic Rice",
    price: 190,
    mrp: 230,
    unit: "2 kg",
    rating: 4.6,
    reviews: 712,
    tags: [],
    certified: true,
    inStock: true,
  },
  // Millets
  {
    id: "ml-1",
    name: "Foxtail Millet",
    farm: "Deccan Millet Co-op",
    category: "Millets",
    price: 95,
    mrp: 120,
    unit: "1 kg",
    rating: 4.7,
    reviews: 934,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "ml-2",
    name: "Little Millet",
    farm: "Deccan Millet Co-op",
    category: "Millets",
    price: 88,
    mrp: 110,
    unit: "1 kg",
    rating: 4.5,
    reviews: 421,
    tags: [],
    certified: true,
    inStock: true,
  },
  {
    id: "ml-3",
    name: "Pearl Millet (Bajra)",
    farm: "Anantha Farms",
    category: "Millets",
    price: 72,
    mrp: 90,
    unit: "1 kg",
    rating: 4.6,
    reviews: 388,
    tags: ["Farm Fresh"],
    certified: true,
    inStock: true,
  },
  // Honey
  {
    id: "hn-1",
    name: "Raw Forest Honey",
    farm: "Araku Valley Apiary",
    category: "Honey",
    price: 340,
    mrp: 420,
    unit: "500 g",
    rating: 4.9,
    reviews: 2130,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "hn-2",
    name: "Wild Multiflora Honey",
    farm: "Nallamala Bee Farms",
    category: "Honey",
    price: 290,
    mrp: 350,
    unit: "500 g",
    rating: 4.7,
    reviews: 640,
    tags: [],
    certified: true,
    inStock: true,
  },
  // Cold Pressed Oils
  {
    id: "oil-1",
    name: "Cold Pressed Groundnut Oil",
    farm: "Chekku Naturals",
    category: "Cold Pressed Oils",
    price: 280,
    mrp: 340,
    unit: "1 L",
    rating: 4.8,
    reviews: 1580,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "oil-2",
    name: "Cold Pressed Coconut Oil",
    farm: "Konaseema Mills",
    category: "Cold Pressed Oils",
    price: 320,
    mrp: 390,
    unit: "1 L",
    rating: 4.7,
    reviews: 890,
    tags: [],
    certified: true,
    inStock: true,
  },
  {
    id: "oil-3",
    name: "Cold Pressed Sesame Oil",
    farm: "Chekku Naturals",
    category: "Cold Pressed Oils",
    price: 360,
    mrp: 430,
    unit: "1 L",
    rating: 4.6,
    reviews: 520,
    tags: ["Limited"],
    certified: true,
    inStock: false,
  },
  // Vegetables
  {
    id: "vg-1",
    name: "Organic Tomatoes",
    farm: "Green Basket, Sangareddy",
    category: "Vegetables",
    price: 48,
    mrp: 60,
    unit: "1 kg",
    rating: 4.5,
    reviews: 312,
    tags: ["Farm Fresh"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "vg-2",
    name: "Organic Spinach Bunch",
    farm: "Green Basket, Sangareddy",
    category: "Vegetables",
    price: 30,
    mrp: 40,
    unit: "250 g",
    rating: 4.4,
    reviews: 198,
    tags: ["Farm Fresh"],
    certified: true,
    inStock: true,
  },
  {
    id: "vg-3",
    name: "Organic Okra (Bhindi)",
    farm: "Green Basket, Sangareddy",
    category: "Vegetables",
    price: 42,
    mrp: 55,
    unit: "500 g",
    rating: 4.3,
    reviews: 156,
    tags: [],
    certified: true,
    inStock: true,
  },
  // Fruits
  {
    id: "fr-1",
    name: "Banaganapalle Mangoes",
    farm: "Rayalaseema Orchards",
    category: "Fruits",
    price: 180,
    mrp: 240,
    unit: "1 kg",
    rating: 4.8,
    reviews: 1420,
    tags: ["Limited", "Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "fr-2",
    name: "Organic Bananas",
    farm: "Godavari Orchards",
    category: "Fruits",
    price: 60,
    mrp: 75,
    unit: "1 dozen",
    rating: 4.5,
    reviews: 540,
    tags: ["Farm Fresh"],
    certified: true,
    inStock: true,
  },
  {
    id: "fr-3",
    name: "Sweet Guava",
    farm: "Rayalaseema Orchards",
    category: "Fruits",
    price: 90,
    mrp: 120,
    unit: "1 kg",
    rating: 4.4,
    reviews: 288,
    tags: [],
    certified: true,
    inStock: true,
  },
  // Dry Fruits
  {
    id: "df-1",
    name: "Organic Cashews (W240)",
    farm: "Konkan Naturals",
    category: "Dry Fruits",
    price: 640,
    mrp: 780,
    unit: "500 g",
    rating: 4.8,
    reviews: 960,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "df-2",
    name: "Organic Almonds",
    farm: "Himalaya Naturals",
    category: "Dry Fruits",
    price: 720,
    mrp: 880,
    unit: "500 g",
    rating: 4.7,
    reviews: 1120,
    tags: [],
    certified: true,
    inStock: true,
  },
  // Jaggery
  {
    id: "jg-1",
    name: "Organic Sugarcane Jaggery",
    farm: "Nira Sweet Farms",
    category: "Jaggery",
    price: 85,
    mrp: 110,
    unit: "1 kg",
    rating: 4.7,
    reviews: 780,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "jg-2",
    name: "Palm Jaggery Blocks",
    farm: "Coastal Palm Co-op",
    category: "Jaggery",
    price: 140,
    mrp: 175,
    unit: "500 g",
    rating: 4.6,
    reviews: 342,
    tags: ["New"],
    certified: true,
    inStock: true,
  },
  // Spices
  {
    id: "sp-1",
    name: "Organic Turmeric Powder",
    farm: "Nizamabad Spice Co-op",
    category: "Spices",
    price: 120,
    mrp: 160,
    unit: "500 g",
    rating: 4.8,
    reviews: 1650,
    tags: ["Bestseller"],
    certified: true,
    inStock: true,
    featured: true,
  },
  {
    id: "sp-2",
    name: "Guntur Red Chilli Powder",
    farm: "Guntur Spice Farms",
    category: "Spices",
    price: 150,
    mrp: 190,
    unit: "500 g",
    rating: 4.7,
    reviews: 920,
    tags: [],
    certified: true,
    inStock: true,
  },
  {
    id: "sp-3",
    name: "Organic Cumin Seeds",
    farm: "Deccan Spice Co-op",
    category: "Spices",
    price: 110,
    mrp: 140,
    unit: "250 g",
    rating: 4.6,
    reviews: 415,
    tags: [],
    certified: true,
    inStock: true,
  },
]

export const MEMBERSHIP = {
  name: "AgreeConnect Organic",
  price: 499,
  period: "year",
  perks: [
    "Free delivery on every organic order",
    "Extra 10% off all farm-fresh produce",
    "Early access to seasonal & limited harvests",
    "Direct-from-farm traceability on every item",
    "Priority support & doorstep returns",
  ],
}

export function categoryImage(cat: OrganicCategory) {
  return ORGANIC_CATEGORIES.find((c) => c.key === cat)?.image ?? "/organic/rice.png"
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

export function discountPct(p: OrganicProduct) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100)
}
