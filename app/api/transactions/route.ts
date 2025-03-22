import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const transactions = await db
      .collection("transactions")
      .find({
        $or: [
          { payerUsername: "@dknoern" },
          { payeeUsername: "@dknoern" }
        ]
      })
      .sort({ date: -1 })
      .toArray()
    
    return NextResponse.json(transactions.map((t: any) => ({
      id: t._id.toString(),
      type: t.type,
      payeeName: t.payeeName,
      payeeUsername: t.payeeUsername,
      payerUsername: t.payerUsername,
      amount: t.amount,
      date: new Date(t.date).toLocaleDateString(),
    })))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
} 