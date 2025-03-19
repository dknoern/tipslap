"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowDown, ArrowUp, Filter } from "lucide-react"

export default function HistoryPage() {
  const transactions = [
    { id: 1, type: "received", name: "Alex Johnson", username: "@alexj", amount: 15.0, date: "2023-03-19" },
    { id: 2, type: "sent", name: "Maria Garcia", username: "@mgarcia", amount: 10.0, date: "2023-03-18" },
    { id: 3, type: "received", name: "David Kim", username: "@dkim", amount: 20.0, date: "2023-03-17" },
    { id: 4, type: "sent", name: "Sarah Williams", username: "@swilliams", amount: 5.0, date: "2023-03-15" },
    { id: 5, type: "received", name: "James Brown", username: "@jbrown", amount: 12.5, date: "2023-03-14" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Transaction History</h1>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 py-2">
                <div className={`rounded-full p-2 ${transaction.type === "received" ? "bg-green-100" : "bg-red-100"}`}>
                  {transaction.type === "received" ? (
                    <ArrowDown
                      className={`h-4 w-4 ${transaction.type === "received" ? "text-green-600" : "text-red-600"}`}
                    />
                  ) : (
                    <ArrowUp
                      className={`h-4 w-4 ${transaction.type === "received" ? "text-green-600" : "text-red-600"}`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.username}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${transaction.type === "received" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "received" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

