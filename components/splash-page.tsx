"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export default function SplashPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`flex min-h-screen flex-col items-center justify-center bg-background p-4 ${inter.className}`}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">TipSlap</h1>
            <p className="mt-2 text-lg text-muted-foreground">The easiest way to tip service workers</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Welcome to TipSlap</CardTitle>
              <CardDescription>Sign in to start tipping service workers with just a few taps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <img src="/placeholder.svg?height=200&width=200" alt="TipSlap Logo" className="h-32 w-32 rounded-full" />
                <p className="text-center text-sm text-muted-foreground">
                  Easily tip valets, bellhops, and other service workers
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
                Sign up with Google
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="underline text-primary hover:text-primary/80"
                >
                  Log in
                </button>
              </div>
            </CardFooter>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

