export const mainNavigation = [
  {
    id: "agriculture",
    label: "Agriculture Services",
    href: "/agriculture",
    icon: "Leaf",
    megaMenu: [
      {
        title: "Akanksha AI",
        items: [
          { label: "Crop Doctor", href: "/crop-doctor", desc: "95% accurate disease detection" },
          { label: "Pest Identification", href: "/pest-identification", desc: "Real-time pest alerts" },
          { label: "Growth Monitoring", href: "/growth-monitoring", desc: "Track crop health" },
          { label: "Nutrient Analysis", href: "/nutrient-analysis", desc: "Soil & nutrient recommendations" },
        ]
      },
      {
        title: "Drone Services",
        items: [
          { label: "Crop Spraying", href: "/drone-spraying", desc: "Precision pesticide application" },
          { label: "Field Mapping", href: "/field-mapping", desc: "3D field analysis" },
          { label: "Disease Monitoring", href: "/drone-monitoring", desc: "Aerial crop assessment" },
          { label: "Book Drone", href: "/drone-booking", desc: "Schedule drone service" },
        ]
      },
      {
        title: "Machinery",
        items: [
          { label: "Tractor Rental", href: "/tractor-rental", desc: "On-demand farm equipment" },
          { label: "Equipment Hire", href: "/equipment-hire", desc: "Harvesters, threshers & more" },
          { label: "Operator Services", href: "/operator-services", desc: "Skilled machinery operators" },
          { label: "Fleet Management", href: "/fleet-management", desc: "GPS tracking & maintenance" },
        ]
      },
      {
        title: "Services",
        items: [
          { label: "Field Agents", href: "/field-agents", desc: "On-ground expert support" },
          { label: "Telecaller Support", href: "/support", desc: "24/7 agricultural counseling" },
          { label: "Training Programs", href: "/training", desc: "Farmer skill development" },
          { label: "Logistics", href: "/logistics", desc: "Farm-to-market transportation" },
        ]
      },
    ]
  },
  {
    id: "marketplace",
    label: "Marketplace",
    href: "/marketplace",
    icon: "ShoppingCart",
    megaMenu: [
      {
        title: "Buy",
        items: [
          { label: "Seeds & Fertilizers", href: "/marketplace/seeds", desc: "Quality certified seeds" },
          { label: "Farm Equipment", href: "/marketplace/equipment", desc: "Modern farming tools" },
          { label: "Pesticides & Nutrients", href: "/marketplace/inputs", desc: "Agricultural inputs" },
          { label: "All Products", href: "/marketplace", desc: "Browse all items" },
        ]
      },
      {
        title: "Sell",
        items: [
          { label: "Sell Produce", href: "/sell-produce", desc: "Direct buyer connections" },
          { label: "Organic Products", href: "/organic-store", desc: "Premium organic marketplace" },
          { label: "Become Seller", href: "/seller-onboarding", desc: "Start selling on Rythu360" },
          { label: "Seller Dashboard", href: "/seller-dashboard", desc: "Manage your store" },
        ]
      },
      {
        title: "Trading",
        items: [
          { label: "Live Market Prices", href: "/market-prices", desc: "Real-time commodity prices" },
          { label: "Price Predictions", href: "/price-predictions", desc: "AI-powered market forecast" },
          { label: "Trading Hub", href: "/trading-hub", desc: "Bulk commodity trading" },
          { label: "Market News", href: "/market-news", desc: "Agricultural market updates" },
        ]
      },
      {
        title: "Rural Commerce",
        items: [
          { label: "Local Business Directory", href: "/local-business", desc: "Find local vendors" },
          { label: "Nearby Services", href: "/nearby-services", desc: "Location-based businesses" },
          { label: "Rural Marketplace", href: "/rural-marketplace", desc: "Village commerce hub" },
          { label: "B2B Solutions", href: "/b2b-solutions", desc: "Business partnerships" },
        ]
      },
    ]
  },
  {
    id: "operations",
    label: "Operations",
    href: "/operations",
    icon: "Zap",
    megaMenu: [
      {
        title: "Dashboards",
        items: [
          { label: "Farmer Dashboard", href: "/farmer-dashboard", desc: "Farm management portal" },
          { label: "Field Operator Dashboard", href: "/field-operators", desc: "Service provider tools" },
          { label: "Admin Dashboard", href: "/admin-dashboard", desc: "Platform management" },
          { label: "Founder Dashboard", href: "/founder-dashboard", desc: "Business analytics" },
        ]
      },
      {
        title: "Management",
        items: [
          { label: "Field Bookings", href: "/bookings", desc: "Schedule farm services" },
          { label: "Payment Processing", href: "/payments", desc: "Secure transactions" },
          { label: "Document Management", href: "/documents", desc: "Digital record keeping" },
          { label: "Notifications", href: "/notifications", desc: "Real-time alerts" },
        ]
      },
      {
        title: "Enterprise",
        items: [
          { label: "Enterprise CRM", href: "/crm", desc: "Advanced lead management" },
          { label: "FPO Management", href: "/fpo-management", desc: "Farmer Producer Organization tools" },
          { label: "Fleet Management", href: "/fleet", desc: "Asset & vehicle tracking" },
          { label: "Inventory Management", href: "/inventory", desc: "Stock & warehouse control" },
        ]
      },
      {
        title: "Analytics",
        items: [
          { label: "Farm Analytics", href: "/analytics/farm", desc: "Crop yield & productivity data" },
          { label: "Market Analytics", href: "/analytics/market", desc: "Commodity trends & patterns" },
          { label: "Business Reports", href: "/analytics/reports", desc: "Custom analytics dashboards" },
          { label: "Data Exports", href: "/analytics/exports", desc: "Download reports & data" },
        ]
      },
    ]
  },
  {
    id: "government",
    label: "Government",
    href: "/government-services",
    icon: "Building2",
    megaMenu: [
      {
        title: "Schemes & Benefits",
        items: [
          { label: "PM Kisan Samman", href: "/pm-kisan", desc: "Direct income support" },
          { label: "Crop Insurance", href: "/crop-insurance", desc: "Pradhan Mantri Fasal Bima Yojana" },
          { label: "Soil Health Card", href: "/soil-health", desc: "Free soil testing program" },
          { label: "Kisan Credit Card", href: "/kcc", desc: "Agricultural loans" },
        ]
      },
      {
        title: "Services",
        items: [
          { label: "Government Portal", href: "/government-services", desc: "All government schemes" },
          { label: "Eligibility Checker", href: "/eligibility-checker", desc: "Check scheme benefits" },
          { label: "Application Status", href: "/application-status", desc: "Track applications" },
          { label: "Support Center", href: "/government-support", desc: "Government scheme help" },
        ]
      },
      {
        title: "Resources",
        items: [
          { label: "Farmer Training", href: "/government-training", desc: "Free skill development" },
          { label: "Subsidy Programs", href: "/subsidies", desc: "Equipment & input subsidies" },
          { label: "Loan Programs", href: "/loan-programs", desc: "Agricultural financing options" },
          { label: "Compliance", href: "/compliance", desc: "Regulatory requirements" },
        ]
      },
    ]
  },
  {
    id: "tourism",
    label: "Temple & Tourism",
    href: "/temple-tourism",
    icon: "MapPin",
    megaMenu: [
      {
        title: "Discover",
        items: [
          { label: "Destinations", href: "/destinations", desc: "Tourist attractions" },
          { label: "Heritage Sites", href: "/heritage", desc: "Ancient temples & culture" },
          { label: "Local Experiences", href: "/experiences", desc: "Authentic village tourism" },
          { label: "Agritourism", href: "/agritourism", desc: "Farm stay & experiences" },
        ]
      },
      {
        title: "Services",
        items: [
          { label: "Tour Booking", href: "/tour-booking", desc: "Book guided tours" },
          { label: "Travel Guides", href: "/travel-guides", desc: "Local expert guides" },
          { label: "Accommodation", href: "/accommodation", desc: "Hotels & farmstays" },
          { label: "Transportation", href: "/transportation", desc: "Travel & logistics" },
        ]
      },
    ]
  },
  {
    id: "local-business",
    label: "Local Services",
    href: "/local-business",
    icon: "Store",
    megaMenu: [
      {
        title: "Services",
        items: [
          { label: "Local Vendors", href: "/vendors", desc: "Find nearby businesses" },
          { label: "Service Providers", href: "/service-providers", desc: "Plumbers, electricians, etc" },
          { label: "Restaurants & Food", href: "/restaurants", desc: "Local dining options" },
          { label: "Retail Stores", href: "/retail-stores", desc: "Local shops & markets" },
        ]
      },
      {
        title: "Business",
        items: [
          { label: "Become Vendor", href: "/vendor-signup", desc: "Register your business" },
          { label: "Seller Analytics", href: "/vendor-analytics", desc: "Business performance data" },
          { label: "Marketing Tools", href: "/marketing-tools", desc: "Promote your business" },
          { label: "Business Support", href: "/business-support", desc: "Help & resources" },
        ]
      },
    ]
  },
]

export const secondaryNavigation = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Investors", href: "/investors" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
]

export const languageOptions = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
]
