"use client"

import type React from "react"

import Link from "next/link"
import { Minus, Plus, ShoppingCart, Trash2, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import OptimizedImage from "@/components/optimized-image"

export default function CartSheet({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const hasItems = cart.length > 0
  const cartTotal = getCartTotal()
  const deliveryFee = 2.99
  const serviceFee = 1.99
  const total = cartTotal + deliveryFee + serviceFee

  // Group items by restaurant
  const itemsByRestaurant = cart.reduce(
    (acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName || "Unknown Restaurant",
          items: [],
        }
      }
      acc[item.restaurantId].items.push(item)
      return acc
    },
    {} as Record<string, { restaurantId: string; restaurantName: string; items: typeof cart }>,
  )

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {hasItems ? (
            <div className="space-y-6">
              {Object.values(itemsByRestaurant).map((restaurant) => (
                <div key={restaurant.restaurantId} className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Store className="h-4 w-4" />
                    <span>{restaurant.restaurantName}</span>
                  </div>

                  {restaurant.items.map((item) => {
                    const itemFallbackImage = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.name)}`

                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <OptimizedImage
                            src={item.image || itemFallbackImage}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                            fallbackSrc={itemFallbackImage}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-muted-foreground">{formatCurrency(item.price)}</div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <Separator />
                </div>
              ))}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-2 py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              <div className="text-xl font-medium">Your cart is empty</div>
              <div className="text-sm text-muted-foreground">Add items to your cart to see them here</div>
            </div>
          )}
        </div>
        <SheetFooter className="pt-2">
          <Button disabled={!hasItems} className="w-full" size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
