"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, AlertCircle, RefreshCw } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import RestaurantCard from "@/components/restaurant-card"
import { getRestaurants, getRestaurantsByCuisine, searchRestaurants } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function RestaurantsPage() {
  const cuisines = ["All", "Pizza", "Burgers", "Sushi", "Chinese", "Italian", "Mexican", "Indian"]
  const [activeTab, setActiveTab] = useState("All")
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRestaurants()

      if (!data || data.length === 0) {
        throw new Error("No restaurants found")
      }

      // Ensure all restaurants have valid image paths or fallbacks
      const processedData = data.map((restaurant: any) => {
        if (!restaurant.image || restaurant.image.includes("blob:")) {
          // Replace blob URLs or missing images with placeholder
          restaurant.image = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(restaurant.name)}`
        }
        return restaurant
      })

      setRestaurants(processedData)
      setFilteredRestaurants(processedData)
    } catch (err) {
      console.error("Error fetching restaurants:", err)
      setError("Failed to load restaurants. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    const fetchRestaurantsByCuisine = async () => {
      if (activeTab === "All") {
        setFilteredRestaurants(restaurants)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getRestaurantsByCuisine(activeTab)

        if (!data || data.length === 0) {
          setFilteredRestaurants([])
          return
        }

        // Process images same as above
        const processedData = data.map((restaurant: any) => {
          if (!restaurant.image || restaurant.image.includes("blob:")) {
            restaurant.image = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(restaurant.name)}`
          }
          return restaurant
        })

        setFilteredRestaurants(processedData)
      } catch (err) {
        console.error("Error filtering restaurants:", err)
        setError("Failed to filter restaurants. Please try again later.")
        // Fallback to showing all restaurants
        setFilteredRestaurants(restaurants)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantsByCuisine()
  }, [activeTab, restaurants])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants)
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      const data = await searchRestaurants(searchQuery)

      if (!data || data.length === 0) {
        setFilteredRestaurants([])
        return
      }

      // Process images
      const processedData = data.map((restaurant: any) => {
        if (!restaurant.image || restaurant.image.includes("blob:")) {
          restaurant.image = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(restaurant.name)}`
        }
        return restaurant
      })

      setFilteredRestaurants(processedData)
    } catch (err) {
      console.error("Error searching restaurants:", err)
      setError("Failed to search restaurants. Please try again later.")
      // Fallback to showing all restaurants
      setFilteredRestaurants(restaurants)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRetry = () => {
    if (searchQuery) {
      handleSearch(new Event("submit") as any)
    } else if (activeTab !== "All") {
      setActiveTab("All")
    } else {
      // Reload restaurants
      fetchRestaurants()
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for restaurants or cuisines"
                className="pl-8 w-full md:w-1/2 lg:w-1/3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading || isSearching}
              />
            </div>
          </form>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <Button variant="outline" size="sm" className="w-fit flex items-center gap-2" onClick={handleRetry}>
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            {cuisines.map((cuisine) => (
              <TabsTrigger
                key={cuisine}
                value={cuisine}
                className="rounded-full border bg-background px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={loading || isSearching}
              >
                {cuisine}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-md overflow-hidden border">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No restaurants found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("All")
                    setFilteredRestaurants(restaurants)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
