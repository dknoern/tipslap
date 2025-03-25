"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, LogOut } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function AccountPage({
  navigateTo,
  user,
  onSignOut,
}: {
  navigateTo: (page: string) => void
  user?: User | null
  onSignOut: () => void
}) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"


  console.log("account page: NODE_ENV", process.env.NODE_ENV)
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
        <h1 className="text-2xl font-bold mb-6 text-center">Account Details</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image || "/placeholder.svg?height=64&width=64"} alt={user?.name || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name || "User"}</CardTitle>
              <CardDescription>{user?.email || "@username"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p>{user?.email || "email@example.com"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h3>
              <p>Service Worker</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">QR Code</h3>
              <div className="flex justify-center my-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={user?.email || "email@example.com"}
                    size={150}
                    level="H"
                    includeMargin={true}
                    className="h-[150px] w-[150px]"
                  />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">Share this QR code to receive tips</p>
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

