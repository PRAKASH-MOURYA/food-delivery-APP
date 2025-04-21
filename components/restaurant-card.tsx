"use client"

import Link from "next/link"
import { Star, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import OptimizedImage from "@/components/optimized-image"
import { getRestaurantCoverImage } from "@/lib/food-images"

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    image: string
    cuisine: string[]
    rating: number
    deliveryTime: string
    deliveryFee: string
    minOrder: string
  }
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Get a high-quality restaurant image
  const highQualityImage = restaurant.image || getRestaurantCoverImage(restaurant.id)

  // Create a fallback image URL
  const fallbackImage = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(restaurant.name)}`

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md group">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <OptimizedImage
            src={highQualityImage}
            alt={restaurant.name}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            fallbackSrc={fallbackImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="line-clamp-1">{restaurant.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-1">{restaurant.cuisine.join(", ")}</p>
        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{restaurant.rating}</span>
          <span className="ml-auto">{restaurant.deliveryTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          {restaurant.deliveryFee === "₹0" ? (
            "Free Delivery"
          ) : (
            <>
              <MapPin className="h-3 w-3 inline-block mr-1" />
              {restaurant.deliveryFee}
            </>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/restaurants/${restaurant.id}`}>Order Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
