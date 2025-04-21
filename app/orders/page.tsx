"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { getUserOrders } from "@/lib/api"
import OrderCard from "@/components/order-card"

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getUserOrders()

        // Add delivery location to orders if not present
        const ordersWithLocation = data.map((order: any) => {
          if (!order.deliveryLocation) {
            return {
              ...order,
              deliveryLocation: { lat: 30.7691, lng: 76.5764 }, // Default location (Chandigarh University)
            }
          }
          return order
        })

        setOrders(ordersWithLocation)
        setLoading(false)
      } catch (err) {
        setError("Failed to load orders")
        setLoading(false)
        console.error(err)
      }
    }

    fetchOrders()
  }, [user, router])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Filter orders by status
  const activeOrders = orders.filter((order) =>
    ["RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(order.status),
  )

  const pastOrders = orders.filter((order) => ["DELIVERED", "CANCELLED"].includes(order.status))

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You don't have any orders yet.</p>
              <Button asChild>
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You don't have any active orders.</p>
              <Button asChild>
                <Link href="/restaurants">Order Now</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {pastOrders.length > 0 ? (
            pastOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You don't have any past orders.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
