"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, User, LogIn, LogOut, UserPlus, Package, Heart, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import CartSheet from "@/components/cart-sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import LoginForm from "@/components/login-form"

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                  FoodDelivery
                </Link>
                <nav className="flex flex-col gap-2">
                  <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link href="/restaurants" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Restaurants
                  </Link>
                  <Link href="/orders" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user ? (
                    <>
                      <Link href="/profile" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Profile
                      </Link>
                      <button
                        className="text-lg font-medium text-left text-red-500"
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                      <Link href="/register" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">FoodDelivery</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/restaurants" className="font-medium transition-colors hover:text-primary">
              Restaurants
            </Link>
            <Link href="/orders" className="font-medium transition-colors hover:text-primary">
              My Orders
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </CartSheet>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer flex w-full items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="cursor-pointer flex w-full items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                {user.roles?.includes("ROLE_ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <LoginForm />
                </DialogContent>
              </Dialog>
              <Button variant="default" size="sm" asChild className="hidden md:flex">
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="md:hidden">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
