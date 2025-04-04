"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { submitTip } from "@/app/actions/tips"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"

interface Worker {
  _id: string
  name: string
  role: string
  image?: string
  initials?: string
  alias?: string
  rating?: number
}

export default function TipWorkerPage({
  navigateTo,
  workerId,
}: {
  navigateTo: (page: string) => void
  workerId: string | null
}) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/workers/${workerId}`)
        if (!response.ok) {
          throw new Error('Worker not found')
        }
        const data = await response.json()
        setWorker(data)
      } catch (error) {
        console.error('Error fetching worker:', error)
        setError('Failed to load worker details')
      } finally {
        setLoading(false)
      }
    }

    fetchWorker()
  }, [workerId])

  const handleSubmitTip = async () => {
    if (!worker || !amount || amount === "0") return

    setSubmitting(true)
    try {
      await submitTip(worker._id, parseFloat(amount), note)
      toast({
        title: "Tip sent successfully!",
        description: `Your tip of $${amount} has been sent to ${worker.name}`,
      })
      navigateTo("home")
    } catch (error) {
      console.error('Error submitting tip:', error)
      toast({
        title: "Error",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Button variant="ghost" className="flex items-center space-x-2 px-2" onClick={() => navigateTo("nearby")}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 container px-4 py-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading worker details...</p>
        </main>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Button variant="ghost" className="flex items-center space-x-2 px-2" onClick={() => navigateTo("nearby")}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 container px-4 py-6 flex items-center justify-center">
          <p className="text-muted-foreground">{error || 'Worker not found'}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" className="flex items-center space-x-2 px-2" onClick={() => navigateTo("nearby")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={worker.image || "/placeholder.svg?height=80&width=80"} alt={worker.name} />
              <AvatarFallback className="text-2xl">{worker.initials || worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{worker.name}</h1>
              <p className="text-muted-foreground">{worker.alias}</p>
              {worker.rating && (
                <div className="flex items-center justify-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1">{worker.rating}</span>
                </div>
              )}
            </div>




            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">QR Code</h3>
              <div className="flex justify-center my-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={`https://tipslap.com/code/${worker?.alias}` || "email@example.com"}
                    size={150}
                    level="H"
                    includeMargin={true}
                    className="h-[150px] w-[150px]"
                  />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">Share this QR code to receive tips</p>
            </div>





          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-16" onClick={() => setAmount("1")}>
                $1
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("2")}>
                $2
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("5")}>
                $5
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("10")}>
                $10
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("20")}>
                $20
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("0")}>
                Custom
              </Button>
            </div>

            {amount === "0" && (
              <div>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={amount === "0" ? "" : amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-center"
                />
              </div>
            )}

            <div>
              <Input placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={!amount || amount === "0" || submitting}

              onClick={() => {
                handleSubmitTip()
                alert(`Tip of $${amount} sent to ${worker.name}!`)
                navigateTo("home")
              }}
            >
              {submitting ? "Sending..." : `Send $${amount !== "0" ? amount : ""} Tip`}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

