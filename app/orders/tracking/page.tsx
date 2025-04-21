"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, CircleDashed, Clock, MapPin, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function OrderTrackingPage() {
  const [progress, setProgress] = useState(50)
  const [status, setStatus] = useState("Food is ready")
  const [estimatedTime, setEstimatedTime] = useState(25)

  // Simulate order progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 75) {
        setProgress(75)
        setStatus("Out for delivery")
        setEstimatedTime(15)
      } else if (progress < 100) {
        setProgress(100)
        setStatus("Delivered")
        setEstimatedTime(0)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [progress])

  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order Tracking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{status}</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-medium">Order Received</div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${progress >= 25 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {progress >= 25 ? <CheckCircle2 className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
                  </div>
                  <div className="text-xs font-medium">Preparing</div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${progress >= 50 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {progress >= 50 ? <CheckCircle2 className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
                  </div>
                  <div className="text-xs font-medium">Ready</div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${progress >= 100 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {progress >= 100 ? <CheckCircle2 className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
                  </div>
                  <div className="text-xs font-medium">Delivered</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {estimatedTime > 0 ? (
                  <span>Estimated delivery in {estimatedTime} minutes</span>
                ) : (
                  <span>Delivered</span>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">John Delivery</h3>
                      <p className="text-sm text-muted-foreground">Your delivery driver</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        123 Main Street, Apt 4B
                        <br />
                        Anytown, CA 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Order #{orderNumber}</div>
                <div className="text-sm text-muted-foreground">Italian Delights</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span>2 x</span>
                    <span>Margherita Pizza</span>
                  </div>
                  <span>$15.98</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span>1 x</span>
                    <span>Garlic Bread</span>
                  </div>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span>1 x</span>
                    <span>Tiramisu</span>
                  </div>
                  <span>$3.99</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$24.96</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>$1.99</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>$29.94</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
