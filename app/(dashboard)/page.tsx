"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/rythu360/session-provider"
import { OnboardingScreen } from "@/components/rythu360/onboarding-screen"
import { Sprout } from "lucide-react"

export default function AppIndexPage() {
  const router = useRouter()
  const { roleId, ready } = useSession()

  useEffect(() => {
    if (ready && roleId) router.replace("/dashboard")
  }, [ready, roleId, router])

  // While restoring session, or when a role already exists (redirecting), show a loader.
  if (!ready || roleId) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Sprout className="size-8 animate-pulse text-primary" />
          <p className="text-sm">Loading Rythu360…</p>
        </div>
      </div>
    )
  }

  return <OnboardingScreen />
}
