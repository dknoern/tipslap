"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, QrCode, Search, MapPin, Camera } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import debounce from 'lodash/debounce'
import { QrReader } from 'react-qr-reader'
import { useToast } from "@/components/ui/use-toast"

interface Worker {
  _id: string
  name: string
  role: string
  image?: string
  initials?: string
  alias?: string
}

export default function NearbyPage({ navigateTo }: { navigateTo: (page: string, workerId?: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Worker[]>([])
  const [showScanner, setShowScanner] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [isScannerReady, setIsScannerReady] = useState(false)
  const { toast } = useToast()

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

  const searchWorkers = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      try {
        const response = await fetch(`/api/workers/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error('Error searching workers:', error)
      }
    }, 300),
    []
  )

  useEffect(() => {
    searchWorkers(searchQuery)
    return () => {
      searchWorkers.cancel()
    }
  }, [searchQuery, searchWorkers])

  const handleScan = async (data: string | null) => {
    if (!data) return

    try {
      // Check if the scanned data is a valid alias (starts with @)
      if (!data.startsWith('@')) {
        toast({
          title: "Invalid QR Code",
          description: "Please scan a valid service worker QR code",
          variant: "destructive",
        })
        return
      }

      console.log("\n\n\n\nFOUND QR CODE", data, "\n\n\n\n")

      // Search for worker by alias
      const response = await fetch(`/api/workers/search?q=${encodeURIComponent(data)}`)
      const results = await response.json()

      if (results.length > 0) {
        const worker = results[0]
        navigateTo("tip", worker._id)
      } else {
        toast({
          title: "Worker Not Found",
          description: "No service worker found with this QR code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error searching worker:', error)
      toast({
        title: "Error",
        description: "Failed to process QR code",
        variant: "destructive",
      })
    }
  }

  const handleError = (error: Error | null | undefined) => {
    if (!error) return

    // Only log and show errors that are not related to normal scanning
    const errorMessage = error.message || error.toString()
    const isNormalScanningError = 
      errorMessage.includes('No QR code found') || 
      errorMessage.includes('selectBestPatterns') ||
      errorMessage.includes('find') ||
      errorMessage.includes('detect') ||
      errorMessage.includes('decode') ||
      errorMessage === 'e' ||
      errorMessage.includes('Failed to decode') ||
      errorMessage.includes('No patterns found')

    if (!isNormalScanningError) {
      console.error('QR Scanner error:', error)
      toast({
        title: "Scanner Error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive",
      })
    }
  }

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setCameraPermission(result.state)
      
      result.addEventListener('change', () => {
        setCameraPermission(result.state)
      })
    } catch (error) {
      console.error('Error checking camera permission:', error)
      setCameraPermission('denied')
    }
  }

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
      setShowScanner(true)
    } catch (error) {
      console.error('Error requesting camera permission:', error)
      setCameraPermission('denied')
      toast({
        title: "Camera Permission Required",
        description: "Please enable camera access in your browser settings to scan QR codes.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (showScanner) {
      checkCameraPermission()
    }
  }, [showScanner])

  useEffect(() => {
    if (showScanner && cameraPermission === 'granted') {
      // Give the scanner a moment to initialize
      const timer = setTimeout(() => {
        setIsScannerReady(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showScanner, cameraPermission])

  const renderWorkerList = (workers: Worker[]) => {
    if (loading) {
      return <p className="text-center text-muted-foreground">Loading workers...</p>
    }

    if (workers.length === 0) {
      return <p className="text-center text-muted-foreground">No workers found</p>
    }

    return workers.map((worker) => (
      <div key={worker._id} onClick={() => navigateTo("tip", worker._id)}>
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={worker.image || "/placeholder.svg?height=40&width=40"} alt={worker.name} />
                <AvatarFallback>{worker.initials || worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">{worker.alias}</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                Within 50 ft
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ))
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
                renderWorkerList(workers)
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

              <div className="space-y-4">
                {renderWorkerList(searchResults)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qrcode">
            <div className="space-y-4">
              {showScanner ? (
                <div className="relative w-full max-w-md mx-auto aspect-square bg-black rounded-lg overflow-hidden">
                  {cameraPermission === 'granted' ? (
                    <>
                      <div className="absolute inset-0">
                        {!isScannerReady && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <p className="text-sm text-muted-foreground">Initializing camera...</p>
                          </div>
                        )}
                        <QrReader
                          constraints={{ facingMode: 'environment' }}
                          onResult={(result, error) => {
                            console.log(result, error)
                            console.log("\n\n\n\n TEXT FOUND IS ", result?.getText(), "\n\n\n\n")
                            if (result) {
                              handleScan(result.getText())
                            }
                            if (error) {
                              handleError(error)
                            }
                          }}
                          className="w-full h-full"
                          videoId="qr-video"
                          scanDelay={500}
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="absolute top-4 right-4 z-10"
                        onClick={() => {
                          setShowScanner(false)
                          setIsScannerReady(false)
                        }}
                      >
                        Close Camera
                      </Button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        {cameraPermission === 'denied' 
                          ? "Camera access is blocked. Please enable it in your browser settings."
                          : "Please allow camera access to scan QR codes."}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={requestCameraPermission}
                        disabled={cameraPermission === 'denied'}
                      >
                        Allow Camera Access
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                  <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Scan a service worker's QR code</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setShowScanner(true)}
                  >
                    Open Camera
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

