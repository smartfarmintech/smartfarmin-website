"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Sprout, Lock } from "lucide-react"
import { resetPasswordWithToken } from "@/lib/farmer/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, formAction] = useActionState(resetPasswordWithToken, null)
  const fieldErrors = (state as any)?.fieldErrors ?? {}

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>This password reset link is invalid or has expired. Please request a new one.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout className="size-6" />
          </div>
          <CardTitle className="font-serif text-2xl">Create New Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {(state as any)?.error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{(state as any).error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
              />
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full gap-2">
              <Lock className="size-4" />
              Reset Password
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
