'use server'

import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

interface SessionUser {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
}
export async function getTransactions() {


    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Not authenticated')
    }

    const user = session.user as SessionUser


    const client = await clientPromise
    const db = client.db()

    const userDetails = await db.collection('users').findOne({
        email: user.email
    })


    if (!userDetails) {
        throw new Error('User not found')
    }

    const userId = new ObjectId(userDetails._id)

    const transactions = await db
        .collection("transactions")
        .find({
            $or: [
                { payerId: userId },
                { payeeId: userId }
            ]
        })
        .sort({ date: -1 })
        .toArray()

        return transactions.map((t: any) => ({
            id: t._id.toString(),
            type: t.type,
            payeeName: t.payeeName,
            payeeUsername: t.payeeUsername,
            payerUsername: t.payerUsername,
            amount: t.amount,
            date: new Date(t.date).toLocaleDateString(),
            payeeImage: t.payeeImage,
            payerImage: t.payerImage,
            payeeRole: t.payeeRole,
          }))



} 