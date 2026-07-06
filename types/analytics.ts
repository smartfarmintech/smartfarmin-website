export interface FounderMetrics {
  totalRevenue: number
  bookingRevenue: number
  marketplaceRevenue: number
  totalFarmers: number
  totalOperators: number
  aiUsageCount: number
}

export interface AdminMetrics {
  totalFarmers: number
  totalOperators: number
  activeBookings: number
  activeOrders: number
  pendingVerifications: number
}

export interface OperatorMetrics {
  totalMachines: number
  totalBookings: number
  totalEarnings: number
  averageRating: number
  reviewCount: number
}

export interface DroneMetrics {
  totalDrones: number
  completedMissions: number
  areaCovered: number
  flightHours: number
}

export interface MarketplaceMetrics {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  activeSellers: number
}

export interface TimeSeriesData {
  date: string
  amount: number
}

export interface DistrictAnalytics {
  district: string
  farmerCount: number
  activeBookings: number
  totalRevenue: number
}
