import { redirect } from "next/navigation"
import React from "react"
import { getSubscriptionServer } from "@/utils/supabase/helpers/server/getSubscriptionServer"

const Hobby = async () => {
  const subscriptionResult = await getSubscriptionServer()

  if (subscriptionResult.status === "error") {
    return redirect("/")
  }

  const planName = subscriptionResult.data?.plan.name ?? "free"

  if (planName !== "hobby" && planName !== "pro") {
    return redirect("/")
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>You are on the {planName} plan</h1>
    </div>
  )
}

export default Hobby
