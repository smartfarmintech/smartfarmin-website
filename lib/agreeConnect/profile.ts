import type { LucideIcon } from "lucide-react"
import {
  Award,
  BadgeCheck,
  Flame,
  Leaf,
  ShoppingBasket,
  Sprout,
  Star,
  Target,
  Tractor,
  Trophy,
  Users,
} from "lucide-react"

export const PROFILE = {
  name: "Ravi Kumar",
  initials: "RK",
  handle: "@ravikumar",
  location: "Warangal, Telangana",
  land: "6.5 acres",
  memberSince: "March 2023",
  verified: true,
  plan: "Premium",
  planRenews: "12 Aug 2026",
  loyaltyPoints: 4820,
  loyaltyTier: "Gold",
  nextTier: "Platinum",
  pointsToNextTier: 1180,
}

export type InfoField = { label: string; value: string; editable?: boolean }

export const PERSONAL_INFO: InfoField[] = [
  { label: "Full name", value: "Ravi Kumar", editable: true },
  { label: "Phone", value: "+91 98490 12345", editable: true },
  { label: "Email", value: "ravi.kumar@gmail.com", editable: true },
  { label: "Date of birth", value: "14 June 1986" },
  { label: "Gender", value: "Male" },
  { label: "Village / Mandal", value: "Duggondi, Warangal", editable: true },
  { label: "State", value: "Telangana" },
  { label: "Primary crop", value: "Paddy (BPT 5204)", editable: true },
]

export type DocStatus = "verified" | "pending" | "missing"
export type DocItem = {
  id: string
  name: string
  meta: string
  status: DocStatus
  icon: LucideIcon
}

export const DOCUMENTS: DocItem[] = [
  { id: "aadhaar", name: "Aadhaar Card", meta: "XXXX XXXX 4521", status: "verified", icon: BadgeCheck },
  { id: "pan", name: "PAN Card", meta: "ABCPK••••F", status: "verified", icon: BadgeCheck },
  { id: "land", name: "Land Records (Pattadar)", meta: "Passbook 1/2 · 6.5 ac", status: "verified", icon: Sprout },
  { id: "ration", name: "Ration Card", meta: "Food security card", status: "pending", icon: Users },
  { id: "soil", name: "Soil Health Card", meta: "Not uploaded", status: "missing", icon: Leaf },
]

export type KycStep = { label: string; done: boolean; hint: string }

export const KYC = {
  level: "Full KYC",
  progress: 80,
  status: "verified" as "verified" | "in-review" | "action",
  steps: [
    { label: "Mobile verified", done: true, hint: "OTP confirmed" },
    { label: "Aadhaar e-KYC", done: true, hint: "UIDAI matched" },
    { label: "PAN linked", done: true, hint: "Name matched" },
    { label: "Bank account", done: true, hint: "Penny-drop verified" },
    { label: "Video KYC", done: false, hint: "Optional for higher limits" },
  ] as KycStep[],
}

export type BankAccount = {
  id: string
  bank: string
  masked: string
  ifsc: string
  branch: string
  primary?: boolean
  verified: boolean
}

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "sbi",
    bank: "State Bank of India",
    masked: "•••• •••• 7788",
    ifsc: "SBIN0020945",
    branch: "Warangal Main",
    primary: true,
    verified: true,
  },
  {
    id: "apgb",
    bank: "AP Grameena Vikas Bank",
    masked: "•••• •••• 3120",
    ifsc: "APGV0002210",
    branch: "Duggondi",
    verified: true,
  },
]

export const UPI = { id: "ravikumar@okaxis", verified: true }

export type Achievement = {
  id: string
  title: string
  desc: string
  icon: LucideIcon
  unlocked: boolean
  accent: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "early", title: "Early Adopter", desc: "Joined in first 10k farmers", icon: Star, unlocked: true, accent: "text-accent" },
  { id: "green", title: "Green Thumb", desc: "3 successful harvests logged", icon: Sprout, unlocked: true, accent: "text-primary" },
  { id: "market", title: "Market Master", desc: "50 mandi sales completed", icon: Trophy, unlocked: true, accent: "text-accent" },
  { id: "machine", title: "Mechanized", desc: "Booked 10 equipment services", icon: Tractor, unlocked: true, accent: "text-chart-1" },
  { id: "referrer", title: "Community Builder", desc: "Referred 5 farmers", icon: Users, unlocked: true, accent: "text-chart-3" },
  { id: "streak", title: "30-Day Streak", desc: "Log activity for 30 days", icon: Flame, unlocked: false, accent: "text-muted-foreground" },
  { id: "organic", title: "Organic Pioneer", desc: "Sell 100kg organic produce", icon: Leaf, unlocked: false, accent: "text-muted-foreground" },
  { id: "topseller", title: "Top Seller", desc: "Reach ₹5L in marketplace sales", icon: Award, unlocked: false, accent: "text-muted-foreground" },
]

export type Reward = {
  id: string
  title: string
  desc: string
  cost: number
  icon: LucideIcon
  tag?: string
}

export const REWARDS: Reward[] = [
  { id: "seeds", title: "₹200 off Seeds", desc: "Redeem on any seed pack", cost: 800, icon: Sprout, tag: "Popular" },
  { id: "shipping", title: "Free Delivery x5", desc: "On marketplace orders", cost: 600, icon: ShoppingBasket },
  { id: "scan", title: "20 Bonus AI Scans", desc: "Crop disease detection", cost: 1200, icon: Target },
  { id: "premium", title: "1 Month Premium", desc: "Free plan extension", cost: 3000, icon: Trophy, tag: "Best value" },
]

export type LanguageOption = { code: string; label: string; native: string }

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
]

export function statusColor(status: DocStatus) {
  switch (status) {
    case "verified":
      return "bg-primary/12 text-primary"
    case "pending":
      return "bg-accent/15 text-accent"
    case "missing":
      return "bg-muted text-muted-foreground"
  }
}
