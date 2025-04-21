"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Clock, MapPin, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import OptimizedImage from "@/components/optimized-image"
import DeliveryMap from "@/components/delivery-map"

// Order status badge colors
const statusColors = {
  RECEIVED: "bg-blue-500",
  PREPARING: "bg-yellow-500",
  READY_FOR_PICKUP: "bg-purple-500",
  OUT_FOR_DELIVERY: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
}

// Order status display names
const statusNames = {
  RECEIVED: "Order Received",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
}

interface OrderCardProps {
  order: any
  showDetails?: boolean
}

export default function OrderCard({ order, showDetails = false }: OrderCardProps) {
  const [expanded, setExpanded] = useState(showDetails)

  // Format the date
  const formattedDate = order.createdAt
    ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })
    : "Recently"

  // Get the status color and name
  const statusColor = statusColors[order.status as keyof typeof statusColors] || "bg-gray-500"
  const statusName = statusNames[order.status as keyof typeof statusNames] || order.status

  // Create a fallback image URL for the restaurant
  const restaurantFallbackImage = `/placeholder.svg?height=60&width=60&text=${encodeURIComponent(
    order.restaurant?.name || "Restaurant",
  )}`

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Order #{order.orderNumber}</h3>
              <Badge className={`${statusColor} text-white`}>{statusName}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            <OptimizedImage
              src={`/images/restaurants/${order.restaurant?.id || "rest-1"}-logo.jpg`}
              alt={order.restaurant?.name || "Restaurant"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              fallbackSrc={restaurantFallbackImage}
            />
          </div>
          <div>
            <p className="font-medium">{order.restaurant?.name || "Restaurant"}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Chandigarh University</span>
              </div>
              {order.estimatedDeliveryTime && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{order.estimatedDeliveryTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <>
            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => {
                    // Create a fallback image URL for the food item
                    const itemFallbackImage = `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(
                      item.name,
                    )}`

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          <OptimizedImage
                            src={item.image || itemFallbackImage}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            fallbackSrc={itemFallbackImage}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">
                              {item.quantity} × {item.name}
                            </p>
                            <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <p className="text-sm">
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state}{" "}
                  {order.deliveryAddress?.zipCode}
                </p>
              </div>

              {order.deliveryLocation && (
                <div className="h-48 rounded-md overflow-hidden border">
                  <DeliveryMap
                    deliveryLocation={order.deliveryLocation}
                    restaurantLocation={{ lat: 30.7601, lng: 76.5744 }} // Example restaurant location
                    driverLocation={
                      order.status === "OUT_FOR_DELIVERY"
                        ? { lat: 30.7651, lng: 76.5754 } // Example driver location
                        : undefined
                    }
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>{formatCurrency(order.serviceFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <span>Payment: </span>
                  <span>{order.paymentMethod === "CASH" ? "Cash on Delivery" : "Credit Card"}</span>
                </div>
                <div>Order ID: {order.id}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        {order.status === "OUT_FOR_DELIVERY" ? (
          <Button asChild variant="default" size="sm" className="w-full">
            <Link href={`/orders/tracking?id=${order.id}`}>
              Track Order <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        ) : (
          <Button
            variant={expanded ? "outline" : "default"}
            size="sm"
            className="w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
