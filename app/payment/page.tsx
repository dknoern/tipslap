"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react"

export default function PaymentPage() {
  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "04/25" },
    { id: 2, type: "Mastercard", last4: "5555", expiry: "08/24" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Methods</h1>

        <Card className="max-w-md mx-auto mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Cards</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      {method.type} •••• {method.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardFooter>
        </Card>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Add Funds</CardTitle>
            <CardDescription>Add money to your TipSlap balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-16">
                $5
              </Button>
              <Button variant="outline" className="h-16">
                $10
              </Button>
              <Button variant="outline" className="h-16">
                $20
              </Button>
              <Button variant="outline" className="h-16">
                $50
              </Button>
              <Button variant="outline" className="h-16">
                $100
              </Button>
              <Button variant="outline" className="h-16">
                Custom
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add Funds</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

