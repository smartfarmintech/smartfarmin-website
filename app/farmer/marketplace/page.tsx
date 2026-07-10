import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MarketplaceContent } from '@/components/marketplace/marketplace-content'

export const metadata = {
  title: 'Marketplace | Rythu360',
  description: 'Buy seeds, fertilizers, equipment and more for your farm',
}

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <MarketplaceContent />
      </main>

      <SiteFooter />
    </div>
  )
}
