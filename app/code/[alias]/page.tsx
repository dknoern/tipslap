import { getWorkerDetailsByAlias } from '@/app/actions/user'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function AliasPage(props: { params: Promise<{ alias: string }> }) {

  const params = await props.params;
  const alias = decodeURIComponent(params.alias);

  console.log("alias page: params", alias)

  const worker = await getWorkerDetailsByAlias(alias)
  
  console.log("alias page: worker", worker)
  if (!worker) {
    console.log("alias page: worker not found")
    // If worker not found, redirect to home page
    redirect('/')
  }

  const session = await getServerSession(authOptions)
  
  if (!session) {
    console.log("alias page: session not found")
    // If not authenticated, redirect to sign in with return URL
    const returnUrl = `/?worker=${worker._id}`
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`)
  }

  console.log("alias page: authenticated, redirecting to tip page for worker", worker._id)
  // If authenticated, redirect to the tip page with the worker's ID
  redirect(`/?worker=${worker._id}`)
} 