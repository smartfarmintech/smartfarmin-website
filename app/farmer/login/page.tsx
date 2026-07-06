import type { Metadata } from "next"
import { AuthForm } from "@/components/farmer/auth-form"

export const metadata: Metadata = {
  title: "Farmer Sign In — Rythu360",
  description: "Sign in to your Rythu360 farmer account.",
}

export default function FarmerLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary/40 px-4 py-10">
      <AuthForm mode="login" />
    </main>
  )
}
