"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, LogOut } from "lucide-react"

export default function AccountPage() {
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
        <h1 className="text-2xl font-bold mb-6 text-center">Account Details</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>@johndoe</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p>john.doe@example.com</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
              <p>(555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h3>
              <p>Service Worker</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">QR Code</h3>
              <div className="flex justify-center my-4">
                <div className="bg-white p-4 rounded-lg">
                  <img src="/placeholder.svg?height=150&width=150" alt="QR Code" className="h-[150px] w-[150px]" />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">Share this QR code to receive tips</p>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

