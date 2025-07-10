import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"

interface PlanData {
  plans: {
    name: string
  }
}

const Hobby = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login")
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("plan_id, plans!inner(name)")
    .eq("user_id", user.id)
    .single()

  const planName = (data?.plans as unknown as PlanData["plans"])?.name ?? "free"

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
