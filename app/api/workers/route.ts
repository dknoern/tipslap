import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    
    const workers = await users
      .find({ type: 'worker' })
      .limit(5)
      .toArray()

       console.log("workers", workers)
    
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  }
} 