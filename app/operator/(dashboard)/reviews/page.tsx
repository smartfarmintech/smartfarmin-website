import { requireOwner, getReviews } from "@/lib/operator/queries"
import { ReviewsClient } from "@/components/operator/reviews-client"

export default async function OperatorReviewsPage() {
  await requireOwner()
  const reviews = await getReviews()

  return <ReviewsClient initialReviews={reviews} />
}
