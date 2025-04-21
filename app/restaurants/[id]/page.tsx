"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Clock, MapPin, Star, AlertCircle, ArrowLeft, Heart, Share, Info, Phone, Globe, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/components/cart-provider"
import { getRestaurantById, getMenuItemsByRestaurant } from "@/lib/api"
import OptimizedImage from "@/components/optimized-image"
import ImageCarousel from "@/components/image-carousel"
import FoodItemCard from "@/components/food-item-card"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getFoodImageById, getRestaurantImages } from "@/lib/food-images"

// High-quality restaurant images
const restaurantImages = {
  "rest-1": [
    "/images/restaurants/pizza-restaurant-1.jpg",
    "/images/restaurants/pizza-restaurant-2.jpg",
    "/images/restaurants/pizza-restaurant-3.jpg",
    "/images/restaurants/pizza-restaurant-4.jpg",
  ],
  "rest-2": [
    "/images/restaurants/burger-restaurant-1.jpg",
    "/images/restaurants/burger-restaurant-2.jpg",
    "/images/restaurants/burger-restaurant-3.jpg",
    "/images/restaurants/burger-restaurant-4.jpg",
  ],
  "rest-3": [
    "/images/restaurants/sushi-restaurant-1.jpg",
    "/images/restaurants/sushi-restaurant-2.jpg",
    "/images/restaurants/sushi-restaurant-3.jpg",
    "/images/restaurants/sushi-restaurant-4.jpg",
  ],
  "rest-4": [
    "/images/restaurants/taco-restaurant-1.jpg",
    "/images/restaurants/taco-restaurant-2.jpg",
    "/images/restaurants/taco-restaurant-3.jpg",
    "/images/restaurants/taco-restaurant-4.jpg",
  ],
}

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState("menu")
  const [restaurant, setRestaurant] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // Function to process menu item images
  const processMenuItemImage = useCallback((item: any) => {
    if (!item.image || item.image.includes("blob:")) {
      item.image = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(item.name)}`
    }
    return item
  }, [])

  // Update the useEffect hook to handle errors better
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching restaurant with ID:", params.id)
        const restaurantData = await getRestaurantById(params.id as string)

        if (!restaurantData) {
          throw new Error("Restaurant data is empty")
        }

        // Use high-quality images for the restaurant gallery
        const restaurantId = params.id as string
        const highQualityImages = getRestaurantImages(restaurantId)

        // Add images to restaurant data
        restaurantData.images = highQualityImages

        setRestaurant(restaurantData)

        // Only fetch menu items if we have a valid restaurant
        const menuItemsData = await getMenuItemsByRestaurant(params.id as string)

        // Process menu item images
        const processedMenuItems = (menuItemsData || []).map((item: any) => {
          // Add high-quality images to menu items
          item.image = getFoodImageById(item.id, item.category)
          return item
        })

        setMenuItems(processedMenuItems)
      } catch (err) {
        console.error("Error fetching restaurant data:", err)
        setError(`Failed to load restaurant data. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleRetry = () => {
    // Reload the current page data
    window.location.reload()
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? `${restaurant.name} has been removed from your favorites.`
        : `${restaurant.name} has been added to your favorites.`,
      duration: 3000,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} on FoodDelivery!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Restaurant link copied to clipboard",
        duration: 3000,
      })
    }
  }

  // Create a fallback image URL
  const fallbackImage = restaurant
    ? `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(restaurant.name)}`
    : "/placeholder.svg?height=400&width=800&text=Restaurant"

  // Render loading
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>

          <Skeleton className="w-full h-[400px] rounded-xl" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="mt-4">
              <div className="flex border-b">
                <Skeleton className="h-10 w-16 mx-2" />
                <Skeleton className="h-10 w-16 mx-2" />
                <Skeleton className="h-10 w-16 mx-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 border rounded-lg">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render error
  if (error || !restaurant) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error || "Restaurant not found"}</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/restaurants">Browse Other Restaurants</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Group menu items by category
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/restaurants">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        </div>

        <div className="relative w-full overflow-hidden rounded-xl">
          <ImageCarousel images={restaurant.images} alt={restaurant.name} aspectRatio="wide" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleShare}
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>1.2 miles away</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {restaurant.cuisine.map((cuisine: string) => (
                  <Badge key={cuisine} variant="secondary">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Delivery fee: {restaurant.deliveryFee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Minimum order: {restaurant.minOrder}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
              <TabsTrigger
                value="menu"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Menu
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="mt-6">
              <div className="flex flex-col gap-8">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <h2 className="text-xl font-semibold" id={`category-${category}`}>
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <FoodItemCard
                              key={item.id}
                              id={item.id}
                              restaurantId={restaurant.id}
                              restaurantName={restaurant.name}
                              name={item.name}
                              description={item.description}
                              price={item.price}
                              image={item.image}
                              category={item.category}
                              popular={item.id % 3 === 0} // Just for demo purposes
                            />
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No menu items available for this restaurant.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurant.images.map((image: string, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={image}
                      alt={`${restaurant.name} - Gallery image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover aspect-video"
                      fallbackSrc={fallbackImage}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary text-2xl font-bold">
                    {restaurant.rating}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(restaurant.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1">Based on 120+ reviews</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah J.",
                      rating: 5,
                      date: "2 days ago",
                      comment:
                        "Amazing food and quick delivery! The pasta was perfectly cooked and the sauce was delicious.",
                      avatar: "/images/avatars/avatar-1.jpg",
                    },
                    {
                      name: "Michael T.",
                      rating: 4,
                      date: "1 week ago",
                      comment: "Good food, but delivery took a bit longer than expected. Would order again though!",
                      avatar: "/images/avatars/avatar-2.jpg",
                    },
                    {
                      name: "Emily R.",
                      rating: 5,
                      date: "2 weeks ago",
                      comment:
                        "Best Italian food in the area! The garlic bread is to die for and the pizza is authentic.",
                      avatar: "/images/avatars/avatar-3.jpg",
                    },
                  ].map((review, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <OptimizedImage
                              src={review.avatar}
                              alt={review.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              fallbackSrc={`/placeholder.svg?height=40&width=40&text=${review.name[0]}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{review.name}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="info" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <Clock className="h-5 w-5 text-primary" />
                          Hours
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>11:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday - Sunday</span>
                            <span>10:00 AM - 11:00 PM</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          Address
                        </h3>
                        <p className="text-sm">123 Main Street, Anytown, CA 12345</p>
                        <Button variant="link" className="p-0 h-auto text-sm mt-2">
                          Get Directions
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <Phone className="h-5 w-5 text-primary" />
                          Contact
                        </h3>
                        <p className="text-sm">
                          Phone: (123) 456-7890
                          <br />
                          Email: info@{restaurant.name.toLowerCase().replace(/\s/g, "")}.com
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <Globe className="h-5 w-5 text-primary" />
                          Website
                        </h3>
                        <a
                          href={`https://${restaurant.name.toLowerCase().replace(/\s/g, "")}.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {restaurant.name.toLowerCase().replace(/\s/g, "")}.com
                        </a>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold flex items-center gap-2 mb-3">
                        <Info className="h-5 w-5 text-primary" />
                        About
                      </h3>
                      <p className="text-sm">
                        {restaurant.name} offers a delightful dining experience with a focus on{" "}
                        {restaurant.cuisine.join(", ")} cuisine. Our chefs use only the freshest ingredients to create
                        authentic dishes that will transport your taste buds. Whether you're dining in or ordering for
                        delivery, we promise a memorable culinary experience.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
