import type { Metadata } from "next"
import { AuthForm } from "@/components/operator/auth-form"

export const metadata: Metadata = {
  title: "Operator Sign In — Rythu360",
  description: "Sign in to your Rythu360 machinery owner account.",
}

export default function OperatorLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary/40 px-4 py-10">
      <AuthForm mode="login" />
    </main>
  )
}
