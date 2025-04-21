"use client"

import { useState } from "react"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import OptimizedImage from "@/components/optimized-image"
import { useToast } from "@/components/ui/use-toast"
import { getFoodImageById } from "@/lib/food-images"

interface FoodItemProps {
  id: string
  restaurantId: string
  restaurantName: string
  name: string
  description?: string
  price: number
  image: string
  category?: string
  popular?: boolean
}

export default function FoodItemCard({
  id,
  restaurantId,
  restaurantName,
  name,
  description,
  price,
  image,
  category = "Food",
  popular = false,
}: FoodItemProps) {
  const { addToCart, cart, updateQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.id === id)
  const isInCart = !!cartItem

  // Get a high-quality food image based on the item's ID and category
  const highQualityImage = getFoodImageById(id, category)

  // Create a fallback image URL
  const fallbackImage = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name)}`

  const handleAddToCart = () => {
    addToCart({
      id,
      restaurantId,
      name,
      price,
      image: highQualityImage || image || fallbackImage,
      restaurantName,
    })

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (cartItem) {
      updateQuantity(id, newQuantity)
    }
  }

  const incrementQuantity = () => {
    if (isInCart) {
      handleUpdateCartQuantity(cartItem.quantity + 1)
    } else {
      setQuantity((prev) => Math.min(prev + 1, 10))
    }
  }

  const decrementQuantity = () => {
    if (isInCart) {
      handleUpdateCartQuantity(Math.max(cartItem.quantity - 1, 1))
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1))
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-video">
        <OptimizedImage
          src={highQualityImage || image || fallbackImage}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          fallbackSrc={fallbackImage}
        />
        {popular && <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Popular</Badge>}
        {category && (
          <Badge variant="outline" className="absolute bottom-2 left-2 bg-background/80">
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{name}</h3>
          <span className="font-semibold">{formatCurrency(price)}</span>
        </div>
        {description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>}
        <p className="text-xs text-muted-foreground">From {restaurantName}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={decrementQuantity}
            disabled={(isInCart ? cartItem.quantity : quantity) <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{isInCart ? cartItem.quantity : quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={incrementQuantity}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {!isInCart ? (
          <Button className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Update Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
