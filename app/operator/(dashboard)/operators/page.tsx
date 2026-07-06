import { requireOwner, getOperators, getOperatorDocuments } from "@/lib/operator/queries"
import { OperatorsManager } from "@/components/operator/operators-manager"

export default async function OperatorCrewPage() {
  const { userId } = await requireOwner()
  const [operators, documents] = await Promise.all([
    getOperators(userId),
    getOperatorDocuments(userId),
  ])

  return <OperatorsManager initialOperators={operators} documents={documents} />
}
