"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  username?: string
  roles?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<User>
  register: (userData: { name: string; email: string; password: string; username: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("user")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true)

    try {
      const userData = await apiLogin(username, password)

      // Ensure we have a name
      const userWithName = {
        ...userData,
        name: userData.name || username.charAt(0).toUpperCase() + username.slice(1),
      }

      setUser(userWithName)
      return userWithName
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    username: string
  }): Promise<void> => {
    setIsLoading(true)

    try {
      await apiRegister({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        roles: ["user"],
      })

      // Auto-login after registration
      await login(userData.username, userData.password)
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
