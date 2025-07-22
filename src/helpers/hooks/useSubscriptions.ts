import { useEffect, useState } from "react"
import { Subscription, Plan } from "@/lib/database.types"
import { getSubscriptionClient } from "@/utils/supabase/helpers/client/getSubscriptionClient"

type SubscriptionWithPlan = Subscription & { plans: Plan }

// Simplified hook that only gets the user's active subscription
export function useSubscriptions() {
  const [subscription, setSubscription] = useState<SubscriptionWithPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    setLoading(true)
    setError(null)

    const subscriptionResult = await getSubscriptionClient()

    if (subscriptionResult.status === "error") {
      setError(subscriptionResult.message)
      setLoading(false)
      return
    }

    if (subscriptionResult.data?.subscription) {
      setSubscription(subscriptionResult.data.subscription as SubscriptionWithPlan)
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
