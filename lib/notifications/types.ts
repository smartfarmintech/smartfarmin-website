export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  category: NotificationCategory
  channel: NotificationChannel
  status: "sent" | "delivered" | "failed" | "bounced"
  priority: "low" | "normal" | "high" | "urgent"
  action_url: string | null
  image_url: string | null
  data: Record<string, unknown> | null
  read_at: string | null
  created_at: string
  expires_at: string | null
}

export type NotificationCategory = 
  | "booking"
  | "order"
  | "drone_booking"
  | "drone_mission"
  | "ai_report"
  | "scheme"
  | "admin"
  | "marketplace"
  | "wallet"
  | "weather"
  | "system"

export type NotificationChannel = 
  | "in-app"
  | "email"
  | "sms"
  | "push"

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, {
  label: string
  icon: string
  color: string
}> = {
  booking: { label: "Machinery Booking", icon: "Wrench", color: "bg-blue-500" },
  order: { label: "Marketplace Order", icon: "ShoppingCart", color: "bg-green-500" },
  drone_booking: { label: "Drone Booking", icon: "Plane", color: "bg-purple-500" },
  drone_mission: { label: "Drone Mission", icon: "Activity", color: "bg-indigo-500" },
  ai_report: { label: "AI Crop Doctor", icon: "Leaf", color: "bg-emerald-500" },
  scheme: { label: "Government Scheme", icon: "Award", color: "bg-orange-500" },
  admin: { label: "Admin Alert", icon: "AlertCircle", color: "bg-red-500" },
  marketplace: { label: "Marketplace", icon: "Store", color: "bg-cyan-500" },
  wallet: { label: "Wallet", icon: "Wallet", color: "bg-yellow-500" },
  weather: { label: "Weather", icon: "Cloud", color: "bg-gray-500" },
  system: { label: "System", icon: "Settings", color: "bg-slate-500" },
}
