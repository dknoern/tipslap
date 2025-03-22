'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface SessionUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export async function submitTip(workerId: string, amount: number, note?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Not authenticated')
    }

    const user = session.user as SessionUser

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

    const tippee = await db.collection('users').findOne({
      _id: new ObjectId(workerId)
    })

    if (!tippee) {
      throw new Error('Tippee not found')
    }

    // Create tip record
    const tip = {
      payerId: new ObjectId(tipper._id),
      payerName: tipper.name,
      amount,
      note,
      createdAt: new Date(),
      status: 'completed',
      payeeId: tippee._id,
      payeeName: tippee.name,
      payeeEmail: tippee.email,
    }

    // Insert tip into database
    const result = await db.collection('transactions').insertOne(tip)


    console.log("tip inserted!!!!!!!!", result)

    // Convert ObjectId to string before returning
    return { 
      success: true, 
      tipId: result.insertedId.toString() 
    }
  } catch (error) {
    console.error('Error submitting tip:', error)
    throw error
  }
} 