import type { Metadata } from "next"
import { AuthForm } from "@/components/operator/auth-form"

export const metadata: Metadata = {
  title: "Register as Machinery Owner — Rythu360",
  description: "List your farm machinery and start accepting rental bookings on Rythu360.",
}

export default function OperatorRegisterPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary/40 px-4 py-10">
      <AuthForm mode="register" />
    </main>
  )
}
