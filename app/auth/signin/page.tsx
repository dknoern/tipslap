"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { useSearchParams } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`flex min-h-screen flex-col items-center justify-center bg-background p-4 ${inter.className}`}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">TipTap</h1>
            <p className="mt-2 text-lg text-muted-foreground">Sign in to your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Sign in to access your TipTap account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <img src="/placeholder.svg?height=200&width=200" alt="TipTap Logo" className="h-32 w-32 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={() => signIn("google", { callbackUrl })}>
                Sign in with Google
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <a href="/" className="underline text-primary hover:text-primary/80">
                  Sign up
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}

