"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { getUserDetails } from "@/app/actions/user"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      })

      if (error) {
        toast.error(error.message)
      } else {
        onSuccess()
      }
    } catch (error) {
      toast.error("An error occurred during payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  )
}

export default function PaymentPage({ navigateTo }: { navigateTo: (page: string) => void }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const { data: session } = useSession()

  const handleAmountSelect = async (amount: number) => {
    if (!session?.user?.email) {
      toast.error("Please sign in to add funds")
      return
    }

    try {
      const user = await getUserDetails(session.user.email)
      if (!user?.id) {
        toast.error("User not found")
        return
      }

      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount,
          userId: user.id 
        }),
      })
      const data = await response.json()
      setClientSecret(data.clientSecret)
      setSelectedAmount(amount)
    } catch (error) {
      toast.error("Failed to initialize payment")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" className="flex items-center space-x-2 px-2" onClick={() => navigateTo("home")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Funds</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Select Amount</CardTitle>
            <CardDescription>Choose how much to add to your balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="h-16"
                  onClick={() => handleAmountSelect(amount)}
                >
                  ${amount}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-16"
                onClick={() => {
                  const amount = prompt("Enter custom amount:")
                  if (amount && !isNaN(Number(amount))) {
                    handleAmountSelect(Number(amount))
                  }
                }}
              >
                Custom
              </Button>
            </div>
          </CardContent>
        </Card>

        {clientSecret && selectedAmount && (
          <Card className="max-w-md mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
              <CardDescription>Enter your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                  },
                }}
              >
                <PaymentForm
                  amount={selectedAmount}
                  onSuccess={() => {
                    toast.success("Payment successful!")
                    setSelectedAmount(null)
                    setClientSecret(null)
                  }}
                />
              </Elements>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

