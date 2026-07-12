// Rythu360 Authentication System - Complete Configuration

export const AUTH_ROLES = {
  FARMER: "farmer",
  FIELD_OPERATOR: "field_operator",
  DRONE_OPERATOR: "drone_operator",
  TRACTOR_OWNER: "tractor_owner",
  EQUIPMENT_OWNER: "equipment_owner",
  BUYER: "buyer",
  SELLER: "seller",
  AGRICULTURE_EXPERT: "agriculture_expert",
  TELECALLER: "telecaller",
  VILLAGE_COORDINATOR: "village_coordinator",
  GOVERNMENT_OFFICER: "government_officer",
  ENTERPRISE: "enterprise",
} as const

export const ROLE_DETAILS = {
  [AUTH_ROLES.FARMER]: {
    name: "Farmer",
    icon: "🌾",
    description: "Access crop advisory, marketplace, services",
    color: "emerald",
  },
  [AUTH_ROLES.FIELD_OPERATOR]: {
    name: "Field Operator",
    icon: "👨‍🌾",
    description: "Manage field operations and labour",
    color: "blue",
  },
  [AUTH_ROLES.DRONE_OPERATOR]: {
    name: "Drone Operator",
    icon: "🚁",
    description: "Offer drone services",
    color: "sky",
  },
  [AUTH_ROLES.TRACTOR_OWNER]: {
    name: "Tractor Owner",
    icon: "🚜",
    description: "Rent machinery and services",
    color: "amber",
  },
  [AUTH_ROLES.EQUIPMENT_OWNER]: {
    name: "Equipment Owner",
    icon: "⚙️",
    description: "Manage equipment rentals",
    color: "slate",
  },
  [AUTH_ROLES.BUYER]: {
    name: "Buyer",
    icon: "🛒",
    description: "Purchase agricultural products",
    color: "purple",
  },
  [AUTH_ROLES.SELLER]: {
    name: "Seller",
    icon: "📦",
    description: "Sell products on marketplace",
    color: "orange",
  },
  [AUTH_ROLES.AGRICULTURE_EXPERT]: {
    name: "Ag Expert",
    icon: "🎓",
    description: "Provide expert consultation",
    color: "green",
  },
  [AUTH_ROLES.TELECALLER]: {
    name: "Telecaller",
    icon: "☎️",
    description: "Customer support operations",
    color: "red",
  },
  [AUTH_ROLES.VILLAGE_COORDINATOR]: {
    name: "Village Coordinator",
    icon: "👥",
    description: "Community management",
    color: "indigo",
  },
  [AUTH_ROLES.GOVERNMENT_OFFICER]: {
    name: "Gov Officer",
    icon: "🏛️",
    description: "Government scheme management",
    color: "cyan",
  },
  [AUTH_ROLES.ENTERPRISE]: {
    name: "Enterprise",
    icon: "🏢",
    description: "B2B operations",
    color: "gray",
  },
} as const

