import Link from "next/link"
import { Star, MapPin, Clock, Shield, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SellerProfileCardProps {
  sellerId: string
  name: string
  rating: number
  reviewCount: number
  location: string
  joinedDate: string
  responseTime: string
  isVerified: boolean
  productCount: number
  className?: string
}

export function SellerProfileCard({
  sellerId,
  name,
  rating,
  reviewCount,
  location,
  joinedDate,
  responseTime,
  isVerified,
  productCount,
  className,
}: SellerProfileCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {name}
              {isVerified && (
                <span title="Verified Seller" className="inline-flex">
                  <Shield className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span className="sr-only">Verified Seller</span>
                </span>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg">{productCount}</div>
            <div className="text-muted-foreground">Products</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{responseTime}</div>
            <div className="text-muted-foreground">Response</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">Joined</div>
            <div className="text-muted-foreground">{joinedDate}</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {isVerified && <Badge variant="secondary">Verified Seller</Badge>}
          <Badge variant="outline">Fast Shipping</Badge>
          <Badge variant="outline">Good Communication</Badge>
        </div>

        {/* Action */}
        <Link href={`/marketplace/seller/${sellerId}`} className="block">
          <Button className="w-full gap-2">
            View Profile
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
