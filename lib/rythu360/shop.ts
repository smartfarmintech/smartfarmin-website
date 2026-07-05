export type ShopCategory =
  | "Seeds"
  | "Fertilizers"
  | "Pesticides"
  | "Machinery"
  | "Animal Care"
  | "Solar"
  | "Irrigation"

export type Product = {
  id: string
  name: string
  brand: string
  category: ShopCategory
  price: number
  mrp: number
  unit: string
  rating: number
  reviews: number
  image: string
  tags: ("Bestseller" | "New" | "Deal" | "Subsidy")[]
  delivery: string
  inStock: boolean
  recommended?: boolean
  reason?: string
}

export const CATEGORIES: { key: ShopCategory; icon: string; tint: string }[] = [
  { key: "Seeds", icon: "Sprout", tint: "bg-primary/12 text-primary" },
  { key: "Fertilizers", icon: "FlaskConical", tint: "bg-chart-3/15 text-chart-3" },
  { key: "Pesticides", icon: "Bug", tint: "bg-destructive/12 text-destructive" },
  { key: "Machinery", icon: "Tractor", tint: "bg-chart-4/15 text-chart-4" },
  { key: "Animal Care", icon: "Beef", tint: "bg-accent/15 text-accent" },
  { key: "Solar", icon: "Sun", tint: "bg-accent/15 text-accent" },
  { key: "Irrigation", icon: "Droplets", tint: "bg-primary/12 text-primary" },
]

