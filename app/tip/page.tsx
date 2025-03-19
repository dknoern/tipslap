"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Smartphone, User } from "lucide-react"

export default function TipPage() {
  const [amount, setAmount] = useState("")

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
        <h1 className="text-2xl font-bold mb-6 text-center">Send a Tip</h1>

        <Tabs defaultValue="username" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="username">
              <User className="h-4 w-4 mr-2" />
              Username
            </TabsTrigger>
            <TabsTrigger value="qrcode">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="nfc">
              <Smartphone className="h-4 w-4 mr-2" />
              NFC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="username">
            <Card>
              <CardHeader>
                <CardTitle>Find by Username</CardTitle>
                <CardDescription>Enter the username of the person you want to tip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input type="text" placeholder="Enter username" />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Amount ($)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Send Tip</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Scan the service worker's QR code to tip them</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                  <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Camera access required</p>
                  <Button variant="outline" className="mt-4">
                    Open Camera
                  </Button>
                </div>
                <div className="mt-4">
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  Send Tip
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="nfc">
            <Card>
              <CardHeader>
                <CardTitle>NFC Detection</CardTitle>
                <CardDescription>Tap your phone to the service worker's device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                  <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Tap to scan NFC</p>
                  <Button variant="outline" className="mt-4">
                    Start NFC Scan
                  </Button>
                </div>
                <div className="mt-4">
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  Send Tip
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

