import { requireFarmer, getDocuments, getLands } from "@/lib/farmer/queries"
import { DocumentsManager } from "@/components/farmer/documents-manager"

export const dynamic = "force-dynamic"

export default async function DocumentsPage() {
  const { farmer } = await requireFarmer()
  const [documents, lands] = await Promise.all([getDocuments(farmer.id), getLands(farmer.id)])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">Keep your land records, identity, and insurance documents safe.</p>
      </header>
      <DocumentsManager documents={documents} lands={lands} />
    </div>
  )
}