// Emoji-free, deterministic placeholder imagery via query param labels handled by <ProductImage>.
export const PRODUCTS: Product[] = [
  {
    id: "sd-1",
    name: "Hybrid Paddy Seeds BPT-5204",
    brand: "Kaveri Seeds",
    category: "Seeds",
    price: 890,
    mrp: 1050,
    unit: "10 kg bag",
    rating: 4.6,
    reviews: 2140,
    image: "paddy seed bag",
    tags: ["Bestseller"],
    delivery: "Free delivery by Tomorrow",
    inStock: true,
    recommended: true,
    reason: "Matches your Kharif paddy plan in Warangal",
  },
  {
    id: "sd-2",
    name: "BT Cotton Seeds Bollgard-II",
    brand: "Rasi Seeds",
    category: "Seeds",
    price: 767,
    mrp: 830,
    unit: "450 g pack",
    rating: 4.4,
    reviews: 1580,
    image: "cotton seed packet",
    tags: ["Deal"],
    delivery: "Free delivery by Wed",
    inStock: true,
  },
  {
    id: "sd-3",
    name: "Tomato Hybrid F1 Seeds",
    brand: "Syngenta",
    category: "Seeds",
    price: 420,
    mrp: 520,
    unit: "10 g tin",
    rating: 4.5,
    reviews: 940,
    image: "tomato seeds tin",
    tags: ["New"],
    delivery: "Delivery by Thu",
    inStock: true,
  },
  {
    id: "ft-1",
    name: "Urea 46% Nitrogen Fertilizer",
    brand: "IFFCO",
    category: "Fertilizers",
    price: 266,
    mrp: 300,
    unit: "45 kg bag",
    rating: 4.7,
    reviews: 5210,
    image: "urea fertilizer bag",
    tags: ["Bestseller", "Subsidy"],
    delivery: "Free delivery by Tomorrow",
    inStock: true,
    recommended: true,
    reason: "Due for top-dressing based on your crop stage",
  },
  {
    id: "ft-2",
    name: "DAP Di-Ammonium Phosphate",
    brand: "Coromandel",
    category: "Fertilizers",
    price: 1350,
    mrp: 1450,
    unit: "50 kg bag",
    rating: 4.6,
    reviews: 3120,
    image: "DAP fertilizer bag",
    tags: ["Subsidy"],
    delivery: "Free delivery by Wed",
    inStock: true,
  },
  {
    id: "ft-3",
    name: "Organic Vermicompost",
    brand: "GreenEarth",
    category: "Fertilizers",
    price: 340,
    mrp: 450,
    unit: "25 kg bag",
    rating: 4.3,
    reviews: 760,
    image: "vermicompost organic bag",
    tags: ["Deal"],
    delivery: "Delivery by Thu",
    inStock: true,
  },
  {
    id: "ps-1",
    name: "Imidacloprid 17.8% SL Insecticide",
    brand: "Bayer",
    category: "Pesticides",
    price: 520,
    mrp: 640,
    unit: "500 ml",
    rating: 4.5,
    reviews: 1420,
    image: "insecticide bottle",
    tags: ["Bestseller"],
    delivery: "Free delivery by Wed",
    inStock: true,
  },
  {
    id: "ps-2",
    name: "Mancozeb 75% WP Fungicide",
    brand: "UPL",
    category: "Pesticides",
    price: 380,
    mrp: 460,
    unit: "1 kg",
    rating: 4.2,
    reviews: 690,
    image: "fungicide powder pack",
    tags: ["Deal"],
    delivery: "Delivery by Thu",
    inStock: true,
  },
  {
    id: "mc-1",
    name: "Battery Knapsack Power Sprayer",
    brand: "Neptune",
    category: "Machinery",
    price: 3299,
    mrp: 4500,
    unit: "16 L tank",
    rating: 4.4,
    reviews: 2050,
    image: "knapsack sprayer machine",
    tags: ["Deal", "Bestseller"],
    delivery: "Free delivery by Fri",
    inStock: true,
  },
  {
    id: "mc-2",
    name: "Brush Cutter 2-Stroke 4 HP",
    brand: "Honda",
    category: "Machinery",
    price: 8499,
    mrp: 9999,
    unit: "1 unit",
    rating: 4.6,
    reviews: 880,
    image: "brush cutter machine",
    tags: ["New"],
    delivery: "Delivery by Sat",
    inStock: true,
  },
  {
    id: "ac-1",
    name: "Cattle Mineral Mixture Supplement",
    brand: "Amul",
    category: "Animal Care",
    price: 640,
    mrp: 780,
    unit: "5 kg bucket",
    rating: 4.7,
    reviews: 1610,
    image: "cattle mineral supplement bucket",
    tags: ["Bestseller"],
    delivery: "Free delivery by Wed",
    inStock: true,
  },
  {
    id: "ac-2",
    name: "Poultry Growth Feed Premium",
    brand: "Godrej",
    category: "Animal Care",
    price: 1180,
    mrp: 1350,
    unit: "50 kg bag",
    rating: 4.4,
    reviews: 540,
    image: "poultry feed bag",
    tags: ["Deal"],
    delivery: "Delivery by Thu",
    inStock: false,
  },
  {
    id: "sl-1",
    name: "Solar Water Pump 3 HP DC",
    brand: "Shakti",
    category: "Solar",
    price: 42999,
    mrp: 58000,
    unit: "with panels",
    rating: 4.5,
    reviews: 320,
    image: "solar water pump panels",
    tags: ["Subsidy", "Deal"],
    delivery: "Installed in 7 days",
    inStock: true,
    recommended: true,
    reason: "Eligible for PM-KUSUM 60% subsidy",
  },
  {
    id: "sl-2",
    name: "Solar LED Insect Trap Light",
    brand: "Luminous",
    category: "Solar",
    price: 1499,
    mrp: 2200,
    unit: "1 unit",
    rating: 4.2,
    reviews: 410,
    image: "solar insect trap light",
    tags: ["New"],
    delivery: "Free delivery by Fri",
    inStock: true,
  },
  {
    id: "ir-1",
    name: "Drip Irrigation Kit 1 Acre",
    brand: "Jain Irrigation",
    category: "Irrigation",
    price: 12500,
    mrp: 16000,
    unit: "complete kit",
    rating: 4.6,
    reviews: 780,
    image: "drip irrigation kit",
    tags: ["Subsidy", "Bestseller"],
    delivery: "Delivery by Sat",
    inStock: true,
  },
  {
    id: "ir-2",
    name: "Sprinkler Set HDPE 25 mm",
    brand: "Finolex",
    category: "Irrigation",
    price: 4800,
    mrp: 6200,
    unit: "20 sprinklers",
    rating: 4.3,
    reviews: 350,
    image: "sprinkler irrigation set",
    tags: ["Deal"],
    delivery: "Delivery by Sat",
    inStock: true,
  },
]

const CATEGORY_IMAGE: Record<ShopCategory, string> = {
  Seeds: "/shop/seeds.png",
  Fertilizers: "/shop/fertilizers.png",
  Pesticides: "/shop/pesticides.png",
  Machinery: "/shop/machinery.png",
  "Animal Care": "/shop/animal-care.png",
  Solar: "/shop/solar.png",
  Irrigation: "/shop/irrigation.png",
}

export function productImage(p: Product) {
  return CATEGORY_IMAGE[p.category]
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

export function discountPct(price: number, mrp: number) {
  if (mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}
