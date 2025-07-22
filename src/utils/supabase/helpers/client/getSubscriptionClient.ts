import { createResponse } from "@/helpers/createResponce";
import { createClient } from "@/utils/supabase/client";
import { getUserClient } from "./getUserClient";
import { redirect } from "next/navigation";

export async function getSubscriptionClient() {
  const supabase = createClient()

  // Get current user
  const user = await getUserClient()

  if (user.status === "error") {
    return createResponse("error", user.message)
  }

  if (!user.data?.id) {
    return createResponse("error", "User not found")
  }

  const { data: subscriptionData, error } = await supabase
    .from("subscription")
    .select("*, plan:plan_id(*)")
    .eq("user_id", user.data?.id)
    .single()

  const now = new Date()
  const endDate = new Date(subscriptionData.end_date)
  const graceUntil = subscriptionData.grace_until ? new Date(subscriptionData.grace_until) : null

  if (error) {
    return createResponse("error", error.message)
  } else if (endDate < now && subscriptionData.payment_status === "trialing") {
    return redirect("/subscription/expired-trial")
  } else if (endDate < now && subscriptionData.payment_status === "canceled") {
    return redirect("/subscription/expired-canceled")
  } else if (
    graceUntil !== null &&
    graceUntil < now &&
    subscriptionData.payment_status === "past_due"
  ) {
    return redirect("/subscription/expired-past-due")
  } else {
    return createResponse("success", "Subscription retrieved successfully", {
      user: user.data,
      subscription: subscriptionData,
      plan: subscriptionData.plan,
    })
  }
}
