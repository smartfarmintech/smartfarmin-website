import { requireOwner, getPricingRules, getMachines } from "@/lib/operator/queries"
import { PricingManager } from "@/components/operator/pricing-manager"

export default async function OperatorPricingPage() {
  const { userId } = await requireOwner()
  const [rules, machines] = await Promise.all([getPricingRules(), getMachines(userId)])

  return <PricingManager initialRules={rules} machines={machines} />
}
