import "../../../styles/checkout.css"
import { CheckoutContents } from "@/components/checkout/checkout-contents"
import { createClient } from "@/utils/supabase/server"
import { CheckoutHeader } from "@/components/checkout/checkout-header"
import Header from "@/components/header"
import { redirect } from "next/navigation"
import { PricingTier } from "@/constants/pricing-tier"

export default async function CheckoutPage({ params }: { params: { priceId: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login")
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("plan_id, plans!inner(name, interval)")
    .eq("user_id", user.id)
    .single()

  // Define plan hierarchy (higher number = higher tier)
  const planHierarchy: Record<string, number> = {
    free: 0,
    hobby: 1,
    pro: 2,
  }

  // Get current plan details
  const currentPlanName = (data?.plans as any)?.name?.toLowerCase() || "free"
  const currentPlanInterval = (data?.plans as any)?.interval || "lifetime"

  // Get current plan tier
  const currentPlanTier =
    Object.keys(planHierarchy).find((tier) => currentPlanName.includes(tier)) || "free"

  // Find the target plan based on priceId
  const targetPlan = PricingTier.find((tier) =>
    Object.values(tier.priceId).includes(params.priceId)
  )

  if (targetPlan) {
    const targetPlanTier = targetPlan.id

    // Check if this is a valid upgrade option
    const canUpgrade =
      planHierarchy[targetPlanTier] > planHierarchy[currentPlanTier] ||
      (planHierarchy[targetPlanTier] === planHierarchy[currentPlanTier] &&
        ((currentPlanInterval === "monthly" && targetPlan.priceId.year === params.priceId) ||
          (currentPlanInterval === "yearly" && targetPlan.priceId.month === params.priceId)))

    // If user is trying to downgrade, redirect them
    if (!canUpgrade) {
      return redirect("/private")
    }
  }

  return (
    // ! put back header later
    <>
      <div className="bg-gradient-to-b from-[#0f172a] to-[#143e83]">
        <CheckoutContents userEmail={user?.email} />
      </div>
    </>
  )
}
