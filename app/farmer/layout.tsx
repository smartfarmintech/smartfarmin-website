import { BottomNavigation } from '@/components/bottom-navigation'

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pb-24 sm:pb-0">
        {children}
      </main>
      <BottomNavigation />
    </>
  )
}
