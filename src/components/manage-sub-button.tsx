"use client"
import { Button } from "@/components/ui/button"
import { createCustomerPortalLink } from "@/actions/paddle/create-customer-portal-link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Subscription } from "@/lib/database.types"
import { getSubscriptionClient } from "@/utils/supabase/helpers/client/getSubscriptionClient"

const ManageSubButton = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    const getSubscription = async () => {
      const subscriptionResult = await getSubscriptionClient()
      if (subscriptionResult.status === "success" && subscriptionResult.data?.subscription) {
        setSubscription(subscriptionResult.data.subscription as Subscription)
      }
    }
    getSubscription()
  }, [])

  const handleManageSub = async () => {
    setLoading(true)
    if (!subscription?.paddle_customer_id) {
      setLoading(false)
      return
    }
    const url = await createCustomerPortalLink(subscription.paddle_customer_id)
    if (url) {
      router.push(url)
      setLoading(false)
    }
  }

  return (
    <Button onClick={() => handleManageSub()} disabled={loading}>
      {loading ? "Redirecting..." : "Manage subscription"}
    </Button>
  )
}

export default ManageSubButton
