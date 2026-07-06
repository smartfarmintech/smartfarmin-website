"use client"

import { useState } from "react"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  helpful: number
  unhelpful: number
  date: string
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
  reviews: Review[]
}

export function ProductReviews({
  productId,
  averageRating,
  totalReviews,
  ratingDistribution,
  reviews,
}: ProductReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmitReview = async () => {
    // TODO: Connect to real API
    setShowWriteReview(false)
    setTitle("")
    setComment("")
    setRating(5)
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs w-8">{stars} star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs w-12 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Write Review Button */}
          <Button
            className="w-full"
            onClick={() => setShowWriteReview(!showWriteReview)}
          >
            {showWriteReview ? "Cancel" : "Write a Review"}
          </Button>

          {/* Review Form */}
          {showWriteReview && (
            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 cursor-pointer transition-colors",
                          r <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground hover:text-amber-400"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  placeholder="Summary of your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Review</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSubmitReview} className="w-full">
                Submit Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{review.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {review.author} on {review.date}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-3">{review.comment}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                >
                  <ThumbsUp className="h-3 w-3" />
                  Helpful ({review.helpful})
                </Button>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Flag className="h-3 w-3" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
