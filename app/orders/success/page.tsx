"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Check, ChevronRight, MapPin, Timer, Store, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import OptimizedImage from "@/components/optimized-image"
import { getOrderById } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Order received")
  const [estimatedTime, setEstimatedTime] = useState(35)

  useEffect(() => {
    if (!orderId) {
      router.push("/orders")
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        const orderData = await getOrderById(orderId)
        setOrder(orderData)

        // Set initial status based on order data
        if (orderData.status) {
          switch (orderData.status) {
            case "RECEIVED":
              setProgress(0)
              setStatus("Order received")
              setEstimatedTime(35)
              break
            case "PREPARING":
              setProgress(25)
              setStatus("Preparing your food")
              setEstimatedTime(30)
              break
            case "READY":
              setProgress(50)
              setStatus("Food is ready")
              setEstimatedTime(20)
              break
            case "OUT_FOR_DELIVERY":
              setProgress(75)
              setStatus("Out for delivery")
              setEstimatedTime(10)
              break
            case "DELIVERED":
              setProgress(100)
              setStatus("Delivered")
              setEstimatedTime(0)
              break
            default:
              setProgress(0)
              setStatus("Order received")
              setEstimatedTime(35)
          }
        }
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  // Simulate order progress
  useEffect(() => {
    if (!order || progress >= 75) return

    const timer = setTimeout(() => {
      if (progress < 25) {
        setProgress(25)
        setStatus("Preparing your food")
        setEstimatedTime(30)
      } else if (progress < 50) {
        setProgress(50)
        setStatus("Food is ready")
        setEstimatedTime(20)
      } else if (progress < 75) {
        setProgress(75)
        setStatus("Out for delivery")
        setEstimatedTime(10)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [progress, order])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-64 mt-4" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-5 w-64" />
              <div className="rounded-lg border p-4 mt-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex justify-between items-center w-full">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="w-fit" onClick={() => router.push("/orders")}>
              Go to Orders
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>We couldn't find the order you're looking for.</p>
            <Button variant="outline" size="sm" className="w-fit" onClick={() => router.push("/orders")}>
              Go to Orders
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const orderNumber = order.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const restaurantName = order.restaurant?.name || "Restaurant"
  const orderItems = order.items || []
  const subtotal = order.subtotal || 0
  const deliveryFee = order.deliveryFee || 2.99
  const serviceFee = order.serviceFee || 1.99
  const total = order.total || subtotal + deliveryFee + serviceFee

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-4">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your order. We'll have your delicious food to you soon!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{status}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Estimated delivery in {estimatedTime} minutes</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Store className="h-4 w-4" />
              <span className="font-medium">{restaurantName}</span>
            </div>
            <div className="rounded-lg border p-4 mt-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.deliveryAddress?.street || "123 Main Street"},{order.deliveryAddress?.city || "Anytown"},
                    {order.deliveryAddress?.state || "CA"}
                    {order.deliveryAddress?.zipCode || "12345"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/orders/tracking?orderNumber=${orderNumber}`}>
                Track Order
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{order.paymentMethod || "Credit Card"}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              {orderItems.map((item: any, index: number) => {
                const itemFallbackImage = `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(item.name)}`

                return (
                  <div key={index} className="flex items-center gap-3">
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
                        <span>{item.name}</span>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/restaurants">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
