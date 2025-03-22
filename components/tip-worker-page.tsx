"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { submitTip } from "@/app/actions/tips"
import { useToast } from "@/components/ui/use-toast"

interface Worker {
  _id: string
  name: string
  role: string
  avatar?: string
  initials?: string
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
              <AvatarImage src={worker.avatar || "/placeholder.svg?height=80&width=80"} alt={worker.name} />
              <AvatarFallback className="text-2xl">{worker.initials || worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{worker.name}</h1>
              <p className="text-muted-foreground">{worker.role}</p>
              {worker.rating && (
                <div className="flex items-center justify-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1">{worker.rating}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-16" onClick={() => setAmount("5")}>
                $5
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("10")}>
                $10
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("15")}>
                $15
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("20")}>
                $20
              </Button>
              <Button variant="outline" className="h-16" onClick={() => setAmount("25")}>
                $25
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

