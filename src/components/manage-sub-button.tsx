"use client"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { createCustomerPortalLink } from "@/actions/paddle/create-customer-portal-link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Subscription } from "@/lib/database.types"

const ManageSubButton = () => {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    const getSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: res } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single()
      setSubscription(res as Subscription)
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
    <Button onClick={() => handleManageSub()}  disabled={loading}>
      {loading ? "Redirecting..." : "Manage subscription"}
    </Button>
  )
}

export default ManageSubButton
