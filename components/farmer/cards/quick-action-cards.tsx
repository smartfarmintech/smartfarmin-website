import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export function QuickActionCard({ 
  title, 
  description, 
  icon, 
  href, 
  color 
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${color}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="text-2xl">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function GovernmentSchemesCard({ farmer }: any) {
  return (
    <QuickActionCard
      title="Government Schemes"
      description="View eligible benefits"
      icon="📋"
      href="/dashboard/farmer/schemes"
      color="bg-blue-50 dark:bg-blue-950"
    />
  )
}

export function MachineryBookingCard({ farmer }: any) {
  return (
    <QuickActionCard
      title="Machinery Booking"
      description="Rent farming equipment"
      icon="🔧"
      href="/dashboard/farmer/machinery"
      color="bg-orange-50 dark:bg-orange-950"
    />
  )
}

export function DroneBookingCard({ farmer }: any) {
  return (
    <QuickActionCard
      title="Drone Booking"
      description="Aerial farm services"
      icon="🚁"
      href="/dashboard/farmer/drones"
      color="bg-purple-50 dark:bg-purple-950"
    />
  )
}

export function MarketplaceCard() {
  return (
    <QuickActionCard
      title="Marketplace"
      description="Buy farm products"
      icon="🛒"
      href="/dashboard/farmer/marketplace"
      color="bg-pink-50 dark:bg-pink-950"
    />
  )
}

export function OrganicStoreCard() {
  return (
    <QuickActionCard
      title="Organic Store"
      description="Certified organic products"
      icon="🥬"
      href="/dashboard/farmer/organic"
      color="bg-green-50 dark:bg-green-950"
    />
  )
}

export function WalletCard({ farmer }: any) {
  return (
    <QuickActionCard
      title="Wallet"
      description="Manage your balance"
      icon="💰"
      href="/dashboard/farmer/wallet"
      color="bg-yellow-50 dark:bg-yellow-950"
    />
  )
}
