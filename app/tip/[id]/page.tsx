"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"

// Mock data for workers
const workers = {
  "1": {
    id: 1,
    name: "Michael Torres",
    role: "Valet",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "MT",
    rating: 4.8,
  },
  "2": {
    id: 2,
    name: "Sarah Johnson",
    role: "Bellhop",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "SJ",
    rating: 4.9,
  },
  "3": {
    id: 3,
    name: "David Chen",
    role: "Server",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "DC",
    rating: 4.7,
  },
  "4": {
    id: 4,
    name: "Aisha Williams",
    role: "Concierge",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "AW",
    rating: 4.9,
  },
  "5": {
    id: 5,
    name: "Robert Garcia",
    role: "Doorman",
    avatar: "/placeholder.svg?height=80&width=80",
    initials: "RG",
    rating: 4.6,
  },
}

export default function TipWorkerPage({ params }: { params: { id: string } }) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  // Get worker data based on ID
  const worker = workers[params.id as keyof typeof workers]

  if (!worker) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Link href="/nearby" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 container px-4 py-6 flex items-center justify-center">
          <p>Worker not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/nearby" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={worker.avatar} alt={worker.name} />
              <AvatarFallback className="text-2xl">{worker.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{worker.name}</h1>
              <p className="text-muted-foreground">{worker.role}</p>
              <div className="flex items-center justify-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1">{worker.rating}</span>
              </div>
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
            <Button className="w-full" size="lg" disabled={!amount || amount === "0"}>
              Send ${amount !== "0" ? amount : ""} Tip
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

