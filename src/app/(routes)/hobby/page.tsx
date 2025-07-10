import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"

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

  const planName = (data?.plans as any)?.name ?? "free"

  if (planName !== "hobby" && planName !== "pro") {
    return redirect("/")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>You are on the {planName} plan</h1>
    </div>
  )
}

export default Hobby
