import { requireFarmer, getUserProfile, getLands } from "@/lib/farmer/queries"
import { ProfileForm } from "@/components/farmer/profile-form"
import { LandsManager } from "@/components/farmer/lands-manager"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const { farmer } = await requireFarmer()
  const [profile, lands] = await Promise.all([getUserProfile(), getLands(farmer.id)])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information and account details.</p>
      </header>
      <ProfileForm profile={profile} farmer={farmer} />
      <LandsManager lands={lands} />
    </div>
  )
}
