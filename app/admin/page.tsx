"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, Clock, Home, LayoutDashboard, Package, Settings, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { restaurants, menuItems } from "@/lib/data"

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!user || !user.isAdmin) {
    router.push("/")
    return null
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "orders" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={activeTab === "restaurants" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("restaurants")}
              >
                <Home className="mr-2 h-4 w-4" />
                Restaurants
              </Button>
              <Button
                variant={activeTab === "menu" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("menu")}
              >
                <Package className="mr-2 h-4 w-4" />
                Menu Items
              </Button>
              <Button
                variant={activeTab === "customers" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("customers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button
                variant={activeTab === "analytics" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full space-y-6">
            <div className="md:hidden">
              <TabsList className="grid grid-cols-3 gap-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="dashboard" className="h-full flex-col border-none p-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12</div>
                    <p className="text-xs text-muted-foreground">+19% from last hour</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{restaurants.length}</div>
                    <p className="text-xs text-muted-foreground">+2 new this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 since last week</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      Chart placeholder
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>You have 12 orders in progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Order #{Math.floor(100000 + Math.random() * 900000)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {["Pizza", "Burger", "Sushi"][i - 1]} • ${(Math.random() * 50 + 10).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{Math.floor(Math.random() * 30) + 5} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="orders" className="h-full flex-col border-none p-0">
              <div className="border rounded-md">
                <div className="grid grid-cols-6 border-b p-4 font-medium">
                  <div>Order ID</div>
                  <div>Customer</div>
                  <div>Restaurant</div>
                  <div>Total</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-6 p-4 items-center">
                      <div>ORD-{Math.floor(100000 + Math.random() * 900000)}</div>
                      <div>Customer {i + 1}</div>
                      <div>{restaurants[i % restaurants.length].name}</div>
                      <div>${(Math.random() * 50 + 10).toFixed(2)}</div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          {["Delivered", "In Progress", "Preparing", "Out for Delivery", "Received"][i]}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="restaurants" className="h-full flex-col border-none p-0">
              <div className="flex justify-end mb-4">
                <Button>Add Restaurant</Button>
              </div>
              <div className="border rounded-md">
                <div className="grid grid-cols-5 border-b p-4 font-medium">
                  <div>Name</div>
                  <div>Cuisine</div>
                  <div>Rating</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {restaurants.map((restaurant, i) => (
                    <div key={i} className="grid grid-cols-5 p-4 items-center">
                      <div>{restaurant.name}</div>
                      <div>{restaurant.cuisine.join(", ")}</div>
                      <div>{restaurant.rating}</div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="menu" className="h-full flex-col border-none p-0">
              <div className="flex justify-end mb-4">
                <Button>Add Menu Item</Button>
              </div>
              <div className="border rounded-md">
                <div className="grid grid-cols-6 border-b p-4 font-medium">
                  <div>Name</div>
                  <div>Restaurant</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {menuItems.slice(0, 5).map((item, i) => (
                    <div key={i} className="grid grid-cols-6 p-4 items-center">
                      <div>{item.name}</div>
                      <div>{restaurants.find((r) => r.id === item.restaurantId)?.name}</div>
                      <div>{item.category}</div>
                      <div>${item.price.toFixed(2)}</div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
