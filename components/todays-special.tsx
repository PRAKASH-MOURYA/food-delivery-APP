"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Star, AlertCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSpecialOffers } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import OptimizedImage from "@/components/optimized-image"
import { getSpecialOfferImage } from "@/lib/food-images"

export default function TodaysSpecial() {
  const [specialOffers, setSpecialOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getSpecialOffers()

        // Ensure data is an array
        if (Array.isArray(data)) {
          // Enhance data with high-quality images
          const enhancedData = data.map((offer) => ({
            ...offer,
            image: offer.image || getSpecialOfferImage(offer.id),
          }))
          setSpecialOffers(enhancedData)
        } else {
          console.error("Special offers data is not an array:", data)
          setSpecialOffers([])
        }
      } catch (err) {
        console.error("Error fetching special offers:", err)
        setError("Failed to load today's special offers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialOffers()
  }, [])

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Today's Special</h2>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render empty state
  if (specialOffers.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Today's Special</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/restaurants">
              View All Restaurants <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No special offers available today. Check back later!</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Today's Special</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/restaurants">
            View All Restaurants <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialOffers.map((offer) => {
          // Create a fallback image URL
          const fallbackImage = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(offer.name)}`

          return (
            <Card key={offer.id} className="overflow-hidden h-full flex flex-col group">
              <div className="relative overflow-hidden">
                <OptimizedImage
                  src={offer.image || fallbackImage}
                  alt={offer.name}
                  width={400}
                  height={300}
                  className="w-full aspect-video object-cover transition-transform group-hover:scale-105 duration-300"
                  fallbackSrc={fallbackImage}
                  priority={true}
                />
                <Badge className="absolute top-2 right-2 bg-red-500 text-white font-medium">
                  {offer.discount}% OFF
                </Badge>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {offer.deliveryTime || "30-40 min"}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="font-medium text-lg line-clamp-1">{offer.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{offer.rating || "4.5"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>From {offer.restaurantName}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm line-through text-muted-foreground">
                        {formatCurrency(offer.originalPrice)}
                      </span>
                      <span className="ml-2 font-semibold text-primary">{formatCurrency(offer.discountedPrice)}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/restaurants/${offer.restaurantId}`}>Order Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
