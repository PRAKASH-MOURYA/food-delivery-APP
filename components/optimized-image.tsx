"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  fallbackSrc?: string
}

export default function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  priority = false,
  objectFit = "cover",
  fallbackSrc,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [supportsWebp, setSupportsWebp] = useState(false)

  // Check for WebP support
  useEffect(() => {
    const checkWebpSupport = async () => {
      const webpSupported = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0
      setSupportsWebp(webpSupported)
    }
    checkWebpSupport()
  }, [])

  // Handle blob URLs or invalid URLs
  useEffect(() => {
    if (src && (src.startsWith("blob:") || src.includes("undefined"))) {
      setImgSrc(fallbackSrc || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
    } else {
      setImgSrc(src)
    }
  }, [src, fallbackSrc, height, width, alt])

  // Generate WebP URL if supported and original is not already WebP
  const imageUrl =
    supportsWebp && !imgSrc.endsWith(".webp") && !imgSrc.startsWith("/placeholder")
      ? `${imgSrc.split(".")[0]}.webp`
      : imgSrc

  // For external images or placeholder SVGs
  if (imgSrc.startsWith("http") || imgSrc.startsWith("/placeholder")) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "auto" }}>
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? "animate-pulse bg-muted" : ""}`}
          style={{ objectFit }}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackSrc || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
          }}
        />
      </div>
    )
  }

  // For local images using Next.js Image component
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "animate-pulse bg-muted" : ""}`}
        style={{ objectFit }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
        }}
      />
    </div>
  )
}
