import { NextResponse } from 'next/server'
import { getWorkerDetailsByAlias } from '@/app/actions/user'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { alias: string } }
) {
  const worker = await getWorkerDetailsByAlias(params.alias)
  
  if (!worker) {
    // If worker not found, redirect to home page
    return redirect('/')
  }

  const session = await getServerSession(authOptions)
  
  if (!session) {
    // If not authenticated, redirect to sign in with return URL
    const returnUrl = `/?worker=${worker._id}`
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`)
  }

  // If authenticated, redirect to the tip page with the worker's ID
  return redirect(`/?worker=${worker._id}`)
} 