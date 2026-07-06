export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  category: string
  channel: string
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
  | "order"
  | "booking"
  | "wallet"
  | "weather"
  | "crop"
  | "scheme"
  | "message"
  | "system"
  | "promotional"
