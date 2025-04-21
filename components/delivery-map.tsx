"use client"

import { useEffect, useRef } from "react"

interface DeliveryMapProps {
  deliveryLocation: {
    lat: number
    lng: number
  }
  restaurantLocation?: {
    lat: number
    lng: number
  }
  driverLocation?: {
    lat: number
    lng: number
  }
  height?: string
}

export default function DeliveryMap({
  deliveryLocation,
  restaurantLocation = { lat: 30.7671, lng: 76.5744 }, // Default near Chandigarh University
  driverLocation,
  height = "300px",
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create a simple map visualization
    const mapContainer = mapRef.current
    mapContainer.innerHTML = ""
    mapContainer.style.height = height
    mapContainer.style.position = "relative"
    mapContainer.style.overflow = "hidden"
    mapContainer.style.borderRadius = "0.5rem"
    mapContainer.style.backgroundColor = "#e5e7eb"

    // Create map background
    const mapBg = document.createElement("div")
    mapBg.style.position = "absolute"
    mapBg.style.inset = "0"
    mapBg.style.backgroundImage = "url('/placeholder.svg?height=600&width=800&text=Map')"
    mapBg.style.backgroundSize = "cover"
    mapBg.style.backgroundPosition = "center"
    mapBg.style.opacity = "0.8"
    mapContainer.appendChild(mapBg)

    // Add grid lines to simulate a map
    const grid = document.createElement("div")
    grid.style.position = "absolute"
    grid.style.inset = "0"
    grid.style.backgroundImage =
      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
    grid.style.backgroundSize = "20px 20px"
    mapContainer.appendChild(grid)

    // Add delivery location marker
    const deliveryMarker = document.createElement("div")
    deliveryMarker.className = "absolute flex flex-col items-center"
    deliveryMarker.style.left = "70%"
    deliveryMarker.style.top = "40%"
    deliveryMarker.innerHTML = `
      <div class="relative">
        <div class="absolute -top-1 -left-1 w-10 h-10 bg-primary/20 rounded-full animate-ping"></div>
        <div class="relative z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
          Delivery Location
        </div>
      </div>
    `
    mapContainer.appendChild(deliveryMarker)

    // Add restaurant marker
    const restaurantMarker = document.createElement("div")
    restaurantMarker.className = "absolute flex items-center justify-center"
    restaurantMarker.style.left = "30%"
    restaurantMarker.style.top = "60%"
    restaurantMarker.innerHTML = `
      <div class="relative">
        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 11H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
            <path d="M11 11V9c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2"></path>
            <path d="M15 17v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2"></path>
            <path d="m21 13-.3-1.5A2 2 0 0 0 18.8 10H16"></path>
            <path d="M3 13h.2a2 2 0 0 0 1.9 1.5"></path>
          </svg>
        </div>
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
          Restaurant
        </div>
      </div>
    `
    mapContainer.appendChild(restaurantMarker)

    // Add driver marker if available
    if (driverLocation) {
      const driverMarker = document.createElement("div")
      driverMarker.className = "absolute flex items-center justify-center"
      driverMarker.style.left = "50%"
      driverMarker.style.top = "50%"
      driverMarker.innerHTML = `
        <div class="relative">
          <div class="absolute -top-1 -left-1 w-10 h-10 bg-blue-400/20 rounded-full animate-ping"></div>
          <div class="relative z-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.2 2 11.4V15"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
            Delivery Partner
          </div>
        </div>
      `
      mapContainer.appendChild(driverMarker)

      // Add route line
      const routeLine = document.createElement("div")
      routeLine.className = "absolute"
      routeLine.style.left = "30%"
      routeLine.style.top = "60%"
      routeLine.style.width = "20%"
      routeLine.style.height = "10%"
      routeLine.style.borderTop = "3px dashed #3b82f6"
      routeLine.style.borderRight = "3px dashed #3b82f6"
      mapContainer.appendChild(routeLine)

      const routeLine2 = document.createElement("div")
      routeLine2.className = "absolute"
      routeLine2.style.left = "50%"
      routeLine2.style.top = "50%"
      routeLine2.style.width = "20%"
      routeLine2.style.height = "10%"
      routeLine2.style.borderBottom = "3px dashed #3b82f6"
      routeLine2.style.borderRight = "3px dashed #3b82f6"
      mapContainer.appendChild(routeLine2)
    } else {
      // Just show a direct route from restaurant to delivery
      const routeLine = document.createElement("div")
      routeLine.className = "absolute"
      routeLine.style.left = "30%"
      routeLine.style.top = "60%"
      routeLine.style.width = "40%"
      routeLine.style.height = "20%"
      routeLine.style.borderTop = "3px dashed #6366f1"
      routeLine.style.borderRight = "3px dashed #6366f1"
      mapContainer.appendChild(routeLine)
    }

    // Add a compass
    const compass = document.createElement("div")
    compass.className = "absolute top-2 right-2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
    compass.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"></path>
        <path d="M22 2 11 13"></path>
      </svg>
    `
    mapContainer.appendChild(compass)

    // Add a scale
    const scale = document.createElement("div")
    scale.className = "absolute bottom-2 left-2 bg-white/80 rounded-md px-2 py-1 text-xs"
    scale.innerHTML = `500m`
    mapContainer.appendChild(scale)
  }, [deliveryLocation, restaurantLocation, driverLocation, height])

  return (
    <div className="rounded-lg overflow-hidden border border-muted">
      <div ref={mapRef} className="w-full bg-muted" style={{ height }}></div>
    </div>
  )
}
