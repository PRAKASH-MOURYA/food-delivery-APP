"use client"

import { useState, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const toast = useCallback(({ title, description, duration = 5000, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, duration, variant }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}

export type { ToastProps }
