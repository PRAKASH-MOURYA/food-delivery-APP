import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import RestaurantCard from "@/components/restaurant-card"
import ImageCarousel from "@/components/image-carousel"
import TodaysSpecial from "@/components/todays-special"
import { restaurants } from "@/lib/data"
import OptimizedImage from "@/components/optimized-image"
import { getRestaurantCoverImage } from "@/lib/food-images"

// High-quality hero images
const heroImages = [
  "/images/hero/cu-food-hero-1.jpg",
  "/images/hero/cu-food-hero-2.jpg",
  "/images/hero/cu-food-hero-3.jpg",
]

// Food categories with images
const categories = [
  { name: "Pizza", image: "/images/categories/pizza.jpg" },
  { name: "Burger", image: "/images/categories/burger.jpg" },
  { name: "Biryani", image: "/images/categories/biryani.jpg" },
  { name: "North Indian", image: "/images/categories/north-indian.jpg" },
  { name: "South Indian", image: "/images/categories/south-indian.jpg" },
  { name: "Chinese", image: "/images/categories/chinese.jpg" },
  { name: "Desserts", image: "/images/categories/desserts.jpg" },
  { name: "Beverages", image: "/images/categories/beverages.jpg" },
]

export default function Home() {
  // Get featured restaurants (top 4 by rating)
  const featuredRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map((restaurant) => ({
      ...restaurant,
      // Add high-quality cover image
      image: getRestaurantCoverImage(restaurant.id),
    }))

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[500px] overflow-hidden">
          <ImageCarousel images={heroImages} alt="Food delivery" aspectRatio="wide" showThumbnails={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
            <div className="container">
              <div className="max-w-lg text-white space-y-4">
                <h1 className="text-4xl font-bold">Food Delivery for Chandigarh University</h1>
                <p className="text-lg">Delicious food delivered to your hostel, classroom, or anywhere on campus.</p>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/restaurants">Order Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 space-y-12">
        {/* Today's Special Section */}
        <section>
          <TodaysSpecial />
        </section>

        {/* Categories Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button variant="outline" asChild>
              <Link href="/restaurants">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/restaurants?category=${category.name.toLowerCase()}`} className="group">
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    <OptimizedImage
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      fallbackSrc={`/placeholder.svg?height=200&width=200&text=${encodeURIComponent(category.name)}`}
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <Button variant="outline" asChild>
              <Link href="/restaurants">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-8">
          <div className="bg-primary/5 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose a Restaurant</h3>
                <p className="text-muted-foreground">
                  Browse restaurants serving Chandigarh University or search for your favorite food
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Select Your Dishes</h3>
                <p className="text-muted-foreground">
                  Choose from a variety of delicious meals and add them to your cart
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Delivery to Your Location</h3>
                <p className="text-muted-foreground">
                  Get your food delivered to your hostel, classroom, or anywhere on campus
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