// Onboarding screens configuration
export const ONBOARDING_SCREENS = [
  {
    id: 1,
    title: "Welcome to Rythu360",
    subtitle: "One Platform. Every Farming Solution.",
    description: "India's most comprehensive agriculture ecosystem",
    icon: "🌾",
    features: ["Services", "Market", "AI", "Community"],
  },
  {
    id: 2,
    title: "Book Agriculture Services",
    subtitle: "48+ Services at Your Fingertips",
    services: ["🚁 Drone", "🚜 Tractor", "⚙️ Machinery", "👨‍🌾 Labour", "🚜 Harvester"],
    description: "Book verified services instantly",
  },
  {
    id: 3,
    title: "Akanksha AI Assistant",
    subtitle: "Your Intelligent Farming Partner",
    features: ["🤖 Disease Detection", "🎤 Voice Commands", "📊 Yield Prediction", "🌤️ Weather Alerts"],
    description: "AI-powered crop advisory",
  },
  {
    id: 4,
    title: "Marketplace",
    subtitle: "Buy & Sell Agricultural Products",
    categories: ["🍋 Lemon", "🌾 Rice", "🌸 Flowers", "🥬 Vegetables", "🐄 Livestock"],
    description: "Direct farmer-to-market platform",
  },
  {
    id: 5,
    title: "Government Services",
    subtitle: "Subsidies & Support Programs",
    schemes: ["PM Kisan", "Crop Insurance", "Agricultural Loans", "KCC", "FPO Support"],
    description: "Easy access to government benefits",
  },
  {
    id: 6,
    title: "Live Market Intelligence",
    subtitle: "Real-time Price Tracking",
    products: ["🍋 Lemon", "🌾 Rice", "🌶️ Mirchi", "🥚 Eggs", "🍗 Chicken"],
    description: "Updated market prices daily",
  },
  {
    id: 7,
    title: "Nearby Services",
    subtitle: "Local Support When You Need It",
    services: ["🏨 Hotels", "🍽️ Dhabas", "🏥 Hospitals", "🏭 Rice Mills", "⚙️ Mechanics"],
    description: "Find services near your location",
  },
  {
    id: 8,
    title: "Get Started",
    subtitle: "Join Millions of Indian Farmers",
    cta: "Create Account",
    description: "Start your digital farming journey today",
  },
]

// Registration steps configuration
export const REGISTRATION_STEPS = [
  {
    id: 1,
    title: "Select Your Role",
    description: "Choose how you want to use Rythu360",
    field: "role",
  },
  {
    id: 2,
    title: "Basic Information",
    description: "Tell us about yourself",
    field: "basicInfo",
  },
  {
    id: 3,
    title: "Location Details",
    description: "Where do you operate?",
    field: "location",
  },
  {
    id: 4,
    title: "Agriculture Info",
    description: "Your farming details",
    field: "agriInfo",
  },
  {
    id: 5,
    title: "Services Interested",
    description: "What services interest you?",
    field: "services",
  },
  {
    id: 6,
    title: "Language Preference",
    description: "Choose your preferred language",
    field: "language",
  },
  {
    id: 7,
    title: "Permissions",
    description: "Grant necessary permissions",
    field: "permissions",
  },
  {
    id: 8,
    title: "Welcome",
    description: "Your account is ready",
    field: "success",
  },
]

// Verification types
export const VERIFICATION_TYPES = {
  EMAIL: "email",
  PHONE: "phone",
  OPERATOR: "operator",
  GOVERNMENT: "government",
  ENTERPRISE: "enterprise",
}

export const VERIFICATION_BADGES = {
  [VERIFICATION_TYPES.EMAIL]: {
    label: "Email Verified",
    icon: "✓",
    color: "green",
  },
  [VERIFICATION_TYPES.PHONE]: {
    label: "Phone Verified",
    icon: "✓",
    color: "green",
  },
  [VERIFICATION_TYPES.OPERATOR]: {
    label: "Operator Verified",
    icon: "✓",
    color: "blue",
  },
  [VERIFICATION_TYPES.GOVERNMENT]: {
    label: "Government Verified",
    icon: "✓",
    color: "amber",
  },
  [VERIFICATION_TYPES.ENTERPRISE]: {
    label: "Enterprise Verified",
    icon: "✓",
    color: "purple",
  },
}

// Auth methods
export const AUTH_METHODS = {
  PHONE_OTP: "phone_otp",
  EMAIL_PASSWORD: "email_password",
  GOOGLE: "google",
  APPLE: "apple",
  BIOMETRIC: "biometric",
  GUEST: "guest",
}

