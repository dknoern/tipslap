"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import NearbyPage from "./nearby-page"
import AccountPage from "./account-page"
import HistoryPage from "./history-page"
import PaymentPage from "./payment-page"
import TipWorkerPage from "./tip-worker-page"
import HomePage from "./home-page"

const inter = Inter({ subsets: ["latin"] })

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function ClientApp({ initialUser }: { initialUser?: User }) {
  const { data: session } = useSession()
  const user = session?.user || initialUser

  const [currentPage, setCurrentPage] = useState("home")
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)

  // Handle worker ID in URL when app loads
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const workerId = searchParams.get('worker')
    if (workerId) {
      setSelectedWorkerId(workerId)
      setCurrentPage('tip')
      // Clean up URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const navigateTo = (page: string, workerId?: string) => {
    setCurrentPage(page)
    if (workerId) {
      setSelectedWorkerId(workerId)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage navigateTo={navigateTo} user={user} />
      case "nearby":
        return <NearbyPage navigateTo={navigateTo} />
      case "account":
        return <AccountPage navigateTo={navigateTo} user={user} onSignOut={handleSignOut} />
      case "history":
        return <HistoryPage navigateTo={navigateTo} />
      case "payment":
        return <PaymentPage navigateTo={navigateTo} />
      case "tip":
        return <TipWorkerPage navigateTo={navigateTo} workerId={selectedWorkerId} />
      default:
        return <HomePage navigateTo={navigateTo} user={user} />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={inter.className}>{renderPage()}</div>
    </ThemeProvider>
  )
}

