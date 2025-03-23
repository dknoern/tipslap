import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    
    const workers = await users
      .find({ 
        type: 'worker',
        name: { $regex: query, $options: 'i' }
      })
      .limit(10)
      .toArray()
    
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error searching workers:', error)
    return NextResponse.json({ error: 'Failed to search workers' }, { status: 500 })
  }
} 