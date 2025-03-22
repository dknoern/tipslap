'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId, ClientSession } from "mongodb"

interface SessionUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Tip {
  _id?: ObjectId
  payerId: ObjectId
  payerName: string
  payerImage: string | null
  amount: number
  note?: string
  date: Date
  status: string
  payeeId: ObjectId
  payeeName: string
  payeeEmail: string
  payeeImage: string | null
  payeeRole: string
  type: string
}

export async function submitTip(workerId: string, amount: number, note?: string) {
  try {
    const authSession = await getServerSession(authOptions)
    if (!authSession?.user) {
      throw new Error('Not authenticated')
    }

    const user = authSession.user as SessionUser

    // lookup worker by email

    console.log("+++++user", user)
    console.log("tipping worker id", workerId)
    if (!user.email) {
      throw new Error('User Email not found')
    }

    const client = await clientPromise
    const db = client.db()

    console.log("looking for tipper by email", user.email)

    // get worker by email
    const tipper = await db.collection('users').findOne({ 
      email: user.email
    })
    
    // Get worker details

    if (!tipper) {
      throw new Error('Tipper not found')
    }

    // Check if user has sufficient balance
    if (tipper.balance < amount) {
      throw new Error('Insufficient balance')
    }

    const tippee = await db.collection('users').findOne({
      _id: new ObjectId(workerId)
    })

    if (!tippee) {
      throw new Error('Tippee not found')
    }

    // Create tip record
    const tip: Tip = {
      payerId: new ObjectId(tipper._id),
      payerName: tipper.name,
      payerImage: tipper.image,
      amount,
      note,
      date: new Date(),
      status: 'completed',
      payeeId: tippee._id,
      payeeName: tippee.name,
      payeeEmail: tippee.email,
      payeeImage: tippee.image,
      payeeRole: tippee.role,
      type: 'tip'
    }

    // Start a transaction to ensure atomicity
    const mongoSession = client.startSession()
    try {
      await mongoSession.withTransaction(async () => {
        // Insert tip into database
        const result = await db.collection('transactions').insertOne(tip)
        tip._id = result.insertedId

        // Reduce tipper's balance
        await db.collection('users').updateOne(
          { _id: tipper._id },
          { $inc: { balance: -amount } }
        )

        // Increase tippee's balance
        await db.collection('users').updateOne(
          { _id: tippee._id },
          { $inc: { balance: amount } }
        )
      })
    } finally {
      await mongoSession.endSession()
    }

    console.log("tip inserted!!!!!!!!", tip)

    // Convert ObjectId to string before returning
    return { 
      success: true, 
      tipId: tip._id?.toString() 
    }
  } catch (error) {
    console.error('Error submitting tip:', error)
    throw error
  }
} 