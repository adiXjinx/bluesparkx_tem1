import {
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  SubscriptionCanceledEvent,
} from "@paddle/paddle-node-sdk"
import { createClient } from "@/utils/supabase/serverAdmin"
import type { Subscription, Plan, Profile } from "@/lib/database.types"

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        await this.updateSubscriptionData(eventData)
        break
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData)
        break
      case EventName.SubscriptionCanceled:
        await this.updateSubscriptionData(eventData)
        break
      default:
        console.log(`Unhandled webhook event: ${eventData.eventType}`)
        break
    }
  }

  // ! handles creation, update, pause, cancel, and past_due events
  private async updateSubscriptionData(
    eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent | SubscriptionCanceledEvent
  ) {
    const supabase = await createClient()

    try {
      // Get the price ID from the subscription
      const priceId = eventData.data.items[0].price?.id ?? ""

      // Find the corresponding plan in your database
      const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("id, interval, name")
        .eq("paddle_product_id", priceId)
        .single()

      if (planError || !plan) {
        console.error("Plan not found for price ID:", priceId)
        return
      }

      // Get customer details from Paddle to find the user
      const { getPaddleInstance } = await import("@/utils/paddle/get-paddle-instance")
      const paddle = getPaddleInstance()
      const customer = await paddle.customers.get(eventData.data.customerId)

      if (!customer.email) {
        console.error("Customer email not found for customer ID:", eventData.data.customerId)
        return
      }

      // Find the user by email
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("user_id, email")
        .eq("email", customer.email)
        .single()

      if (profileError || !profile) {
        console.error("Profile not found for email:", customer.email)
        return
      }

      // For new subscriptions, update the existing free subscription record
      if (eventData.eventType === EventName.SubscriptionCreated) {
        // Find the existing free subscription for this user
        const { data: existingFreeSubscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", profile.user_id)
          .eq("plan_id", "4f1bae2c-86b7-4cd0-8a52-c86c82520857") // Free plan ID
          .single()

        if (existingFreeSubscription) {
          // Update the existing free subscription to the new paid plan
          // This will be handled by the upsert logic below
          console.log("Updating existing free subscription to paid plan")
        }
      }

      // Use Paddle's provided billing period instead of manual calculation
      // This handles quantity changes, prorations, and other edge cases correctly
      const startDate = new Date(
        eventData.data.currentBillingPeriod?.startsAt ||
          eventData.data.startedAt ||
          eventData.data.createdAt
      )
      const endDate = new Date(
        eventData.data.currentBillingPeriod?.endsAt ||
          eventData.data.startedAt ||
          eventData.data.createdAt
      )

      // Handle payment status and grace period
      let graceUntil = null
      let paymentStatus: "paid" | "past_due" | "canceled" = "paid"

      if (eventData.data.status === "active") {
        paymentStatus = "paid"
        graceUntil = null
      } else if (eventData.data.status === "past_due") {
        paymentStatus = "past_due"
        // Set grace period to 4 days from now
        const gracePeriodDate = new Date()
        gracePeriodDate.setDate(gracePeriodDate.getDate() + 4)
        graceUntil = gracePeriodDate.toISOString()
      } else if (eventData.data.status === "canceled" || eventData.data.status === "paused") {
        paymentStatus = "canceled"
        graceUntil = null
        // end_date should already be calculated based on plan + current period
      }

      // Prepare subscription data matching database schema
      const subscriptionData: Partial<Subscription> = {
        user_id: profile.user_id,
        plan_id: plan.id,
        paddle_subscription_id: eventData.data.id,
        paddle_customer_id: eventData.data.customerId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        updated_at: new Date().toISOString(),
        payment_status: paymentStatus,
        grace_until: graceUntil,
      }

      // Check if subscription already exists by paddle_subscription_id
      const { data: existingSubscriptionByPaddleId } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("paddle_subscription_id", eventData.data.id)
        .single()

      let result
      if (existingSubscriptionByPaddleId) {
        // Update existing subscription that already has this paddle_subscription_id
        result = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("paddle_subscription_id", eventData.data.id)
          .select()
      } else {
        // Check if user has an existing subscription (likely the free one) to update
        const { data: existingUserSubscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", profile.user_id)
          .single()

        if (existingUserSubscription) {
          // Update the existing user subscription (upgrade from free to paid)
          result = await supabase
            .from("subscriptions")
            .update(subscriptionData)
            .eq("user_id", profile.user_id)
            .select()
        } else {
          // Insert new subscription (shouldn't happen in normal flow)
          result = await supabase.from("subscriptions").insert(subscriptionData).select()
        }
      }

      if (result.error) {
        console.error("Error upserting subscription:", result.error)
        throw result.error
      }

      console.log("Subscription processed successfully:", {
        subscriptionId: eventData.data.id,
        userId: profile.user_id,
        planName: plan.name,
        status: eventData.data.status,
      })
    } catch (error) {
      console.error("Error processing subscription webhook:", error)
      throw error
    }
  }
}
