"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateProfile, type ActionState } from "@/lib/operator/actions"
import type { UserProfile } from "@/lib/operator/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SubmitButton } from "./submit-button"

export function ProfileForm({ profile, email }: { profile: UserProfile | null; email: string }) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfile, null)

  useEffect(() => {
    if (state?.ok) router.refresh()
  }, [state, router])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit p-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {(profile?.full_name || email || "O").charAt(0).toUpperCase()}
          </div>
          <p className="mt-3 font-serif text-lg font-semibold text-foreground">
            {profile?.full_name || "Machinery owner"}
          </p>
          <p className="text-sm text-muted-foreground">{profile?.email || email}</p>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-serif text-lg font-semibold text-foreground">Personal details</h2>
        <form action={formAction} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" defaultValue={profile?.full_name ?? ""} required />
            {state?.fieldErrors?.fullName ? (
              <p className="text-xs text-destructive">{state.fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferredLanguage">Preferred language</Label>
              <Input
                id="preferredLanguage"
                name="preferredLanguage"
                defaultValue={profile?.preferred_language ?? ""}
                placeholder="e.g. Telugu"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" name="addressLine1" defaultValue={profile?.address_line1 ?? ""} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" name="pincode" defaultValue={profile?.pincode ?? ""} className="sm:max-w-[200px]" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={profile?.bio ?? ""} />
          </div>

          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          {state?.ok ? <p className="text-sm text-primary">Profile updated.</p> : null}

          <SubmitButton>Save changes</SubmitButton>
        </form>
      </Card>
    </div>
  )
}
