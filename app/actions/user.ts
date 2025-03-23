'use server'

import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

interface SessionUser {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
}
export async function getUserDetails(email: string) {

    console.log("getting user details for", email)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Not authenticated')
    }

    const user = session.user as SessionUser
    const client = await clientPromise
    const db = client.db()

    let userDetails = await db.collection('users').findOne({
        email: user.email
    })

    if (!userDetails) {
        console.log("user not found, will create new user")
        const result = await db.collection('users').insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            joined: new Date(),
            balance: 10.00,
            role: 'user',
            alias: '@' + (user.email?.split('@')[0] || ''),
           
        })

        result.insertedId
        userDetails = await db.collection('users').findOne({ _id: result.insertedId })

        // create new transaction for user
        await db.collection('transactions').insertOne({
            payeeName: 'TipSlap',
            payeeImage: '/whale.png',
            payeeId: userDetails?._id,
            payeeAlias: '@tipslap',
            payerName: 'TipSlap',
            payerImage: '/whale.png',
            payerId:  userDetails?._id,
            payerAlias: '@tipslap',
            amount: 10.00,
            type: 'promo',
            date: new Date(),
        })
    }

    if (!userDetails) {
        throw new Error('Failed to create or find user')
    }

    return {
        id: userDetails._id.toString(),
        name: userDetails.name,
        email: userDetails.email,
        image: userDetails.image,
        role: userDetails.role,
        balance: userDetails.balance,
    }
} 