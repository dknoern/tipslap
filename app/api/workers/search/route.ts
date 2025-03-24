import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
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
        name: { $regex: query, $options: 'i' },
        _id: { $ne: currentUser._id } // Exclude the current user
      })
      .limit(10)
      .toArray()
    
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error searching workers:', error)
    return NextResponse.json({ error: 'Failed to search workers' }, { status: 500 })
  }
} 