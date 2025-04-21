"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CreditCard, MapPin, Store, AlertCircle, ArrowLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { formatCurrency } from "@/lib/utils"
import { getUserAddresses, createOrder, convertCartToOrderItems, addUserAddress } from "@/lib/api"
import OptimizedImage from "@/components/optimized-image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CheckoutForm() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false)
  const [newAddressData, setNewAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
    isDefault: false,
  })
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/restaurants")
      return
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserAddresses()
        setAddresses(data)
        if (data.length > 0) {
          // Select default address or first address
          const defaultAddress = data.find((addr) => addr.isDefault) || data[0]
          setSelectedAddressId(defaultAddress.id)
        }
      } catch (err) {
        console.error("Failed to load addresses:", err)
        setError("Failed to load your delivery addresses. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [user, router, cart.length])

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

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAddressData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddNewAddress = async () => {
    if (!newAddressData.street || !newAddressData.city || !newAddressData.state || !newAddressData.zipCode) {
      return
    }

    try {
      const newAddress = await addUserAddress(newAddressData)
      setAddresses((prev) => [...prev, newAddress])
      setSelectedAddressId(newAddress.id)
      setIsAddAddressDialogOpen(false)
      setNewAddressData({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        instructions: "",
        isDefault: false,
      })
    } catch (err) {
      console.error("Failed to add address:", err)
    }
  }

  const validateCardDetails = () => {
    if (paymentMethod !== "CREDIT_CARD") return true

    const { cardNumber, cardName, expiry, cvc } = cardDetails

    if (!cardNumber.trim()) {
      setOrderError("Please enter your card number")
      return false
    }

    if (!cardName.trim()) {
      setOrderError("Please enter the name on your card")
      return false
    }

    if (!expiry.trim()) {
      setOrderError("Please enter your card's expiry date")
      return false
    }

    if (!cvc.trim()) {
      setOrderError("Please enter your card's security code")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError(null)

    if (!selectedAddressId) {
      setOrderError("Please select a delivery address")
      return
    }

    if (!validateCardDetails()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Get restaurant ID from first item in cart
      const restaurantId = cart[0].restaurantId

      // Create order
      const orderData = {
        restaurantId,
        deliveryAddressId: selectedAddressId,
        items: convertCartToOrderItems(cart),
        paymentMethod,
        deliveryInstructions,
      }

      const order = await createOrder(orderData)
      clearCart()
      router.push(`/orders/success?orderId=${order.id}`)
    } catch (err) {
      console.error("Failed to create order:", err)
      setOrderError("Failed to place your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 rounded-md border p-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 rounded-md border p-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2 pl-6">
                      {Array.from({ length: 2 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="flex justify-between items-center w-full">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Skeleton className="h-px w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {orderError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Order Error</AlertTitle>
          <AlertDescription>{orderError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={address.id} id={`address-${address.id}`} />
                        <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">{address.isDefault ? "Default Address" : "Address"}</div>
                            <div className="text-sm text-muted-foreground">
                              {address.street}, {address.city}, {address.state} {address.zipCode}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-4">You don't have any saved addresses.</p>
                    <Button onClick={() => setIsAddAddressDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Address
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="E.g., Ring the doorbell, leave at the door, etc."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  defaultValue="CREDIT_CARD"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="CREDIT_CARD" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Credit / Debit Card
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-10 rounded bg-muted" />
                      <div className="h-6 w-10 rounded bg-muted" />
                      <div className="h-6 w-10 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="PAYPAL" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <div className="h-6 w-10 rounded bg-muted" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="CASH" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "CREDIT_CARD" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleCardDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleCardDetailsChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" value={cardDetails.cvc} onChange={handleCardDetailsChange} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    `Place Order • ${formatCurrency(total)}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.values(itemsByRestaurant).map((restaurant) => (
                <div key={restaurant.restaurantId} className="space-y-3">
                  <div className="flex items-center gap-2 font-medium">
                    <Store className="h-4 w-4" />
                    <span>{restaurant.restaurantName}</span>
                  </div>

                  <div className="space-y-2 pl-6">
                    {restaurant.items.map((item) => {
                      const itemFallbackImage = `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(item.name)}`

                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={item.image || itemFallbackImage}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                              fallbackSrc={itemFallbackImage}
                            />
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex gap-2">
                              <span>{item.quantity} x</span>
                              <span className="line-clamp-1">{item.name}</span>
                            </div>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>Add a new delivery address to your account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                name="street"
                value={newAddressData.street}
                onChange={handleNewAddressChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={newAddressData.city} onChange={handleNewAddressChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={newAddressData.state}
                  onChange={handleNewAddressChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={newAddressData.zipCode}
                onChange={handleNewAddressChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={newAddressData.instructions}
                onChange={handleNewAddressChange}
                placeholder="E.g., Ring the doorbell, leave at the door, etc."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddressData.isDefault}
                onChange={(e) => setNewAddressData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault">Set as default address</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewAddress}>Add Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
