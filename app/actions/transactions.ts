import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function getTransactions(email: string) {

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection('users').findOne({
        email: email
    })


    if (!user) {
        throw new Error('User not found')
    }

    const userId = new ObjectId(user._id)

    const transactions = await db
        .collection("transactions")
        .find({
            $or: [
                { payerIdId: userId },
                { payeeId: userId }
            ]
        })
        .sort({ date: -1 })
        .toArray()



    return transactions;


} 