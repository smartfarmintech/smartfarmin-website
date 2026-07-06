"use client"

import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error("[v0] Error caught by boundary:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-96 items-center justify-center p-6">
            <Card className="w-full max-w-md p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                  <AlertCircle className="size-6" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold">Something went wrong</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {this.state.error?.message || "An unexpected error occurred. Please try again."}
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="size-4" />
                  Reload page
                </Button>
              </div>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}

/**
 * Async error boundary wrapper for server components.
 * Use in layout files to catch errors from the subtree.
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
