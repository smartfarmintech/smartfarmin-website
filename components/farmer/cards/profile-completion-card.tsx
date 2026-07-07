import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

export function ProfileCompletionCard({ farmer }: any) {
  // Calculate profile completion percentage
  const profile = farmer.farmer_profiles
  const userProfile = farmer.user_profiles

  let completionScore = 0
  if (userProfile?.full_name) completionScore += 20
  if (userProfile?.avatar_url) completionScore += 15
  if (profile?.aadhaar_hash) completionScore += 15
  if (profile?.bank_name) completionScore += 15
  if (profile?.pan_number) completionScore += 15
  if (profile?.upi_id) completionScore += 10
  if (profile?.is_insured) completionScore += 10

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
        <CardDescription>{completionScore}% Complete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionScore} className="h-2" />
        {completionScore < 100 && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/dashboard/farmer/profile">Complete Profile</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
