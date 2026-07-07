/**
 * Comprehensive environment variable validation for production
 * Runs on server startup to ensure all required config is present
 */

interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SUPABASE_JWT_SECRET: string

  // App
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: "development" | "production" | "test"

  // Optional: Payments (if enabled)
  RAZORPAY_KEY_ID?: string
  RAZORPAY_KEY_SECRET?: string

  // Optional: Email/Notifications
  SENDGRID_API_KEY?: string
  TWILIO_ACCOUNT_SID?: string
  TWILIO_AUTH_TOKEN?: string

  // Optional: Storage
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_S3_BUCKET?: string
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): EnvConfig {
  const missingVars: string[] = []

  // Required variables
  const required: (keyof EnvConfig)[] = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "NEXT_PUBLIC_APP_URL",
    "NODE_ENV",
  ]

  for (const key of required) {
    const value = process.env[key]
    if (!value || value.trim() === "") {
      missingVars.push(key)
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}.\n` +
        "Please ensure all required variables are set in your .env file or environment.",
    )
  }

  // Validate NEXT_PUBLIC_APP_URL format
  try {
    new URL(process.env.NEXT_PUBLIC_APP_URL!)
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_APP_URL: "${process.env.NEXT_PUBLIC_APP_URL}". Must be a valid URL.`,
    )
  }

  // Validate NODE_ENV
  if (!["development", "production", "test"].includes(process.env.NODE_ENV!)) {
    throw new Error(
      `Invalid NODE_ENV: "${process.env.NODE_ENV}". Must be one of: development, production, test`,
    )
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  }
}

/**
 * Check if payment integration is enabled
 */
export function isPaymentEnabled(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

/**
 * Check if email notifications are enabled
 */
export function isEmailNotificationEnabled(): boolean {
  return !!process.env.SENDGRID_API_KEY
}

/**
 * Check if SMS notifications are enabled
 */
export function isSmsNotificationEnabled(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
}

/**
 * Check if S3 storage is configured
 */
export function isS3StorageEnabled(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET
  )
}

/**
 * Log configuration status on startup
 */
export function logConfigurationStatus(): void {
  const status = {
    environment: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    payments: isPaymentEnabled(),
    email: isEmailNotificationEnabled(),
    sms: isSmsNotificationEnabled(),
    storage: isS3StorageEnabled(),
  }

  console.log("[v0] Environment Configuration:")
  console.log(JSON.stringify(status, null, 2))
}
