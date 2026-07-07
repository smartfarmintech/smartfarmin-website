"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { AlertCircle, Sprout } from "lucide-react"
import { loginFarmer, registerFarmer, type ActionState } from "@/lib/farmer/actions"
import { FARMER_TYPES, label } from "@/lib/farmer/constants"
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
  const action = mode === "login" ? loginFarmer : registerFarmer
  const [state, formAction] = useActionState<ActionState, FormData>(action, null)
  const [farmerType, setFarmerType] = useState<string>("owner")
  const fieldErrors = state?.fieldErrors ?? {}

  return (
    <Card className="w-full max-w-md [--card-spacing:--spacing(6)]">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sprout className="size-6" aria-hidden />
        </div>
        <CardTitle className="font-serif text-2xl">
          {mode === "login" ? "Welcome back" : "Create your farmer account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to manage your crops, weather alerts and wallet."
            : "Register to track your farm in real time with Rythu360."}
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
              <Input id="fullName" name="fullName" autoComplete="name" placeholder="Ramesh Kumar" required />
              <FieldError message={fieldErrors.fullName} />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <FieldError message={fieldErrors.email} />
          </div>

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91…" />
                <FieldError message={fieldErrors.phone} />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience (yrs)</Label>
                <Input id="experienceYears" name="experienceYears" type="number" min={0} max={100} defaultValue={0} />
                <FieldError message={fieldErrors.experienceYears} />
              </div>
            </div>
          )}

          {mode === "register" && (
            <div>
              <Label>Farmer type</Label>
              <input type="hidden" name="farmerType" value={farmerType} />
              <Select value={farmerType} onValueChange={setFarmerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FARMER_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {label(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={fieldErrors.farmerType} />
            </div>
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

          {mode === "login" && (
            <Link href="/farmer/forgot-password" className="mt-3 block text-center text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          )}
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              New to Rythu360?{" "}
              <Link href="/farmer/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link href="/farmer/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