export const AUTH_METHOD_DETAILS = {
  [AUTH_METHODS.PHONE_OTP]: {
    name: "Phone OTP",
    icon: "📱",
    description: "6-digit OTP via SMS",
  },
  [AUTH_METHODS.EMAIL_PASSWORD]: {
    name: "Email & Password",
    icon: "📧",
    description: "Traditional email login",
  },
  [AUTH_METHODS.GOOGLE]: {
    name: "Google",
    icon: "🔵",
    description: "Sign in with Google",
  },
  [AUTH_METHODS.APPLE]: {
    name: "Apple",
    icon: "⚫",
    description: "Sign in with Apple",
  },
  [AUTH_METHODS.BIOMETRIC]: {
    name: "Biometric",
    icon: "👆",
    description: "Fingerprint or Face ID",
  },
  [AUTH_METHODS.GUEST]: {
    name: "Continue as Guest",
    icon: "👤",
    description: "Browse without account",
  },
}

// Settings sections
export const SETTINGS_SECTIONS = {
  ACCOUNT: "account",
  SECURITY: "security",
  PRIVACY: "privacy",
  NOTIFICATIONS: "notifications",
  PREFERENCES: "preferences",
  DANGER: "danger",
}

export const SETTINGS_DETAILS = {
  [SETTINGS_SECTIONS.ACCOUNT]: {
    title: "Account Settings",
    icon: "⚙️",
    items: ["Profile Info", "Email Address", "Phone Number", "Password"],
  },
  [SETTINGS_SECTIONS.SECURITY]: {
    title: "Security",
    icon: "🔒",
    items: ["2FA Setup", "Trusted Devices", "Login History", "Active Sessions"],
  },
  [SETTINGS_SECTIONS.PRIVACY]: {
    title: "Privacy & Permissions",
    icon: "🔐",
    items: ["Location Sharing", "Camera Access", "Gallery Access", "Notifications"],
  },
  [SETTINGS_SECTIONS.NOTIFICATIONS]: {
    title: "Notifications",
    icon: "🔔",
    items: ["Email Alerts", "SMS Alerts", "In-App Alerts", "Push Notifications"],
  },
  [SETTINGS_SECTIONS.PREFERENCES]: {
    title: "Preferences",
    icon: "⚡",
    items: ["Language", "Theme", "Currency", "Timezone"],
  },
  [SETTINGS_SECTIONS.DANGER]: {
    title: "Danger Zone",
    icon: "⚠️",
    items: ["Delete Account", "Logout All Devices"],
  },
}

// States and validation
export const VALIDATION_RULES = {
  PHONE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PINCODE: /^\d{6}$/,
  OTP: /^\d{6}$/,
}

export const ERROR_MESSAGES = {
  INVALID_PHONE: "Please enter a valid 10-digit phone number",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_NAME: "Name should be 2-50 characters",
  INVALID_PASSWORD: "Password must be 8+ chars with uppercase, lowercase, number, symbol",
  INVALID_OTP: "OTP should be 6 digits",
  OTP_EXPIRED: "OTP has expired. Please request a new one",
  OTP_MAX_ATTEMPTS: "Maximum attempts exceeded. Please try again later",
  USER_EXISTS: "User with this phone/email already exists",
  INVALID_CREDENTIALS: "Invalid phone/email or password",
  NETWORK_ERROR: "Network error. Please try again",
}

export const SUCCESS_MESSAGES = {
  OTP_SENT: "OTP sent successfully to your phone",
  VERIFICATION_SUCCESS: "Verification successful!",
  ACCOUNT_CREATED: "Account created successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  MFA_ENABLED: "Two-factor authentication enabled",
}

// Auth state types
export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES]
export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS]
export type VerificationType = (typeof VERIFICATION_TYPES)[keyof typeof VERIFICATION_TYPES]

export interface UserProfile {
  id: string
  phone?: string
  email?: string
  name: string
  role: AuthRole
  state: string
  district: string
  mandal: string
  village: string
  pincode: string
  profilePhoto?: string
  cropsFarmed?: string[]
  irrigationMethod?: string
  landArea?: number
  landType?: string
  verifiedBadges: VerificationType[]
  language: "en" | "te" | "hi"
  createdAt: Date
  updatedAt: Date
}
