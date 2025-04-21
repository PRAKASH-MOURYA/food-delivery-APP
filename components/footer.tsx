import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">FoodDelivery</h3>
            <p className="text-sm text-muted-foreground">Delicious food delivered to your door</p>
            <div className="flex gap-2 mt-2">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Company</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Information</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">For Restaurants</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Partner with us
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Restaurant Dashboard
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              For Drivers
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodDelivery. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
