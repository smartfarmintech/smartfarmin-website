import { getSessionUser, getUserProfile } from "@/lib/operator/queries"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/operator/profile-form"

export default async function OperatorProfilePage() {
  const user = await getSessionUser()
  if (!user) redirect("/operator/login")
  const profile = await getUserProfile()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account and contact details.</p>
      </div>
      <ProfileForm profile={profile} email={user.email ?? ""} />
    </div>
  )
}
