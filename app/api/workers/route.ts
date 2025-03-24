import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    
    // Get the current user's ID
    const currentUser = await users.findOne({ email: session.user.email })
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workers = await users
      .find({ 
        _id: { $ne: currentUser._id } // Exclude the current user
      })
      .sort({ joined: 1 }) // Sort by joined date in descending order
      .limit(5)
      .toArray()
    
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  }
} 