import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function WelcomeCard({ farmer }: any) {
  const firstName = farmer.farmer_profiles?.first_name || 'Farmer'
  
  return (
    <Card className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back, {firstName}!</CardTitle>
        <CardDescription>Manage your farm and grow your business with Rythu360</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/dashboard/farmer/fields">
              View Your Fields
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/help">Learn More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
