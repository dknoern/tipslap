import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ClientApp from "@/components/client-app"
import SplashPage from "@/components/splash-page"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <SplashPage />
  }

  return <ClientApp initialUser={session.user} />
}

