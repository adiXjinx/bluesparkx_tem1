import "../../../styles/checkout.css"
import { CheckoutContents } from "@/components/checkout/checkout-contents"
import { redirect } from "next/navigation"
import { PricingTier } from "@/constants/pricing-tier"
import { getSubscriptionServer } from "@/utils/supabase/helpers/server/getSubscriptionServer"

interface PlanData {
  plan: {
    name: string
    interval: string
  }
}

export default async function CheckoutPage({ params }: { params: Promise<{ priceId: string }> }) {
  const { priceId } = await params
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   return null // This should never happen due to middleware
  // }

  // const { data } = await supabase
  //   .from("subscription")
  //   .select("plan_id, plan!inner(name, interval)")
  //   .eq("user_id", user.id)
  //   .single()

  const { data, status } = await getSubscriptionServer()
  if (status === "error") {
    return redirect("/auth/login")
  }

  const user = data?.subscription

  // Define plan hierarchy (higher number = higher tier)
  const planHierarchy: Record<string, number> = {
    free: 0,
    hobby: 1,
    pro: 2,
  }

  // Get current plan details
  const currentPlanName = (data?.plan as unknown as PlanData["plan"])?.name?.toLowerCase() || "free"
  const currentPlanInterval = (data?.plan as unknown as PlanData["plan"])?.interval || "lifetime"

  // Get current plan tier
  const currentPlanTier =
    Object.keys(planHierarchy).find((tier) => currentPlanName.includes(tier)) || "free"

  // Find the target plan based on priceId
  const targetPlan = PricingTier.find((tier) => Object.values(tier.priceId).includes(priceId))

  if (targetPlan) {
    const targetPlanTier = targetPlan.id

    // Check if this is a valid upgrade option
    const canUpgrade =
      planHierarchy[targetPlanTier] > planHierarchy[currentPlanTier] ||
      (planHierarchy[targetPlanTier] === planHierarchy[currentPlanTier] &&
        ((currentPlanInterval === "monthly" && targetPlan.priceId.year === priceId) ||
          (currentPlanInterval === "yearly" && targetPlan.priceId.month === priceId)))

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
