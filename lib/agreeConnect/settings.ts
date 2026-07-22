import type { LucideIcon } from "lucide-react"
import {
  Bell,
  CreditCard,
  Globe,
  HelpCircle,
  Info,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react"

export type SettingsCategoryId =
  | "account"
  | "security"
  | "privacy"
  | "language"
  | "notifications"
  | "subscription"
  | "help"
  | "about"

export type SettingsCategory = {
  id: SettingsCategoryId
  label: string
  description: string
  icon: LucideIcon
  /** Tailwind classes for the iOS-style rounded icon tile. */
  tint: string
  /** Short value shown on the right of the row. */
  value?: string
  group: number
}

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: "account",
    label: "Account",
    description: "Personal details, email & phone",
    icon: User,
    tint: "bg-primary text-primary-foreground",
    value: "Ravi Kumar",
    group: 1,
  },
  {
    id: "security",
    label: "Security",
    description: "Password, biometrics & 2FA",
    icon: ShieldCheck,
    tint: "bg-emerald-500 text-white",
    value: "Protected",
    group: 1,
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Location, data & permissions",
    icon: Lock,
    tint: "bg-blue-500 text-white",
    group: 1,
  },
  {
    id: "language",
    label: "Language",
    description: "App language & region",
    icon: Globe,
    tint: "bg-orange-500 text-white",
    value: "English",
    group: 2,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts, sounds & badges",
    icon: Bell,
    tint: "bg-rose-500 text-white",
    group: 2,
  },
  {
    id: "subscription",
    label: "Subscription",
    description: "Plan, billing & invoices",
    icon: CreditCard,
    tint: "bg-violet-500 text-white",
    value: "Premium",
    group: 2,
  },
  {
    id: "help",
    label: "Help & Support",
    description: "FAQs, guides & contact us",
    icon: HelpCircle,
    tint: "bg-teal-500 text-white",
    group: 3,
  },
  {
    id: "about",
    label: "About",
    description: "Version, legal & licenses",
    icon: Info,
    tint: "bg-slate-500 text-white",
    value: "v3.2.0",
    group: 3,
  },
]

export type ToggleSetting = {
  key: string
  label: string
  description: string
  default: boolean
}

export const SECURITY_TOGGLES: ToggleSetting[] = [
  { key: "faceId", label: "Face ID unlock", description: "Use biometrics to open the app", default: true },
  { key: "twoFactor", label: "Two-factor authentication", description: "Extra code on every new login", default: true },
  { key: "loginAlerts", label: "New login alerts", description: "Notify me about unrecognized devices", default: true },
  { key: "hideBalance", label: "Hide wallet balance", description: "Mask amounts on the home screen", default: false },
]

export const PRIVACY_TOGGLES: ToggleSetting[] = [
  { key: "location", label: "Location services", description: "Used for weather & nearby mandis", default: true },
  { key: "analytics", label: "Share usage analytics", description: "Help improve SmartFarmin", default: true },
  { key: "personalization", label: "Personalized content", description: "Tailor advice to your farm", default: true },
  { key: "ads", label: "Personalized ads", description: "Show relevant sponsored offers", default: false },
]

export const NOTIFICATION_TOGGLES: ToggleSetting[] = [
  { key: "push", label: "Push notifications", description: "Alerts on this device", default: true },
  { key: "weather", label: "Weather warnings", description: "Storms, rainfall & heat alerts", default: true },
  { key: "prices", label: "Mandi price alerts", description: "When your crop crosses a target", default: true },
  { key: "orders", label: "Order updates", description: "Marketplace deliveries & payments", default: true },
  { key: "govt", label: "Government schemes", description: "New subsidies & deadlines", default: true },
  { key: "marketing", label: "Offers & promotions", description: "Occasional marketing messages", default: false },
]

export type SecurityEvent = { device: string; location: string; time: string; current?: boolean }

export const LOGIN_HISTORY: SecurityEvent[] = [
  { device: "iPhone 15 · SmartFarmin app", location: "Warangal, Telangana", time: "Active now", current: true },
  { device: "Chrome · Windows", location: "Hyderabad, Telangana", time: "Yesterday, 6:42 PM" },
  { device: "SmartFarmin app · Android", location: "Warangal, Telangana", time: "12 Feb, 9:10 AM" },
]

export type HelpTopic = { label: string; description: string }

export const HELP_TOPICS: HelpTopic[] = [
  { label: "Getting started guide", description: "Set up your farm profile in minutes" },
  { label: "Using Akanksha AI", description: "Ask questions & scan crops" },
  { label: "Selling on the marketplace", description: "List produce & get paid" },
  { label: "Payments & refunds", description: "Wallet, UPI & bank transfers" },
]

export const ABOUT_LINKS: string[] = [
  "Terms of Service",
  "Privacy Policy",
  "Community Guidelines",
  "Open-source Licenses",
  "Rate SmartFarmin",
]
