"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CreditCard, History, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProps {
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function HomePage({
  navigateTo,
  user,
}: {
  navigateTo: (page: string) => void
  user?: UserProps | null
}) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <div className="flex items-center space-x-2">
              <span className="font-bold">TipTap</span>
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigateTo("account")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container px-4 py-6 md:py-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {user?.name ? `Welcome, ${user.name.split(" ")[0]}` : "Your Digital Tipping Wallet"}
            </h1>
            <p className="max-w-[700px] text-muted-foreground mt-4 mb-8">
              Easily tip service workers with just a few taps
            </p>
          </div>

          <Card className="mx-auto max-w-md mb-8">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <h2 className="text-4xl font-bold">$124.50</h2>
              </div>

              <Button className="w-full h-14 text-lg" size="lg" onClick={() => navigateTo("nearby")}>
                Tip Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col gap-2"
              size="lg"
              onClick={() => navigateTo("account")}
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Account</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col gap-2"
              size="lg"
              onClick={() => navigateTo("history")}
            >
              <History className="h-6 w-6" />
              <span className="text-xs">History</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col gap-2"
              size="lg"
              onClick={() => navigateTo("payment")}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-xs">Payment</span>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

