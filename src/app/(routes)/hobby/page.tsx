import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"

interface PlanData {
  plan: {
    name: string
  }
}

const Hobby = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
 

  // Remove authentication check - let middleware handle it
  // The middleware will redirect unauthenticated users to /auth/login

  // Only proceed if user exists (middleware should handle this)
  if (!user) {
    return null // This should never happen due to middleware
  }

  const { data } = await supabase
    .from("subscription")
    .select("*, plan!inner(name)")
    .eq("user_id", user.id)
    .single()
 

  const planName = (data?.plan as unknown as PlanData["plan"])?.name ?? "free"

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
