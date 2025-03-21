"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, QrCode, Search, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Worker {
  _id: string
  name: string
  role: string
  avatar?: string
  initials?: string
}

export default function NearbyPage({ navigateTo }: { navigateTo: (page: string, workerId?: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('/api/workers')
        const data = await response.json()
        setWorkers(data)
      } catch (error) {
        console.error('Error fetching workers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

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
        <h1 className="text-2xl font-bold mb-6 text-center">Find Someone to Tip</h1>

        <Tabs defaultValue="nearby" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nearby">
              <MapPin className="h-4 w-4 mr-2" />
              Nearby
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="qrcode">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nearby">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">Service workers near your location</p>

              {loading ? (
                <p className="text-center text-muted-foreground">Loading workers...</p>
              ) : workers.length === 0 ? (
                <p className="text-center text-muted-foreground">No workers found nearby</p>
              ) : (
                workers.map((worker) => (
                  <div key={worker._id} onClick={() => navigateTo("tip", worker._id)}>
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={worker.avatar || "/placeholder.svg?height=40&width=40"} alt={worker.name} />
                            <AvatarFallback>{worker.initials || worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{worker.name}</h3>
                            <p className="text-sm text-muted-foreground">{worker.role}</p>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            Within 50 ft id: {worker._id}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or username"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                {searchQuery ? "No results found" : "Enter a name or username to search"}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="qrcode">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Scan a service worker's QR code</p>
                <Button variant="outline" className="mt-4">
                  Open Camera
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

