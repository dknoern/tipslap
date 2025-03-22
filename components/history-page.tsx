"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowDown, ArrowUp, Filter } from "lucide-react"
import { useEffect, useState } from "react"

interface Transaction {
  id: string
  type: "tip" | "promo" | "received" | "sent"
  payeeName: string
  payerName: string
  payeeUsername: string
  payerUsername: string
  amount: number
  date: string
}

export default function HistoryPage({ navigateTo }: { navigateTo: (page: string) => void }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const isReceivedTransaction = (type: Transaction["type"]) => type === "promo"

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" className="flex items-center space-x-2 px-2" onClick={() => navigateTo("home")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
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
            {loading ? (
              <div className="text-center py-4">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-4">No transactions found</div>
            ) : (
              transactions.map((transaction) => {
                const isReceived = isReceivedTransaction(transaction.type)
                return (
                  <div key={transaction.id} className="flex items-center gap-4 py-2">
                    <div className={`rounded-full p-2 ${isReceived ? "bg-green-100" : "bg-red-100"}`}>
                      {isReceived ? (
                        <ArrowDown className={`h-4 w-4 ${isReceived ? "text-green-600" : "text-red-600"}`} />
                      ) : (
                        <ArrowUp className={`h-4 w-4 ${isReceived ? "text-green-600" : "text-red-600"}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{transaction.type === "promo" ? "Sign Up Promo" : transaction.payeeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type === "promo" ? transaction.payerUsername : transaction.payeeUsername}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${isReceived ? "text-green-600" : "text-red-600"}`}>
                            {isReceived ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

