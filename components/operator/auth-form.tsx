"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { AlertCircle, Tractor } from "lucide-react"
import { loginOwner, registerOwner, type ActionState } from "@/lib/operator/actions"
import { MACHINE_OWNERSHIP_TYPES } from "@/lib/operator/constants"
import { label } from "@/lib/operator/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubmitButton } from "./submit-button"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginOwner : registerOwner
  const [state, formAction] = useActionState<ActionState, FormData>(action, null)
  const [ownershipType, setOwnershipType] = useState<string>("individual")
  const fieldErrors = state?.fieldErrors ?? {}

  return (
    <Card className="w-full max-w-md [--card-spacing:--spacing(6)]">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Tractor className="size-6" aria-hidden />
        </div>
        <CardTitle className="font-serif text-2xl">
          {mode === "login" ? "Welcome back" : "Register your machinery business"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to manage your machines, bookings and operators."
            : "List your farm machinery and start accepting rental bookings."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{state.error}</span>
            </div>
          )}

          {mode === "register" && (
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" placeholder="Suresh Reddy" required />
              <FieldError message={fieldErrors.fullName} />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <FieldError message={fieldErrors.email} />
          </div>

          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91…" />
                  <FieldError message={fieldErrors.phone} />
                </div>
                <div>
                  <Label htmlFor="businessName">Business (optional)</Label>
                  <Input id="businessName" name="businessName" placeholder="Reddy Agri Hire" />
                  <FieldError message={fieldErrors.businessName} />
                </div>
              </div>

              <div>
                <Label>Ownership type</Label>
                <input type="hidden" name="ownershipType" value={ownershipType} />
                <Select value={ownershipType} onValueChange={setOwnershipType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MACHINE_OWNERSHIP_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {label(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={fieldErrors.ownershipType} />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              required
            />
            <FieldError message={fieldErrors.password} />
          </div>

          {mode === "register" && (
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
              <FieldError message={fieldErrors.confirmPassword} />
            </div>
          )}

          <SubmitButton className="mt-1 w-full" pendingText={mode === "login" ? "Signing in…" : "Creating account…"}>
            {mode === "login" ? "Sign in" : "Create account"}
          </SubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              New to Rythu360?{" "}
              <Link href="/operator/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link href="/operator/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
