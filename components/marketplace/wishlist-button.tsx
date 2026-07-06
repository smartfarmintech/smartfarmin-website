"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  initialWishlisted?: boolean
}

export function WishlistButton({ productId, initialWishlisted = false }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleWishlist = async () => {
    setIsLoading(true)
    try {
      // TODO: Connect to real API
      setIsWishlisted(!isWishlisted)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isWishlisted && "fill-current text-red-500"
        )}
      />
      {isWishlisted ? "Wishlisted" : "Wishlist"}
    </Button>
  )
}
