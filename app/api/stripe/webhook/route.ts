import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint is working" })
}

export async function POST(req: Request) {
  try {
    console.log("Webhook received")
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")
    console.log("Signature:", signature)

    if (!signature) {
      console.error("No signature found in headers")
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      )
    }

    console.log("Constructing event with secret:", webhookSecret ? "present" : "missing")
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
    console.log("Event type:", event.type)

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const userId = paymentIntent.metadata.userId
      const amount = paymentIntent.amount / 100 // Convert from cents to dollars

      console.log("Payment succeeded:", {
        userId,
        amount,
        paymentIntentId: paymentIntent.id
      })

      if (!userId) {
        console.error("No userId found in payment intent metadata")
        return NextResponse.json(
          { error: "No userId found" },
          { status: 400 }
        )
      }

      const client = await clientPromise
      const db = client.db()
      const users = db.collection("users")

      // Update user's balance using $inc operator
      const result = await users.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { balance: amount } }
      )

      console.log("Database update result:", result)
      console.log(`Added $${amount} to user ${userId}'s balance`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
} 