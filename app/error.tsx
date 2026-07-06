"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { BrandMark } from "@/components/rythu360/status-screens"
import { Button } from "@/components/ui/button"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.log("[v0] Root error:", error.message)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="px-6 py-5">
        <Link href="/" aria-label="Rythu360 home">
          <BrandMark />
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </span>
          <h1 className="mt-6 text-balance font-serif text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            An unexpected error occurred. Please try again — if the problem persists, return
            to the homepage.
          </p>

          {error.digest ? (
            <p className="mt-4 inline-block rounded-full border border-border/70 bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button onClick={reset} className="w-full rounded-full sm:w-auto">
              <RotateCcw className="size-4" /> Try again
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/" />}
              nativeButton={false}
            >
              <Home className="size-4" /> Go home
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
