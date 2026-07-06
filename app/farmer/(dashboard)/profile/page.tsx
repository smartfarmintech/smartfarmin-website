import { requireFarmer, getUserProfile } from "@/lib/farmer/queries"
import { ProfileForm } from "@/components/farmer/profile-form"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const { farmer } = await requireFarmer()
  const profile = await getUserProfile()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information and account details.</p>
      </header>
      <ProfileForm profile={profile} farmer={farmer} />
    </div>
  )
}
