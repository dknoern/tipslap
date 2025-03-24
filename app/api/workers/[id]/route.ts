import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    console.log("worker API: looking for worker with ID", params.id)
    
    const worker = await users.findOne({ 
      _id: new ObjectId(params.id),
    })
    
    if (!worker) {
      console.log("worker API: WORKER NOT FOUND for ID", params.id)
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }

    console.log("worker API: WORKER FOUND", worker)
    
    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error fetching worker:', error)
    return NextResponse.json({ error: 'Failed to fetch worker' }, { status: 500 })
  }
} 