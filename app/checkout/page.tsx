import ProtectedRoute from "@/components/protected-route"
import CheckoutForm from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  )
}
