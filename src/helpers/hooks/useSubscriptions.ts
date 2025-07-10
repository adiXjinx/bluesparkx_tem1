import { useEffect, useState } from "react"
import { Subscription, Plan } from "@/lib/database.types"
import { createClient } from "@/utils/supabase/client"

type SubscriptionWithPlan = Subscription & { plans: Plan }

// Simplified hook that only gets the user's active subscription
export function useSubscriptions() {
  const [subscription, setSubscription] = useState<SubscriptionWithPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      setError("User not authenticated")
      setLoading(false)
      return
    }

    const { data, error: subError } = await supabase
      .from("subscriptions")
      .select(
        `
          *,
          plans:plan_id (
            id,
            name,
            paddle_product_id,
            interval,
            price,
            is_active,
            discription
          )
        `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (subError) {
      setError(subError.message)
    } else {
      setSubscription(data[0])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  }
}
