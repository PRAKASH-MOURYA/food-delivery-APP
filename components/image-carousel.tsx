"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import OptimizedImage from "@/components/optimized-image"

interface ImageCarouselProps {
  images: string[]
  alt: string
  aspectRatio?: "square" | "video" | "wide" | "tall"
  className?: string
  showThumbnails?: boolean
}

export default function ImageCarousel({
  images,
  alt,
  aspectRatio = "video",
  className = "",
  showThumbnails = true,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Handle empty images array
  if (!images || images.length === 0) {
    images = [`/placeholder.svg?height=500&width=800&text=${encodeURIComponent(alt)}`]
  }

  // Ensure all images have valid URLs
  const validImages = images.map((img) =>
    img && !img.includes("blob:") && !img.includes("undefined")
      ? img
      : `/placeholder.svg?height=500&width=800&text=${encodeURIComponent(alt)}`,
  )

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-advance slides
  useEffect(() => {
    if (validImages.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, validImages.length])

  // Determine aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    tall: "aspect-[9/16]",
  }[aspectRatio]

  return (
    <div className={`relative ${className}`}>
      <div ref={carouselRef} className={`relative overflow-hidden rounded-lg ${aspectRatioClass}`}>
        {/* Main image */}
        <div className="h-full w-full">
          <OptimizedImage
            src={validImages[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="h-full w-full transition-opacity duration-500"
            objectFit="cover"
            priority={currentIndex === 0}
          />
        </div>

        {/* Navigation arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background"
              onClick={prevSlide}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background"
              onClick={nextSlide}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && validImages.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                currentIndex === index ? "border-primary" : "border-transparent"
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <OptimizedImage
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full"
                objectFit="cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
