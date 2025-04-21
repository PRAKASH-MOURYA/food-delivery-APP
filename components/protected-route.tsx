"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      } else if (adminOnly && !user.roles?.includes("ROLE_ADMIN")) {
        router.push("/")
      }
    }
  }, [user, isLoading, router, adminOnly])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (adminOnly && !user.roles?.includes("ROLE_ADMIN"))) {
    return null
  }

  return <>{children}</>
}
